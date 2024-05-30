import express, { Request, Response } from 'express';
import { getUser, registerUser } from '../controllers/userController';
const router = express.Router();

router.get('/user/:userId', getUser);
router.post('/user/register', registerUser);

router.get('/info', (req: Request, res: Response) => {
  res.json({ message: 'This is some information from the example route' });
});

export default router;
