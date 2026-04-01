import { useMemo } from 'react';
import {
  Mail,
  Shield,
  Languages,
  Award,
  Flame,
  Trophy,
  CalendarClock,
  BookOpenCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='shadow-md rounded-2xl bg-white p-6 text-sm text-gray-700'>
          You need to log in to view your profile.
        </div>
      </div>
    );
  }

  const {
    email,
    role,
    createdAt,
    profile = {},
    gamification = {},
    progress = {},
  } = user;

  const displayName = profile.displayName || email?.split('@')[0] || 'User';
  const avatar = profile.avatar || '';
  const nativeLanguage = profile.nativeLanguage || 'sr';
  const learningLanguages = Array.isArray(profile.learningLanguages)
    ? profile.learningLanguages
    : [];

  const xp = gamification.xp ?? 0;
  const streak = gamification.streakDays ?? 0;
  const lastActiveAt = gamification.lastActiveAt
    ? new Date(gamification.lastActiveAt)
    : null;
  const badges = Array.isArray(gamification.badges) ? gamification.badges : [];

  const joinedAt = createdAt ? new Date(createdAt) : null;

  // simple derived stat: how many lessons have some progress entry
  const lessonsProgress = Array.isArray(progress.lessons)
    ? progress.lessons
    : [];
  const passedCount = lessonsProgress.filter(
    (l) => l.status === 'passed'
  ).length;
  const inProgressCount = lessonsProgress.filter(
    (l) => l.status === 'in_progress'
  ).length;

  const initials = useMemo(() => {
    const n = displayName.trim();
    if (!n) return 'U';
    const parts = n.split(/\s+/);
    const first = parts[0]?.[0];
    const second = parts[1]?.[0];
    return (first || '') + (second || '');
  }, [displayName]);

  return (
    <div className='container mx-auto px-4 py-8 w-full max-w-5xl'>
      {/* Header / Avatar */}
      <div className='shadow-md rounded-2xl bg-white p-6 flex flex-col md:flex-row md:items-center gap-5'>
        <Avatar avatar={avatar} initials={initials} />
        <div className='flex-1'>
          <div className='flex items-center gap-2 flex-wrap'>
            <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>
              {displayName}
            </h1>
            <RolePill role={role} />
          </div>
          <div className='mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-700'>
            <span className='inline-flex items-center gap-2'>
              <Mail size={16} /> {email}
            </span>
            <span className='inline-flex items-center gap-2'>
              <Languages size={16} /> Native: {nativeLanguage.toUpperCase()}
            </span>
            {!!learningLanguages.length && (
              <span className='inline-flex items-center gap-2'>
                <BookOpenCheck size={16} />
                Learning:{' '}
                {learningLanguages.map((l, i) => (
                  <span key={l} className='ml-1'>
                    {l.toUpperCase()}
                    {i < learningLanguages.length - 1 ? ',' : ''}
                  </span>
                ))}
              </span>
            )}
            {joinedAt && (
              <span className='inline-flex items-center gap-2'>
                <CalendarClock size={16} /> Joined:{' '}
                {joinedAt.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          icon={<Trophy size={20} />}
          iconClass='bg-indigo-600 text-white'
          label='Total XP'
          value={xp}
        />
        <StatCard
          icon={<Flame size={20} />}
          iconClass='bg-amber-500 text-white'
          label='Streak'
          value={`${streak} day${streak === 1 ? '' : 's'}`}
        />
        <StatCard
          icon={<BookOpenCheck size={20} />}
          iconClass='bg-slate-900 text-white'
          label='Lessons'
          value={`${passedCount} passed • ${inProgressCount} in progress`}
        />
      </div>

      {/* Badges */}
      <div className='mt-6 shadow-md rounded-2xl bg-white p-6'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='p-2 rounded-xl bg-emerald-600 text-white'>
            <Award size={18} />
          </div>
          <h2 className='text-lg font-semibold'>Badges</h2>
        </div>
        {badges.length ? (
          <div className='flex flex-wrap gap-2'>
            {badges.map((b) => (
              <span
                key={b}
                className='text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700'
              >
                {b}
              </span>
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-600'>
            No badges yet—keep learning! 🎯
          </p>
        )}
      </div>

      {/* Raw progress (optional read-only detail) */}
      {!!lessonsProgress.length && (
        <div className='mt-6 shadow-md rounded-2xl bg-white p-6'>
          <h2 className='text-lg font-semibold mb-3'>Recent Lesson Progress</h2>
          <ul className='divide-y'>
            {lessonsProgress
              .slice() // shallow copy to safely sort
              .sort(
                (a, b) =>
                  new Date(b.completedAt || 0) - new Date(a.completedAt || 0)
              )
              .slice(0, 10)
              .map((lp, idx) => (
                <li
                  key={idx}
                  className='py-3 text-sm flex items-center justify-between'
                >
                  <div className='flex flex-col'>
                    <span className='text-gray-800'>
                      Lesson ID:{' '}
                      <span className='font-medium'>{String(lp.lesson)}</span>
                    </span>
                    <span className='text-gray-500'>
                      Status: <span className='font-medium'>{lp.status}</span>
                      {' • '}
                      Score: {lp.score}/{lp.maxScore} (
                      {lp.percent ??
                        Math.round(
                          ((lp.score || 0) / (lp.maxScore || 1)) * 100
                        )}
                      %)
                    </span>
                  </div>
                  <span className='text-xs text-gray-500'>
                    {lp.completedAt
                      ? new Date(lp.completedAt).toLocaleString()
                      : '—'}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- Small components ---------- */

function Avatar({ avatar, initials }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt='Avatar'
        className='w-20 h-20 rounded-2xl object-cover shadow-sm'
      />
    );
  }
  return (
    <div className='w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-sm'>
      {initials.toUpperCase()}
    </div>
  );
}

function RolePill({ role }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
        isAdmin ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-700'
      }`}
      title={`Role: ${role}`}
    >
      <Shield size={14} />
      {isAdmin ? 'Admin' : 'User'}
    </span>
  );
}

function StatCard({
  icon,
  iconClass = 'bg-gray-900 text-white',
  label,
  value,
}) {
  return (
    <div className='shadow-md rounded-2xl bg-white p-5 flex items-center gap-4'>
      <div className={`p-3 rounded-xl ${iconClass}`}>{icon}</div>
      <div className='flex-1'>
        <p className='text-sm text-gray-600'>{label}</p>
        <p className='text-2xl font-bold'>{value}</p>
      </div>
    </div>
  );
}
