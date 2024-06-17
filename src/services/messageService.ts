import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Message as MessageModel, IMessage } from '../models/message';
import { getConnection } from '../database';
import { RowDataPacket } from 'mysql2';

let wss: WebSocketServer;

const userConnections = new Map<string, WebSocket>();

export const messageService = {
  initializeWebSocket: (server: WebSocketServer) => {
    wss = server;

    wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const userId = new URLSearchParams(req.url?.split('?')[1] || '').get('userId');

      if (userId) {
        userConnections.set(userId, ws);
        console.log(`User ${userId} connected`);

        ws.on('close', () => {
          userConnections.delete(userId);
          console.log(`User ${userId} disconnected`);
        });
      } else {
        console.log('User ID not found in URL');
        ws.close(1008, 'User ID not found');
      }
    });
  },

  sendMessage: async (senderId: string, recipientId: string, content: string): Promise<IMessage> => {
    try {

      const message: IMessage = new MessageModel({
        senderId,
        recipientId,
        content,
        timestamp: new Date(),
      });

      await message.save();

      const recipientWs = userConnections.get(recipientId);

      if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        recipientWs.send(JSON.stringify(message));
      }

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  },

  getMessagesForUser: async (currentUserId: string, otherUserId: string): Promise<IMessage[]> => {
    try {
      const messages = await MessageModel.find({
        $or: [
          { senderId: currentUserId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: currentUserId }
        ]
      }).sort({ timestamp: 1 }).exec();
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  },

  getInboxMessages: async (userId: string): Promise<any> => {
    try {
      // Query to fetch messages from MongoDB
      const messages = await MessageModel.aggregate([
        {
          $match: {
            $or: [
              { senderId: userId },
              { recipientId: userId }
            ]
          }
        },
        {
          $sort: { timestamp: -1 }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ['$senderId', userId] },
                '$recipientId',
                '$senderId'
              ]
            },
            lastMessage: { $first: '$$ROOT' }
          }
        },
        {
          $replaceRoot: { newRoot: '$lastMessage' }
        }
      ]);

      const userIds = messages.map((msg: IMessage) => msg.senderId === userId ? msg.recipientId : msg.senderId);
      let inboxMessages:any= [];
      if (userIds.length) {
        const connection = getConnection();
        const query = `SELECT id, name,email FROM users WHERE id IN (${userIds.map(() => '?').join(',')})`;

        const [rows] = await connection.promise().query<RowDataPacket[]>(query, userIds);

        const userNamesMap: { [key: string]: string } = {};
        rows.forEach((row: any) => {
          userNamesMap[row.id] = row.name;
        });

        inboxMessages = messages.map((msg: IMessage) => ({
          ...msg,
          senderName: msg.senderId === userId ? "You" : userNamesMap[msg.senderId]
        }));
      }


      return inboxMessages;
    } catch (error) {
      console.error('Error fetching inbox messages:', error);
      throw new Error('Failed to fetch inbox messages');
    }
  },


};
