import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model<IMessage>('messages', MessageSchema);
