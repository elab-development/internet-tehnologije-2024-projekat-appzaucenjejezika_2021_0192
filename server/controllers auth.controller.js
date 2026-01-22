import bcrypt from 'bcryptjs';

import { User } from '../models/User.model.js';
import cloudinary from '../utils/cloudinary.js';
import { COOKIE_NAME, cookieOptions, setAuthCookie } from '../utils/cookie.js';

export const register = async (req, res) => {
  try {
    const { email, password, displayName, nativeLanguage, learningLanguages } =
      req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let avatarUrl;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'avatars',
            resource_type: 'image',
            transformation: [
              { width: 256, height: 256, crop: 'fill', gravity: 'face' },
            ],
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      avatarUrl = uploadResult.secure_url;
    }

    const user = await User.create({
      email,
      password: passwordHash,
      profile: {
        displayName: displayName || email.split('@')[0],
        avatar: avatarUrl,
        nativeLanguage: nativeLanguage || 'en',
        learningLanguages: Array.isArray(learningLanguages)
          ? learningLanguages
          : [],
      },
      role: 'user',
    });

    setAuthCookie(res, user._id.toString());

    return res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      message: 'Registered successfully',
    });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    setAuthCookie(res, user._id.toString());

    return res.json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      message: 'Logged in successfully',
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (_req, res) => {
  try {
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('[logout]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
