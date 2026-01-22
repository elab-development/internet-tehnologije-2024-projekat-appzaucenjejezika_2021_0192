import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);

await mongoose.connect(process.env.MONGO_URI);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`LingoFlow API listening on :${PORT}`));
