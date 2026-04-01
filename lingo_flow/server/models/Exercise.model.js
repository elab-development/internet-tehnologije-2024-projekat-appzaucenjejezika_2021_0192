import { Schema, Types } from 'mongoose';

export const ExerciseSchema = new Schema(
  {
    lesson: { type: Types.ObjectId, ref: 'Lesson' },
    type: {
      type: String,
      enum: ['multiple_choice', 'translate', 'fill_gap', 'audio_dictation'],
      required: true,
    },
    prompt: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed },
    media: {
      audioUrl: { type: String },
      imageUrl: { type: String },
    },
    points: { type: Number, default: 10, min: 1 },
  },
  { _id: true, timestamps: true }
);
