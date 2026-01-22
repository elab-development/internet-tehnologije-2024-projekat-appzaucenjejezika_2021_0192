import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  ImageOff,
  PlayCircle,
  CheckCircle2,
  Circle,
  Trophy,
  RefreshCw,
} from 'lucide-react';

import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function CourseDetails() {
  const params = useParams();
  const courseId = params.id || params.courseId;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  async function fetchAll(validId) {
    if (!validId) return; // guard
    setLoading(true);
    setErr('');
    try {
      const [cRes, lRes] = await Promise.all([
        api.get(`/courses/${validId}`),
        api.get(`/lessons/courses/${validId}/lessons?limit=500&sort=order`),
      ]);
      setCourse(cRes.data?.course || cRes.data || null);
      setLessons(lRes.data?.items || []);

      if (user) {
        const pg = await api.get(`/learn/progress/courses/${validId}`);
        setProgress(pg.data || null);
      } else {
        setProgress(null);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll(courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, user]);

  const progressMap = useMemo(() => {
    const map = new Map();
    (progress?.lessons || []).forEach((lp) => map.set(String(lp.lesson), lp));
    return map;
  }, [progress]);

  async function onStart(lessonId) {
    try {
      await api.post(`/learn/lessons/${lessonId}/start`);
      navigate(`/learn/lessons/${lessonId}`);
    } catch (e) {
      alert(e?.response?.data?.message || 'Could not start the lesson');
    }
  }

  if (!courseId) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <div className='shadow-md rounded-2xl bg-white p-6'>
          <p className='text-sm text-gray-700'>
            Missing course id in the URL. Go back to{' '}
            <Link
              to='/courses'
              className='text-indigo-600 hover:text-indigo-700 underline'
            >
              all courses
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <HeaderSkeleton />
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          {[...Array(6)].map((_, i) => (
            <LessonSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <div className='shadow-md rounded-2xl bg-white p-6'>
          <p className='text-rose-700 text-sm'>{err}</p>
          <button
            onClick={() => fetchAll(courseId)}
            className='mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl shadow-md bg-white hover:bg-gray-50'
          >
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='shadow-md rounded-2xl bg-white overflow-hidden'>
        <div className='grid md:grid-cols-3'>
          <div className='md:col-span-1'>
            {course.coverImage ? (
              <img
                src={course.coverImage}
                alt=''
                className='w-full h-48 md:h-full object-cover'
              />
            ) : (
              <div className='h-48 md:h-full w-full bg-gray-100 flex items-center justify-center text-gray-400'>
                <ImageOff />
              </div>
            )}
          </div>
          <div className='md:col-span-2 p-5'>
            <div className='flex items-center justify-between gap-3'>
              <h1 className='text-2xl md:text-3xl font-bold'>{course.title}</h1>
              <span className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700'>
                {course.level}
              </span>
            </div>
            <p className='text-sm text-gray-600 mt-2'>{course.description}</p>

            <div className='mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600'>
              <span className='inline-flex items-center gap-2'>
                <BookOpen size={16} /> {course.lessonCount || lessons.length}{' '}
                lessons
              </span>
              <span className='inline-flex items-center gap-2'>
                <Clock size={16} /> ~{estimateCourseMinutes(lessons)} min total
              </span>
              <span className='inline-flex items-center gap-2'>
                <Trophy size={16} /> {progress?.gamification?.xp ?? 0} XP
              </span>
              <span className='text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700'>
                {course.language?.toUpperCase?.()}
              </span>
            </div>

            {course.tags?.length ? (
              <div className='mt-3 flex flex-wrap gap-1'>
                {course.tags.map((t) => (
                  <span
                    key={t}
                    className='text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700'
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            <div className='mt-4 flex gap-3'>
              <Link
                to='/courses'
                className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-md bg-white hover:bg-gray-50'
              >
                Back to all
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className='mt-8'>
        <div className='flex items-end justify-between mb-3'>
          <div>
            <h2 className='text-xl md:text-2xl font-bold'>Lessons</h2>
            <p className='text-sm text-gray-600'>
              Start from the top and work your way down.
            </p>
          </div>
        </div>

        {lessons.length ? (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
            {lessons.map((l) => {
              const lp = progressMap.get(String(l._id));
              const status = lp?.status || 'not_started';
              const percent = lp?.percent ?? 0;
              const completed = status === 'passed';

              return (
                <div key={l._id} className='shadow-md rounded-2xl bg-white p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700'>
                        #{l.order}
                      </span>
                      <h3 className='font-semibold'>{l.title}</h3>
                    </div>
                    <StatusPill status={status} />
                  </div>

                  {l.objectives?.length ? (
                    <ul className='mt-2 list-disc pl-6 text-sm text-gray-700 space-y-1'>
                      {l.objectives.slice(0, 3).map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className='text-sm text-gray-500 mt-2'>No objectives</p>
                  )}

                  <div className='mt-3 flex items-center justify-between'>
                    <span className='text-xs text-gray-500'>
                      ~{l.estDurationMin} min
                    </span>
                    {user ? (
                      <button
                        onClick={() => onStart(l._id)}
                        className='inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700'
                      >
                        {completed ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <PlayCircle size={16} />
                        )}
                        {completed
                          ? 'Review'
                          : status === 'in_progress'
                          ? 'Continue'
                          : 'Start'}
                      </button>
                    ) : (
                      <Link
                        to='/login'
                        className='text-sm text-indigo-600 hover:text-indigo-700'
                      >
                        Log in to start →
                      </Link>
                    )}
                  </div>

                  <div className='mt-3 h-2 rounded-full bg-gray-100 overflow-hidden'>
                    <div
                      className='h-full bg-indigo-600'
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='shadow-md rounded-2xl bg-white p-6 text-sm text-gray-600'>
            No lessons yet.
          </div>
        )}
      </div>
    </div>
  );
}

function estimateCourseMinutes(lessons) {
  return lessons.reduce((a, l) => a + (l.estDurationMin || 0), 0);
}

function StatusPill({ status }) {
  if (status === 'passed') {
    return (
      <span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-50 text-green-700'>
        <CheckCircle2 size={14} /> Passed
      </span>
    );
  }
  if (status === 'in_progress') {
    return (
      <span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700'>
        <Circle size={14} className='animate-pulse' /> In progress
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700'>
      <Circle size={12} /> Not started
    </span>
  );
}

function HeaderSkeleton() {
  return (
    <div className='shadow-md rounded-2xl bg-white overflow-hidden'>
      <div className='grid md:grid-cols-3'>
        <div className='h-48 md:h-full bg-gray-100 animate-pulse' />
        <div className='p-5 space-y-3 flex-1'>
          <div className='h-6 w-2/3 bg-gray-100 rounded animate-pulse' />
          <div className='h-4 w-11/12 bg-gray-100 rounded animate-pulse' />
          <div className='h-4 w-10/12 bg-gray-100 rounded animate-pulse' />
          <div className='h-4 w-1/2 bg-gray-100 rounded animate-pulse' />
        </div>
      </div>
    </div>
  );
}

function LessonSkeleton() {
  return (
    <div className='shadow-md rounded-2xl bg-white p-4 animate-pulse'>
      <div className='h-4 w-1/2 bg-gray-100 rounded' />
      <div className='mt-3 space-y-2'>
        <div className='h-3 w-full bg-gray-100 rounded' />
        <div className='h-3 w-5/6 bg-gray-100 rounded' />
        <div className='h-3 w-2/3 bg-gray-100 rounded' />
      </div>
      <div className='mt-4 h-2 w-full bg-gray-100 rounded' />
    </div>
  );
}
