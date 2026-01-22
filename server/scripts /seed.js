import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import { Course } from '../models/Course.model.js';
import { Lesson } from '../models/Lesson.model.js';

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function sentence(...parts) {
  return parts.filter(Boolean).join(' ');
}
function titleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildLessonsForCourse(course) {
  const baseObjectives = [
    'Learn basic greetings',
    'Introduce yourself',
    'Understand simple questions',
    'Practice everyday phrases',
    'Build core vocabulary',
    'Master simple grammar rules',
  ];

  const basePhrases = [
    ['Hello', 'Hello', 'General greeting'],
    ['Thank you', 'Thank you', 'Polite phrase'],
    ['How are you?', 'How are you?', 'Common question'],
    ['My name is…', 'My name is…', 'Self-introduction'],
    ['I would like…', 'I would like…', 'Polite request'],
  ];

  const lessonsCount = 3 + Math.floor(Math.random() * 3); // 3..5
  const lessons = [];

  for (let i = 1; i <= lessonsCount; i++) {
    const lessonId = new Types.ObjectId();
    const order = i;
    const title = `${titleCase(course.language)} ${course.level} • Lesson ${i}`;
    const objectives = [
      rand(baseObjectives),
      rand(baseObjectives),
      rand(baseObjectives),
    ].filter((v, idx, a) => a.indexOf(v) === idx); // uniq

    const phrases = basePhrases
      .slice(0, 3 + Math.floor(Math.random() * 3))
      .map(([native, target, note]) => ({ native, target, note }));

    const content = {
      introText: sentence(
        `Welcome to Lesson ${i} of the ${course.title} course.`,
        'You will learn high-frequency words and practice short dialogues.'
      ),
      phrases,
      grammarNotes:
        i === 1
          ? 'Simple present tense; personal pronouns.'
          : 'Word order and basic question forms.',
    };

    const ex = [];

    ex.push({
      _id: new Types.ObjectId(),
      lesson: lessonId,
      type: 'multiple_choice',
      prompt: 'Pick the correct greeting.',
      options: ['Goodbye', 'Hello', 'Please'],
      correctAnswer: 'Hello',
      points: 10,
      media: {},
    });

    ex.push({
      _id: new Types.ObjectId(),
      lesson: lessonId,
      type: 'translate',
      prompt: 'Translate: "My name is Alex."',
      options: [],
      correctAnswer: 'My name is Alex.',
      points: 15,
      media: {},
    });

    ex.push({
      _id: new Types.ObjectId(),
      lesson: lessonId,
      type: 'fill_gap',
      prompt: 'Fill in the blank: "___ are you?"',
      options: [],
      correctAnswer: 'How',
      points: 10,
      media: {},
    });

    if (Math.random() > 0.5) {
      ex.push({
        _id: new Types.ObjectId(),
        lesson: lessonId,
        type: 'multiple_choice',
        prompt: 'Choose the polite phrase for a request.',
        options: ['I want', 'Give me', 'I would like'],
        correctAnswer: 'I would like',
        points: 10,
        media: {},
      });
    }

    lessons.push({
      _id: lessonId,
      course: course._id,
      order,
      title,
      objectives,
      content,
      exercises: ex,
      passThresholdPercent: 70,
      estDurationMin: 10 + Math.floor(Math.random() * 10),
    });
  }

  return lessons;
}

const COURSES = [
  ['en', 'A1', 'English for Beginners', ['beginner', 'conversation', 'travel']],
  [
    'en',
    'B1',
    'English Intermediate Essentials',
    ['intermediate', 'grammar', 'vocabulary'],
  ],
  ['de', 'A1', 'German for Beginners', ['beginner', 'daily-life']],
  ['de', 'B1', 'German Speaking Practice', ['speaking', 'listening']],
  ['es', 'A2', 'Spanish for Everyday Use', ['beginner', 'phrases']],
  ['es', 'B2', 'Spanish Advanced Conversations', ['advanced', 'conversation']],
  ['fr', 'A1', 'French Basics', ['beginner', 'pronunciation']],
  ['fr', 'B1', 'French Communication Skills', ['intermediate', 'dialogues']],
  ['sr', 'A1', 'Serbian from Scratch', ['alphabet', 'beginner']],
  ['it', 'A2', 'Italian Traveler Toolkit', ['travel', 'phrases']],
];

function buildCourseDoc([language, level, title, tags]) {
  return {
    language,
    title,
    level,
    description: `A structured ${title} course with bite-sized lessons, practical exercises, and clear objectives.`,
    coverImage: '',
    lessonCount: 0,
    tags,
  };
}

async function main() {
  const { MONGO_URI } = process.env;
  if (!MONGO_URI) {
    console.error('Missing MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const reset = process.argv.includes('--reset');
  if (reset) {
    console.log('Reset mode: clearing Courses & Lessons…');
    await Lesson.deleteMany({});
    await Course.deleteMany({});
  }

  const courseDocs = COURSES.map(buildCourseDoc);
  const createdCourses = await Course.insertMany(courseDocs);
  console.log(`Inserted ${createdCourses.length} courses`);

  let totalLessons = 0;
  for (const c of createdCourses) {
    const lessons = buildLessonsForCourse(c);
    if (lessons.length) {
      await Lesson.insertMany(lessons);
      totalLessons += lessons.length;

      await Course.findByIdAndUpdate(c._id, { lessonCount: lessons.length });
    }
  }

  console.log(`Inserted ${totalLessons} lessons (with embedded exercises)`);

  await mongoose.connection.close();
  console.log('Seed finished, connection closed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
