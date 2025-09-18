import { Request, Response } from 'express';
import { UsersService } from '../services/usersService';
import { db } from '../data-source';
import { User } from '../entities/userEntity';

const userService = new UsersService(db.getRepository(User));

export class UsersController {
  static async register(req: Request, res: Response): Promise<Response> {
    try {
      const message = await userService.register(req.body.email, req.body.password, req.body.first_name, req.body.last_name, req.body.role);
      return res.status(201).json({ message });
    } catch (error) {
      return res.status(error.message === "email already taken" ? 409 : 400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const token = await userService.login(req.body.email, req.body.password);
      res.cookie('jwt', token, { httpOnly: true });
      return res.json({ message: "Logged in successfully" });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }

  static async logout(req: Request, res: Response): Promise<Response> {
    res.clearCookie('jwt', { httpOnly: true });
    return res.status(200).json({ message: "Logged out successfully" });
  }

  static async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const user = await userService.getProfile(req.user.user_id, req);
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const user = await userService.updateProfile(req.user.user_id, req.body, req.file);
      return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
