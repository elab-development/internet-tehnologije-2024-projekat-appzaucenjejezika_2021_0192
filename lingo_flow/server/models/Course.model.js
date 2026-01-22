import mongoose, { Schema } from 'mongoose';

const CourseSchema = new Schema(
  {
    language: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      required: true,
    },
    description: { type: String },
    coverImage: { type: String },
    lessonCount: { type: Number, default: 0, min: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', CourseSchema);
