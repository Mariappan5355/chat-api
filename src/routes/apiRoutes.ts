import express, { Request, Response } from 'express';
import { getUser, registerUser, loginUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
const router = express.Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user/info', authenticateToken, getUser);

router.get('/info', (req: Request, res: Response) => {
  res.json({ message: 'This is some information from the example route' });
});

export default router;
