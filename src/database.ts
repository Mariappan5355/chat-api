import { createConnection, Connection } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'my_database',
};

let connection: Connection;

export const connectDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    connection = createConnection(dbConfig);

    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        reject(err);
        return;
      }
      console.log('Connected to MySQL database');
      resolve();
    });
  });
};

export const getConnection = (): Connection => {
  if (!connection) {
    throw new Error('Database connection not established');
  }
  return connection;
};
