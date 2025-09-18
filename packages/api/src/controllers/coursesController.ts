import { Request, Response } from 'express';
import { db } from '../data-source';
import { CoursesService } from '../services/coursesService';
import { LessonsService } from '../services/lessonsService';
import Course from '../entities/courseEntity';
import Lesson from '../entities/lessonEntity';
import { User } from '../entities/userEntity';
import { CompletedLesson } from '../entities/completedLesson';

const coursesService = new CoursesService(db.getRepository(Course));
const lessonsService = new LessonsService(db.getRepository(Course), db.getRepository(Lesson), db.getRepository(User), db.getRepository(CompletedLesson));

export class CoursesController {
  static async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const { name, levels, durationRange } = req.query;
      const skip = parseInt(req.query.skip) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const durationRangeArray = [
        Array.isArray(durationRange) && durationRange.length > 0 ? parseInt(durationRange[0]) : 0,
        Array.isArray(durationRange) && durationRange.length > 1 ? parseInt(durationRange[1]) : 100
      ];
      const result = await coursesService.getCourses(name, levels, durationRangeArray, skip, limit, req);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).send('Error fetching courses');
    }
  }

  static async getCourse(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      let { course, lessons } = await coursesService.getCourse(id, req);
      lessons = await Promise.all(lessons.map(async (lesson) => ({
        ...lesson,
        isPassed: await lessonsService.hasUserCompletedLesson(lesson.lesson_id, req.user.user_id),
      })));
      res.status(200).json({ course, lessons });
    } catch (error) {
      console.error('Error fetching course details:', error);
      res.status(404).send('Course not found');
    }
  }

  static async createCheckoutSession(req: Request, res: Response) {
    try {
      const sessionId = await coursesService.createCheckoutSession(req.body.course, req.user);
      res.json({ id: sessionId });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send('Error processing payment');
    }
  }

  static async getBoughtCourses(req: Request, res: Response): Promise<void> {
    try {
      const userEmail = req.user.email;
      const courses = await coursesService.getUserBoughtCourses(userEmail, req);
      res.status(200).json({ courses });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve courses" });
    }
  }

  static async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseData = req.body;
      if (!req.file) {
        req.file = { path: 'uploads/default-course-image.webp' };
      }
      courseData.image = req.file.path;
      const newCourse = await coursesService.addCourse(courseData, req.user);
      res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).send('Error creating course');
    }
  }

  static async createCourseLesson(req: Request, res: Response): Promise<void> {
    try {
      const courseId = parseInt(req.params.id);
      const newLesson = await lessonsService.createCourseLesson(courseId, req);
      res.status(201).json({ message: 'Course lesson created successfully', id: newLesson.lesson_id });
    } catch (error) {
      console.error('Error creating course lesson:', error);
      res.status(500).send('Error creating course lesson');
    }
  }

  static async getCourseLesson(req: Request, res: Response): Promise<void> {
    try {
      const { lessonId } = req.params;
      const lesson = await lessonsService.getCourseLesson(lessonId, req);
      res.status(200).json({ lesson });
    } catch (error) {
      console.error('Error fetching course lesson:', error);
      res.status(404).send('Course lesson not found');
    }
  }

  static async markLessonCompleted(req: Request, res: Response) {
    try {
      const userId = req.user.user_id;
      const lessonId = parseInt(req.params.id);
      const { answersTests, answersTasks } = req.body;
      console.log(lessonId, userId, answersTests, answersTasks);
      const result = await lessonsService.markLessonAsCompleted(userId, lessonId, answersTests, answersTasks);
      res.status(200).json({ message: result.message, correct: result.correct, total: result.total });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
