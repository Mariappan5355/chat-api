import { Connection, RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../database';

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

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

  async getUserByEmail(email: string): Promise<RowDataPacket | null> {
    try {
      const connection = getConnection();
      const [rows] = await connection.promise().query<RowDataPacket[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      console.error('Error retrieving user by email:', error);
      throw new Error('Error retrieving user by email');
    }
  },

  async getAllUsersWithStatus(currentUserId: string, page: number, pageSize: number): Promise<{ data: RowDataPacket[], pagination: { total: number, page: number, pageSize: number, totalPages: number } }> {
    const offset = (page - 1) * pageSize;

    try {
      const connection = getConnection();

      // Fetch total count of users excluding the current user
      const [countRows] = await connection.promise().query<RowDataPacket[]>(
        'SELECT COUNT(*) AS total FROM users WHERE id != ?',
        [currentUserId]
      );
      const total = countRows[0].total;

      // Fetch paginated users with status
      const [rows] = await connection.promise().query<RowDataPacket[]>(
        `
        SELECT 
          users.id,
          users.name,
          users.email,
          CASE 
            WHEN friend_requests.requester_id = ? AND friend_requests.status = 'pending' THEN 'sent'
            WHEN friend_requests.receiver_id = ? AND friend_requests.status = 'pending' THEN 'received'
            ELSE COALESCE(friend_requests.status, 'none') 
          END AS request_status
        FROM users
        LEFT JOIN friend_requests 
          ON (friend_requests.requester_id = users.id AND friend_requests.receiver_id = ?) 
          OR (friend_requests.receiver_id = users.id AND friend_requests.requester_id = ?)
        WHERE users.id != ?
        LIMIT ? OFFSET ?
        `,
        [currentUserId, currentUserId, currentUserId, currentUserId, currentUserId, pageSize, offset]
      );

      const totalPages = Math.ceil(total / pageSize);

      return {
        data: rows,
        pagination: {
          total,
          page,
          pageSize,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error retrieving users with friend request status:', error);
      throw new Error('Error retrieving users with friend request status');
    }
  },

  async getFriends(currentUserId: string, page: number, pageSize: number): Promise<{ data: RowDataPacket[], pagination: Pagination }> {
    const offset = (page - 1) * pageSize;
  
    try {
      const connection = getConnection();
  
      // Fetch total count of friends for the current user
      const [countRows] = await connection.promise().query<RowDataPacket[]>(
        `SELECT COUNT(*) AS total
         FROM friends
         WHERE user_id1 = ? OR user_id2 = ?`,
        [currentUserId, currentUserId]
      );
      const total = countRows[0].total;
  
      const [rows] = await connection.promise().query<RowDataPacket[]>(
     `SELECT DISTINCT users.id, users.name, users.email
       FROM users
       JOIN friends ON (users.id = friends.user_id1 AND friends.user_id2 = ?)
                   OR (users.id = friends.user_id2 AND friends.user_id1 = ?)
       WHERE users.id != ?
       LIMIT ? OFFSET ?`,
        [currentUserId, currentUserId,currentUserId, pageSize, offset]
      );
  
      const totalPages = Math.ceil(total / pageSize);
  
      return {
        data: rows,
        pagination: {
          total,
          page,
          pageSize,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error retrieving friends:', error);
      throw new Error('Error retrieving friends');
    }
  },

  async getUserById(id: string): Promise<RowDataPacket | null> {
    try {
      const connection = getConnection();
      const [rows] = await connection.promise().query<RowDataPacket[]>(
        'SELECT id, name, email FROM users WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      console.error('Error retrieving user by email:', error);
      throw new Error('Error retrieving user by email');
    }
  },

  async sendFriendRequest(requesterId: string, receiverId: string): Promise<void> {
    try {
      const connection = getConnection();
      await connection.promise().query<ResultSetHeader>(
        'INSERT INTO friend_requests (requester_id, receiver_id, status) VALUES (?, ?, ?)',
        [requesterId, receiverId, 'pending']
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw new Error('Error sending friend request');
    }
  },

  async updateFriendRequestStatus(requesterId: string, receiverId: string, status: string): Promise<void> {
    try {
      const connection = getConnection();

      // Update the friend request status
      await connection.promise().query(
        `
  UPDATE friend_requests 
  SET status = ?
  WHERE (requester_id = ? AND receiver_id = ?)
  OR (requester_id = ? AND receiver_id = ?)
  `,
        [status, requesterId, receiverId, receiverId, requesterId]
      );

      if (status === 'accepted') {
        await connection.promise().query(
          `
    INSERT INTO friends (user_id1, user_id2)
    VALUES (?, ?)
    `,
          [requesterId, receiverId]
        );
      }

    } catch (error) {
      console.error('Error updating friend request status:', error);
      throw new Error('Error updating friend request status');
    }
  },

  
};

