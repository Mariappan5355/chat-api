import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

/**
 * Generate a JWT token for a user.
 * @param {UserPayload} user - The user payload.
 * @param {string} secretKey - The secret key to sign the JWT.
 * @returns {string} The generated JWT token.
 */
export const generateToken = (user: UserPayload, secretKey: string): string => {
    return jwt.sign(user, secretKey, { expiresIn: '1h' });
};

/**
 * Verify a JWT token.
 * @param {string} token - The JWT token to verify.
 * @param {string} secretKey - The secret key to verify the JWT.
 * @returns {UserPayload | null} The decoded token if valid, otherwise null.
 */
export const verifyToken = (token: string, secretKey: string): UserPayload | null => {
    try {
        return jwt.verify(token, secretKey) as UserPayload;
    } catch (error) {
        return null;
    }
};
