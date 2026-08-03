import jwt from 'jsonwebtoken';
import { AuthenticatedUser } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'devcanvas_default_access_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'devcanvas_default_refresh_secret';

export const generateAccessToken = (user: AuthenticatedUser): string => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): AuthenticatedUser => {
  return jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string };
};
