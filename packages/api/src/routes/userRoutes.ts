import * as express from 'express';
import { UsersController } from '../controllers/userController';
import upload from '../middleware/uploadMiddleware';
import authMiddleware from '../middleware/authMiddleware';

const userRoutes = express();

userRoutes.get('/', (req, res) => { res.send('User route is working'); });
userRoutes.post('/sign-up', UsersController.register);
userRoutes.post('/sign-in', UsersController.login);
userRoutes.post('/log-out', UsersController.logout);
userRoutes.get('/auth', authMiddleware, (req, res) => { res.status(200).json({ user: req.user }); });

userRoutes.get('/profile', authMiddleware, UsersController.getProfile);
userRoutes.patch('/profile', authMiddleware, upload.single('image'), UsersController.updateProfile);

export default userRoutes;
