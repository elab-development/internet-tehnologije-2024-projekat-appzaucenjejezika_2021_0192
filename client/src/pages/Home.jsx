import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Languages,
  BookOpen,
  Trophy,
  ShieldCheck,
  Sparkles,
  ArrowRightCircle,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { CourseCard } from '../components/public/CourseCard';
import { SkeletonCard } from '../components/public/SkeletonCard';
import { FeatureCard } from '../components/public/FeatureCard';

export default function Home() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/courses?limit=6&sort=-createdAt');
        setCourses(data.items || []);
      } catch (e) {
        setErr(e?.response?.data?.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className='w-full'>
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white' />
        <div className='container mx-auto px-4 py-12 md:py-16'>
          <div className='grid md:grid-cols-2 items-center gap-8'>
            <div>
              <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-4'>
                <Sparkles size={14} />
                Learn languages the fun way
              </div>
              <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900'>
                Level up your skills with{' '}
                <span className='text-indigo-600'>LingoFlow</span>
              </h1>
              <p className='mt-4 text-gray-600 md:text-lg'>
                Bite-sized lessons, smart practice, and progress tracking —
                designed to keep you motivated and consistent.
              </p>

              <div className='mt-6 flex flex-wrap gap-3'>
                <Link
                  to='/courses'
                  className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm'
                >
                  <BookOpen size={18} />
                  Browse courses
                </Link>
                {user ? (
                  <Link
                    to='/dashboard'
                    className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-50'
                  >
                    Continue learning
                    <ArrowRightCircle size={18} />
                  </Link>
                ) : (
                  <Link
                    to='/register'
                    className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border hover:bg-gray-50'
                  >
                    Get started
                    <ArrowRightCircle size={18} />
                  </Link>
                )}
              </div>

              <div className='mt-6 flex items-center gap-6 text-sm text-gray-500'>
                <span className='inline-flex items-center gap-2'>
                  <Trophy size={16} /> Gamified progress
                </span>
                <span className='inline-flex items-center gap-2'>
                  <ShieldCheck size={16} /> Safe & private
                </span>
                <span className='inline-flex items-center gap-2'>
                  <Languages size={16} /> Multi-language
                </span>
              </div>
            </div>

            <div className='relative'>
              <div className='aspect-video rounded-3xl shadow-md bg-white shadow-sm grid grid-cols-2 gap-3 p-3'>
                <div className='rounded-2xl bg-indigo-100/70' />
                <div className='rounded-2xl bg-amber-100/70' />
                <div className='rounded-2xl bg-teal-100/70' />
                <div className='rounded-2xl bg-rose-100/70' />
              </div>
              <div className='absolute -bottom-4 -left-4 hidden md:block'>
                <div className='rounded-2xl bg-white shadow-md shadow p-3 text-sm'>
                  ✅ Daily streaks & XP
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='container mx-auto px-4 py-10'>
        <div className='grid md:grid-cols-3 gap-5'>
          <FeatureCard
            icon={<BookOpen size={18} />}
            title='Structured lessons'
            text='Clear objectives, concise theory, and practical exercises built for retention.'
          />
          <FeatureCard
            icon={<Sparkles size={18} />}
            title='Smart practice'
            text='Different exercise types (MCQ, translate, fill the gap, audio dictation).'
          />
          <FeatureCard
            icon={<Trophy size={18} />}
            title='Progress & rewards'
            text='Track your streaks, earn XP, and collect badges as you learn.'
          />
        </div>
      </section>

      <section className='container mx-auto px-4 pb-14'>
        <div className='flex items-end justify-between mb-4'>
          <div>
            <h2 className='text-xl md:text-2xl font-bold'>Popular courses</h2>
            <p className='text-sm text-gray-600'>
              Hand-picked courses to get you started.
            </p>
          </div>
          <Link
            to='/courses'
            className='text-indigo-600 hover:text-indigo-700 text-sm'
          >
            View all →
          </Link>
        </div>

        {err && (
          <div className='mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700'>
            {err}
          </div>
        )}

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : courses.length ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {courses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        ) : (
          <div className='rounded-2xl border bg-white p-6 text-sm text-gray-600'>
            No courses yet. Check back soon!
          </div>
        )}
      </section>

      <section className='bg-gradient-to-r from-indigo-600 to-indigo-500'>
        <div className='container mx-auto px-4 py-10'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='text-white'>
              <h3 className='text-xl font-semibold'>
                Ready to start learning?
              </h3>
              <p className='text-white/90 text-sm'>
                Join LingoFlow and unlock bite-sized lessons for faster
                progress.
              </p>
            </div>
            <div className='flex gap-3'>
              <Link
                to='/courses'
                className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-900 hover:bg-gray-100'
              >
                Browse courses
              </Link>
              {!user && (
                <Link
                  to='/register'
                  className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/20 text-white hover:bg-black/30'
                >
                  Create account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
