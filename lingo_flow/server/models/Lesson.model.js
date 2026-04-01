import mongoose, { Schema, Types } from 'mongoose';
import { ExerciseSchema } from './Exercise.model.js';

const LessonSchema = new Schema(
  {
    course: {
      type: Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    order: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    objectives: [{ type: String }],
    content: {
      introText: { type: String },
      phrases: [{ native: String, target: String, note: String }],
      grammarNotes: { type: String },
    },
    exercises: { type: [ExerciseSchema], default: [] },
    passThresholdPercent: { type: Number, default: 70, min: 0, max: 100 },
    estDurationMin: { type: Number, default: 10, min: 1 },
  },
  { timestamps: true }
);

export const Lesson = mongoose.model('Lesson', LessonSchema);
