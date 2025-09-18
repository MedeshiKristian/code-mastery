import * as express from 'express';
import { Request, Response } from 'express';
import userRoutes from './userRoutes';
import upload from '../middleware/uploadMiddleware';
import getFullPath from '../utils/getFullPath';
import coursesRoutes from './coursesRoutes';

const router = express();

router.use('/', userRoutes);

router.use('/courses', coursesRoutes);

router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (req.file) {
    const filePath = getFullPath(req, req.file.path);
    res.status(201).send({ message: 'File uploaded successfully', path: filePath });
  }
});

export default router;
