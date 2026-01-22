import dotenv from 'dotenv';

dotenv.config();

export const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';

export const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 7,
};
