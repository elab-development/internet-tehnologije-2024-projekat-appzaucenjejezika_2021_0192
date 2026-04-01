
import jwt from 'jsonwebtoken';

dotenv.config();

@@ -11,3 +12,10 @@ export const cookieOptions = {
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const setAuthCookie = (res, userId) => {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  res.cookie(COOKIE_NAME, token, cookieOptions);
};
