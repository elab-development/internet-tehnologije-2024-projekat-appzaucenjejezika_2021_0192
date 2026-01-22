import { Course } from '../models/Course.model.js';
import { Lesson } from '../models/Lesson.model.js';
import cloudinary from '../utils/cloudinary.js';
import { buildCourseQuery } from '../utils/buildCourseQuery.js';

export async function listCourses(req, res) {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      q,
      language,
      level,
      tags,
    } = req.query;

    const query = buildCourseQuery({ q, language, level, tags });

    const [items, total] = await Promise.all([
      Course.find(query)
        .sort(sort)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean(),
      Course.countDocuments(query),
    ]);

    return res.json({
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    console.error('[courses:list]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getCourse(req, res) {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).lean();
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lessonCount = await Lesson.countDocuments({ course: course._id });
    return res.json({ course: { ...course, lessonCount } });
  } catch (err) {
    console.error('[courses:get]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function createCourse(req, res) {
  try {
    const { language, title, level, description, tags } = req.body;

    if (!language || !title || !level) {
      return res
        .status(400)
        .json({ message: 'language, title and level are required' });
    }

    let coverImage;
    if (req.file?.buffer) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'courses',
            resource_type: 'image',
            transformation: [{ width: 1200, height: 675, crop: 'fill' }],
          },
          (error, uploadResult) =>
            error ? reject(error) : resolve(uploadResult)
        );
        stream.end(req.file.buffer);
      });
      coverImage = result.secure_url;
    }

    const normalizedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const course = await Course.create({
      language,
      title,
      level,
      description,
      coverImage,
      tags: normalizedTags,
      lessonCount: 0,
    });

    return res.status(201).json({ message: 'Course created', course });
  } catch (err) {
    console.error('[courses:create]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { language, title, level, description, tags } = req.body;

    const update = {};
    if (language !== undefined) update.language = language;
    if (title !== undefined) update.title = title;
    if (level !== undefined) update.level = level;
    if (description !== undefined) update.description = description;
    if (tags !== undefined) {
      update.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
    }

    if (req.file?.buffer) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'courses',
            resource_type: 'image',
            transformation: [{ width: 1200, height: 675, crop: 'fill' }],
          },
          (error, uploadResult) =>
            error ? reject(error) : resolve(uploadResult)
        );
        stream.end(req.file.buffer);
      });
      update.coverImage = result.secure_url;
    }

    const course = await Course.findByIdAndUpdate(id, update, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lessonCount = await Lesson.countDocuments({ course: course._id });
    course.lessonCount = lessonCount;
    await course.save();

    return res.json({ message: 'Course updated', course });
  } catch (err) {
    console.error('[courses:update]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const del = await Lesson.deleteMany({ course: id });

    return res.json({
      message: 'Course deleted',
      deletedLessons: del.deletedCount || 0,
    });
  } catch (err) {
    console.error('[courses:delete]', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
