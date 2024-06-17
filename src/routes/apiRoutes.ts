import express, { Request, Response } from 'express';
import { getUser, registerUser, loginUser, allUsers, sendFriendRequest, updateFriendRequestStatus, getFriends } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { getInboxMessages, getMessages, sendMessage } from '../controllers/messageController';
const router = express.Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user/info', authenticateToken, getUser);
router.get('/user/allUsers', authenticateToken, allUsers);
router.get('/user/friends', authenticateToken, getFriends);
router.post('/user/friend-request/:receiverId', authenticateToken, sendFriendRequest);
router.put('/user/friend-request',authenticateToken, updateFriendRequestStatus);

router.post('/send-message', authenticateToken, sendMessage);
router.get('/messages/:recipientId',authenticateToken, getMessages);
router.get('/inbox',authenticateToken, getInboxMessages);


router.get('/info', (req: Request, res: Response) => {
  res.json({ message: 'This is some information from the example route' });
});

export default router;
