import { Request } from 'express'; 
import { In, Repository } from 'typeorm';
import { db } from "../data-source";
import { Course } from "../entities/courseEntity";
import validLevels from '../constants/validLevels';
import getFullPath from '../utils/getFullPath';
import stripe from '../config/stripe';
import { User } from '../entities/userEntity';
import { CompletedLesson } from '../entities/completedLesson';
import Lesson from '../entities/lessonEntity';

export class CoursesService {
  constructor(private courseRepository: Repository<Course>) {}

  async getCourses(name: string, levels: string[], durationRange: number[], skip: number, limit: number, req: Request) {
    const levelsArray: string[] = levels?.length > 0 ? levels : validLevels;
    const startDuration = durationRange[0];
    const endDuration = durationRange[1];
    const queryBuilder = db.getRepository(Course).createQueryBuilder('course');
    queryBuilder.where('course.level IN (:...levels)', { levels: levelsArray });
    queryBuilder.andWhere('course.duration BETWEEN :start AND :end', { start: startDuration, end: endDuration });
    if (name) {
      queryBuilder.andWhere('course.name ILIKE :name', { name: `%${name}%` });
    }
    queryBuilder.leftJoinAndSelect('course.author', 'author');
    queryBuilder.skip(skip).take(limit);
    const [courses, resultsLength] = await queryBuilder.getManyAndCount();
    const transformedCourses = courses.map(course => ({
      ...course,
      image: getFullPath(req, course.image),
    }));
    transformedCourses.sort((course1, course2) => course1.course_id - course2.course_id);
    return { courses: transformedCourses, resultsLength };
  }

  async getCourse(courseId: number, req: Request) {
    const course = await this.courseRepository.findOne({
      where: { course_id: courseId },
      relations: ['author', 'lessons'],
    });
    if (!course) {
      throw new Error('Course not found');
    }
    course.image = getFullPath(req, course.image);
    const lessons = course.lessons.map(lesson => ({
      ...lesson,
      attachments: lesson.attachments.map(attachment => ({
        ...attachment,
        path: getFullPath(req, attachment.path),
      })),
    }));
    
    const boughtCourseIds = await this.getBoughtCoursesFromStripe(req.user.email);

    const isAuthor = course.author.user_id === req.user.user_id
    
    return { 
      course: { 
        ...course,
        isAuthor: course.author.user_id === req.user.user_id,
        isBought: isAuthor || boughtCourseIds.includes(courseId.toString()),
      }, 
      lessons, 
    };
  }

  private async findCustomerByEmail(email: string) {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    });
    if (customers.data.length > 0) {
      return customers.data[0];
    }
    return null;
  }
  
  private async findOrCreateCustomer(email: string, firstName: string, lastName: string) {
    const customer = await this.findCustomerByEmail(email);

    if (customer) {
      return customer;
    } else {
      return await stripe.customers.create({
        email: email,
        name: `${firstName} ${lastName}`
      });
    }
  }

  async createCheckoutSession(course: Course, user: User) {
    const customer = await this.findOrCreateCustomer(user.email, user.first_name, user.last_name);

    const lineItems = [{
      price_data: {
        currency: "usd",
        product_data: {
          name: course.name,
          // images: [getFullPath(req, course.image)]
        },
        unit_amount: course.price * 100
      },
      quantity: 1,
    }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/courses/${course.course_id}`,
      cancel_url: `${process.env.CLIENT_URL}/courses/${course.course_id}`,
      customer: customer.id,
      metadata: {
        course_id: course.course_id
      }
    });

    return session.id;
  }

  private async getBoughtCoursesFromStripe(email: string): Promise<string[]> {
    const customer = await this.findCustomerByEmail(email);
    
    if (!customer) {
      return [];
    }
    
    const sessions = await stripe.checkout.sessions.list({
      status: 'complete',
      customer: customer.id,
    });

    const courseIds = sessions.data
      .filter(session => session.metadata && session.metadata.course_id)
      .map(session => session.metadata.course_id);

    return courseIds;
  }

  private async getCoursesByIds(courseIds: string[]): Promise<Course[]> {
    const courses = await this.courseRepository.findBy({
      course_id: In(courseIds)
    });
    return courses;
  }

  async getUserBoughtCourses(userEmail: string, req: Request) {
    try {
      const userId = req.user.user_id;
      const boughtCourseIds = await this.getBoughtCoursesFromStripe(userEmail);
      const boughtCourses = await this.getCoursesByIds(boughtCourseIds);
  
      const coursesWithLessonCounts = await Promise.all(boughtCourses.map(async (course) => {
        const lessons = await db.getRepository(Lesson)
          .createQueryBuilder('lesson')
          .where('lesson.course_id = :courseId', { courseId: course.course_id })
          .getMany();
  
        const totalLessons = lessons.length;
        console.log(totalLessons);
  
        const passedLessons = totalLessons ? await db.getRepository(CompletedLesson)
          .createQueryBuilder('completedLesson')
          .where('completedLesson.user_id = :userId', { userId })
          .andWhere('completedLesson.lesson_id IN (:...lessonIds)', { lessonIds: lessons.map(lesson => lesson.lesson_id) })
          .getCount() 
            : 
          0;
  
        return {
          ...course,
          image: getFullPath(req, course.image),
          total: totalLessons,
          passed: passedLessons,
        };
      }));
  
      return coursesWithLessonCounts;
    } catch (error) {
      console.error("Failed to retrieve bought courses", error);
      throw new Error("Unable to fetch bought courses");
    }
  }
  


  async addCourse(courseData: any, user: User): Promise<Course> {
    const { name, description, instructors, price, duration, level, image } = courseData;

    const newCourse = this.courseRepository.create({
      author: user,
      name,
      description,
      instructors,
      price,
      duration,
      level,
      image
    });

    await this.courseRepository.save(newCourse);

    return newCourse;
  }
}
