import { Connection, RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../database';

export const userService = {
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const connection = getConnection();
      const [rows] = await connection.promise().query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      return rows.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      throw new Error('Error checking email');
    }
  },

  async createUser(username: string, email: string, password: string): Promise<number> {
    try {
      const connection = getConnection();
      const [result] = await connection.promise().query<ResultSetHeader>(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  },

};
