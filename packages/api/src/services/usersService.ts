import { Request } from 'express'; 
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import getFullPath from '../utils/getFullPath';
import { User } from '../entities/userEntity';
import stripe from '../config/stripe';

export class UsersService {
  constructor(private userRepository: Repository<User>) {}

  async register(email: string, password: string, first_name: string, last_name: string, role: string) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const userExists = await this.userRepository.findOneBy({ email });
    if (userExists) {
      throw new Error("Email already taken");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      role,
    });
    await this.userRepository.save(newUser);
    return "User registered successfully";
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.JWT_SECRET || 'your_secret_key', {
      expiresIn: "1h",
    });
    return token;
  }

  // async logout() {
  //   Nothing to do in service for logout as it just clears cookie handled in controller
  // }

  async getProfile(userId: number, req: Request) {
    const user = await this.userRepository.findOneBy({ user_id: userId });
    user.avatar_url = getFullPath(req, user.avatar_url);
    return user;
  }

  async updateProfile(userId: number, data: any, file: any) {
    const user = await this.userRepository.findOneBy({ user_id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const oldEmail = user.email;
    Object.keys(data).forEach(key => {
      if (key in user && data[key] !== undefined) {
        console.log(key, data[key]);
        user[key] = data[key];
      }
    });
    if (file && file.path) {
      user.avatar_url = file.path;
    }
    await this.userRepository.save(user);

    await this.syncWithStripe(oldEmail, user);

    return user;
  }

  private async syncWithStripe(oldEmail: string, user: User) {
    try {
      const customers = await stripe.customers.list({ email: oldEmail, limit: 1 });
      const customer = customers.data.length > 0 ? customers.data[0] : null;
      
      if (customer) {
        await stripe.customers.update(customer.id, {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email
        });
      } else {
        console.log("No corresponding Stripe customer found; consider whether to create one.");
      }
    } catch (error) {
      console.error("Failed to synchronize with Stripe:", error);
    }
  }
}
