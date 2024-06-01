import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from '../services/userService'; // Adjust the import path as necessary
import { verifyToken } from '../utils/auth';

interface UserPayload {
    id: string;
    email: string;
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    try {
        const decoded = jwt.decode(token) as UserPayload;

        if (!decoded || !decoded.email) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const user = await userService.getUserByEmail(decoded.email);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const jwtSecretKey: string = process.env.JWT_SECRET_KEY || '';

        const verifiedToken = verifyToken(token, jwtSecretKey);
        if (!verifiedToken) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        (req as any).user = verifiedToken;
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Failed to authenticate token' });
    }
};
