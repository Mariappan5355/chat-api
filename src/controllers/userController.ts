import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { userService } from '../services/userService';

export const getUser = ((req: Request, res: Response) => {
    const userId = req.params.userId;
    res.json({ id: userId, name: 'John Doe', email: 'john@example.com' });
});

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const emailExists = await userService.checkEmailExists(email);
    if (emailExists) {
        res.status(400).json({ error: 'Email already in use' });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userService.createUser(username, email, hashedPassword)

    res.json(user);
}

export const updateUser = (req: Request, res: Response) => {
    const userId = req.params.userId;
    const updatedUserData = req.body;
    res.json({ id: userId, ...updatedUserData });
}
