import { Router } from 'express';
import multer from 'multer';
import { register, login, logout } from '../controllers/auth.controller.js';
import { register, login, logout, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

@@ -12,5 +13,6 @@ const upload = multer({
router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
