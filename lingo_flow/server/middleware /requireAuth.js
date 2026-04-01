import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { COOKIE_NAME } from '../utils/cookie.js';

dotenv.config();

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
