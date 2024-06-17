import bcrypt from 'bcrypt';
import { userService } from '../services/userService';
import Joi from "joi";
import { generateToken } from '../utils/auth';
import { Request, Response } from 'express';

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const getUser = async (req: Request, res: Response) => {
    try {
        if (!(req as any).user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userInfo = await userService.getUserById((req as any).user.id);
        if (!userInfo) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

export const getFriends = async (req: Request, res: Response) => {
    try {
        if (!(req as any).user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const userInfo = await userService.getFriends((req as any).user.id, page, pageSize);

        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};
export const allUsers = async (req: Request, res: Response) => {
    try {
        if (!(req as any).user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const userInfo = await userService.getAllUsersWithStatus((req as any).user.id, page, pageSize);

        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const jwtSecretKey: string = process.env.JWT_SECRET_KEY || '';
        const token = generateToken({ id: user.id, email: user.email }, jwtSecretKey);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { username, email, password } = req.body;
        const emailExists = await userService.checkEmailExists(email);
        if (emailExists) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userService.createUser(username, email, hashedPassword);

        res.json(user);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'An error occurred during registration' });
    }
};

export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        if (!(req as any).user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { receiverId } = req.params;
        const requesterId =(req as any).user.id;

        await userService.sendFriendRequest(requesterId, receiverId);
        res.status(201).json({ message: 'Friend request sent' });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ error: 'An error occurred while sending the friend request' });
    }
};

export const updateFriendRequestStatus = async (req: Request, res: Response) => {
    
    if (!(req as any).user) {
        return res.status(401).json({ error: 'Unauthorized' });
        }
    const { requesterId, status } = req.body;
    const receiverId = (req as any).user.id;
  
    try {
      await userService.updateFriendRequestStatus(requesterId, receiverId, status);
      res.status(200).json({ message: 'Friend request status updated successfully' });
    } catch (error) {
      console.error('Error updating friend request status:', error);
      res.status(500).json({ error: 'An error occurred while updating friend request status' });
    }
  };
