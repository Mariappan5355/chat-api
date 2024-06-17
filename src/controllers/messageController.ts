import { Request, Response } from 'express';
import { messageService } from '../services/messageService';

export const sendMessage = async (req: Request, res: Response) => {
  const { content, recipientId } = req.body;
  const senderId = (req as any).user.id;

  try {
    const message = await messageService.sendMessage(senderId, recipientId, content);
    res.status(200).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  let senderId = (req as any).user.id;
  senderId = String(senderId);

  try {
    const recipientId = req.params.recipientId;

    const messages = await messageService.getMessagesForUser(senderId, recipientId);
    res.status(200).json(messages);
  } catch (error) {
    // console.error('Error sending message in controller:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getInboxMessages = async (req: Request, res: Response) => {
  let userId = (req as any).user.id;
  userId = String(userId);

  try {
    const messages = await messageService.getInboxMessages(userId);
    res.status(200).json(messages);
  } catch (error) {
    // console.error('Error sending message in controller:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }

};
