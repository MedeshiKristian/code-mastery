import * as express from 'express';
import { CoursesController } from '../controllers/coursesController';
import authMiddleware from '../middleware/authMiddleware';
import upload from '../middleware/uploadMiddleware';

const coursesRoutes = express();

coursesRoutes.get('/', CoursesController.getCourses);
coursesRoutes.post('/', authMiddleware, upload.single('image'), CoursesController.createCourse);
coursesRoutes.get('/my', authMiddleware, CoursesController.getBoughtCourses);
coursesRoutes.post('/create-checkout-session', authMiddleware, CoursesController.createCheckoutSession);
coursesRoutes.post('/mark/:id', authMiddleware, CoursesController.markLessonCompleted);

coursesRoutes.get('/:id', authMiddleware, CoursesController.getCourse);
coursesRoutes.post('/:id', authMiddleware, upload.array('attachments'), CoursesController.createCourseLesson);
coursesRoutes.get('/:courseId/:lessonId', authMiddleware, CoursesController.getCourseLesson);


export default coursesRoutes;

