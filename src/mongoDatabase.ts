import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chat',
};

export const connectMongoDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    mongoose.connect(dbConfig.uri).then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};
