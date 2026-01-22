import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import { usePexelsImage } from '../../hooks/usePexelsImage';

export function CourseCard({ course }) {
  const needFallback = !course.coverImage;
  const { url: fallbackUrl } = usePexelsImage(course.language, {
    enabled: needFallback,
  });

  const imgSrc = course.coverImage || fallbackUrl;

  return (
    <div className='bg-white shadow-md rounded-2xl overflow-hidden'>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={`${course.title} cover`}
          className='h-40 w-full object-cover'
          loading='lazy'
        />
      ) : (
        <div className='h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400'>
          <ImageOff />
        </div>
      )}

      <div className='p-4'>
        <div className='flex items-center justify-between'>
          <h4 className='font-semibold line-clamp-1'>{course.title}</h4>
          <span className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700'>
            {course.level}
          </span>
        </div>

        <p className='text-sm text-gray-600 line-clamp-2 mt-1'>
          {course.description}
        </p>

        <div className='mt-2 flex flex-wrap gap-1'>
          {(course.tags || []).slice(0, 4).map((t) => (
            <span
              key={t}
              className='text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full'
            >
              {t}
            </span>
          ))}
        </div>

        <div className='mt-4 flex items-center justify-between'>
          <span className='text-xs text-gray-500'>
            {course.language?.toUpperCase?.()}
          </span>
          <Link
            to={`/courses/${course._id}`}
            className='text-indigo-600 hover:text-indigo-700 text-sm'
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
export function CourseCard({ course }) {
  return (
    <div className='bg-white shadow-md rounded-2xl overflow-hidden'>
      {course.coverImage ? (
        <img
          src={course.coverImage}
          alt=''
          className='h-40 w-full object-cover'
        />
      ) : (
        <div className='h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400'>
          <ImageOff />
        </div>
      )}
      <div className='p-4'>
        <div className='flex items-center justify-between'>
          <h4 className='font-semibold'>{course.title}</h4>
          <span className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700'>
            {course.level}
          </span>
        </div>
        <p className='text-sm text-gray-600 line-clamp-2 mt-1'>
          {course.description}
        </p>
        <div className='mt-2 flex flex-wrap gap-1'>
          {(course.tags || []).slice(0, 4).map((t) => (
            <span
              key={t}
              className='text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full'
            >
              {t}
            </span>
          ))}
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <span className='text-xs text-gray-500'>
            {course.language?.toUpperCase?.()}
          </span>
          <Link
            to={`/courses/${course._id}`}
            className='text-indigo-600 hover:text-indigo-700 text-sm'
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
