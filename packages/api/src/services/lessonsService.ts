import { Request } from 'express';
import { Repository } from "typeorm";
import Course from "../entities/courseEntity";
import Lesson from "../entities/lessonEntity";
import { CompletedLesson } from '../entities/completedLesson';
import { User } from '../entities/userEntity';
import getFullPath from '../utils/getFullPath';

export class LessonsService {
  constructor(private courseRepository: Repository<Course>, 
    private lessonRepository: Repository<Lesson>,
    private userRepository: Repository<User>,
    private completedLessonRepository: Repository<CompletedLesson>
  ) {}

  async getCourseLesson(lessonId: number, req: Request): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { lesson_id: lessonId }, relations: ['course', 'course.author'] });
    if (!lesson) {
      throw new Error('Course lesson not found');
    }
    lesson.attachments = lesson.attachments.map((file) => ({
      ...file,
      path: getFullPath(req, file.path),
    }));
    // const user = await this.courseRepository.findOne({ where: { course_id: lesson.course.course_id }, relations: ['author'] });
    // lesson.isPassed = user.hasPassedBlock(lesson.course.course_id, lesson.id);
    return lesson;
  }

  async hasUserCompletedLesson(lessonId: number, userId: number): Promise<boolean> {
    const completedLesson = await this.completedLessonRepository.findOne({
      where: {
        lesson: { lesson_id: lessonId },
        user: { user_id: userId }
      }
    });

    return !!completedLesson;
  }

  async createCourseLesson(courseId: number, req: Request): Promise<Lesson> {
    const userId = req.user.user_id;
    const course = await this.courseRepository.findOne({ where: { course_id: courseId }, relations: ['author'] });
    if (!course) {
      throw new Error('Course not found');
    }
    if (course.author.user_id !== userId) {
      throw new Error('You are not the author of this course');
    }
    const data = JSON.parse(req.body.jsonData) as Lesson;
    data.course = course;
    data.attachments = req.files?.map((file) => ({
      path: file.path,
      originalName: file.originalname,
    }));
    const newCourseLesson = this.lessonRepository.create(data);
    await this.lessonRepository.save(newCourseLesson);
    return newCourseLesson;
  }

  async markLessonAsCompleted(userId: number, lessonId: number, answersTests: string[], answersTasks: string[]) {
    const lesson = await this.lessonRepository.findOne({ where: { lesson_id: lessonId } });
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    let correct = 0;
    let total = 0;

    if (lesson.tasks) {
      total += lesson.tasks.length;
      lesson.tasks.forEach((task, index) => {
        if (answersTasks?.[index] === task.answer) {
          correct += 1;
        }
      });
    }

    if (lesson.tests) {
      total += lesson.tests.length;
      lesson.tests.forEach((test, index) => {
        if (answersTests?.[index] === test.options[test.correctOptionIndex]) {
          correct += 1;
        }
      });
    }

    const isCompleted = total === correct;
    if (!isCompleted) {
      return {
        message: 'Some answers are incorrect',
        correct,
        total,
      };
    }
    
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    const completedLesson = this.completedLessonRepository.create({ user, lesson });
    // const completedLesson = new CompletedLesson();
    // completedLesson.user = user;
    // completedLesson.lesson = lesson;
    // completedLesson.isCompleted = isCompleted;
    // completedLesson.correctAnswers = correct;
    // completedLesson.totalAnswers = total;

    await this.completedLessonRepository.save(completedLesson);

    return {
      message: 'Lesson marked as completed',
      correct,
      total,
    };
  }
}