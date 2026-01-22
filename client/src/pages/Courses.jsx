import { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { api } from '../lib/api';
import { CourseCard } from '../components/public/CourseCard';
import { SkeletonCard } from '../components/public/SkeletonCard';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SORTS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'title', label: 'Title (A–Z)' },
  { value: 'level', label: 'Level (A1→C2)' },
];

export default function Courses() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [tags, setTags] = useState(''); // comma-separated for backend `tags` query
  const [sort, setSort] = useState('-createdAt');

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Build query string for GET /courses
  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set('page', String(page));
    p.set('limit', String(limit));
    if (q) p.set('q', q);
    if (language) p.set('language', language);
    if (level) p.set('level', level);
    if (tags.trim()) p.set('tags', tags.trim()); // backend supports comma-separated or array
    if (sort) p.set('sort', sort);
    return p.toString();
  }, [page, limit, q, language, level, tags, sort]);

  async function fetchCourses() {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get(`/courses?${params}`);
      setItems(data.items || []);
      const pg = data.pagination || {};
      setPages(pg.pages || 1);
      setTotal(pg.total || 0);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses(); // eslint-disable-next-line
  }, [params]);

  function resetFilters() {
    setQ('');
    setLanguage('');
    setLevel('');
    setTags('');
    setSort('-createdAt');
    setPage(1);
  }

  return (
    <div className='w-full'>
      {/* Header */}
      <section className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold'>Courses</h1>
            <p className='text-sm text-gray-600'>
              Browse all available courses. Use filters to find your match.
            </p>
          </div>
          <button
            onClick={fetchCourses}
            className='inline-flex items-center gap-2 px-3 py-2 rounded-xl shadow-md bg-white hover:bg-gray-50'
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </section>

      {/* Filters (shadow only, no borders) */}
      <section className='container mx-auto px-4 pb-6'>
        <div className='shadow-md rounded-2xl bg-white p-4'>
          <div className='grid grid-cols-1 md:grid-cols-6 gap-3'>
            {/* Search */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-800 mb-1'>
                Search
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                  <Search size={18} />
                </div>
                <input
                  className='w-full pl-10 pr-3 py-2 rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-500'
                  placeholder='Title or description…'
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {/* Language */}
            <div>
              <label className='block text-sm font-medium text-gray-800 mb-1'>
                Language
              </label>
              <select
                className='w-full rounded-xl py-2 px-3 shadow-inner focus:ring-2 focus:ring-indigo-500'
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setPage(1);
                }}
              >
                <option value=''>Any</option>
                <option value='en'>English (en)</option>
                <option value='de'>German (de)</option>
                <option value='es'>Spanish (es)</option>
                <option value='fr'>French (fr)</option>
                <option value='sr'>Serbian (sr)</option>
              </select>
            </div>

            {/* Level */}
            <div>
              <label className='block text-sm font-medium text-gray-800 mb-1'>
                Level
              </label>
              <select
                className='w-full rounded-xl py-2 px-3 shadow-inner focus:ring-2 focus:ring-indigo-500'
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setPage(1);
                }}
              >
                <option value=''>Any</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags (comma-separated) */}
            <div>
              <label className='block text-sm font-medium text-gray-800 mb-1'>
                Tags
              </label>
              <input
                className='w-full rounded-xl py-2 px-3 shadow-inner focus:ring-2 focus:ring-indigo-500'
                placeholder='e.g. beginner, conversation'
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Sort */}
            <div>
              <label className='block text-sm font-medium text-gray-800 mb-1'>
                Sort by
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                  <SlidersHorizontal size={16} />
                </div>
                <select
                  className='w-full pl-9 rounded-xl py-2 px-3 shadow-inner focus:ring-2 focus:ring-indigo-500'
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* quick row */}
          <div className='mt-3 flex items-center justify-between'>
            {err ? (
              <p className='text-sm text-rose-600'>{err}</p>
            ) : (
              <span className='text-sm text-gray-500'>
                Showing page {page} of {pages} {total ? `• ${total} total` : ''}
              </span>
            )}
            <button
              onClick={resetFilters}
              className='text-sm text-gray-700 hover:text-gray-900 underline'
            >
              Reset filters
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className='container mx-auto px-4 pb-10'>
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : items.length ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {items.map((c) => (
              <div
                key={c._id}
                className='shadow-md rounded-2xl overflow-hidden bg-white'
              >
                <CourseCard course={c} />
              </div>
            ))}
          </div>
        ) : (
          <div className='shadow-md rounded-2xl bg-white p-6 text-sm text-gray-600'>
            No courses match your filters.
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className='mt-6 flex items-center justify-center gap-2'>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className='px-3 py-1.5 rounded-lg shadow-md bg-white disabled:opacity-50'
            >
              Prev
            </button>
            <span className='text-sm text-gray-600'>
              Page {page} of {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className='px-3 py-1.5 rounded-lg shadow-md bg-white disabled:opacity-50'
            >
              Next
            </button>

            {/* Page size */}
            <select
              className='ml-3 rounded-lg py-1.5 px-2 shadow-md bg-white'
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              {[6, 12, 18, 24].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </section>
    </div>
  );
}
