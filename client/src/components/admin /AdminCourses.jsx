import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ImageOff,
  RefreshCw,
} from 'lucide-react';

import { api } from '../../lib/api';
import CourseForm from '../../components/admin/CourseForm';

export default function AdminCourses() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState('');

  const params = useMemo(() => {
    const p = new URLSearchParams();
    p.set('page', String(page));
    p.set('limit', String(limit));
    if (q) p.set('q', q);
    if (language) p.set('language', language);
    if (level) p.set('level', level);
    return p.toString();
  }, [page, limit, q, language, level]);

  async function fetchCourses() {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get(`/courses?${params}`);
      setItems(data.items || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses(); /* eslint-disable-next-line */
  }, [params]);

  async function onDelete(id) {
    if (!confirm('Delete this course? This will also delete its lessons.'))
      return;
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (e) {
      alert(e?.response?.data?.message || 'Delete failed');
    }
  }

  return (
    <div className='max-w-7xl w-full'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Manage Courses</h1>
          <p className='text-sm text-gray-600'>
            Create, update, and delete courses.
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => fetchCourses()}
            className='inline-flex items-center gap-2 px-3 py-2 rounded-xl shadow-md bg-white hover:bg-gray-50'
            title='Refresh'
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700'
          >
            <Plus size={18} /> New course
          </button>
        </div>
      </div>

      <div className='bg-white shadow-md rounded-2xl p-4 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-800 mb-1'>
              Search
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                <Search size={18} />
              </div>
              <input
                className='w-full pl-10 pr-3 py-2 rounded-xl shadow-md shadow-md-gray-300 focus:ring-2 focus:ring-indigo-500 focus:shadow-md-indigo-500'
                placeholder='Title or description…'
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-800 mb-1'>
              Language
            </label>
            <select
              className='w-full rounded-xl shadow-md shadow-md-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500'
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
          <div>
            <label className='block text-sm font-medium text-gray-800 mb-1'>
              Level
            </label>
            <select
              className='w-full rounded-xl shadow-md shadow-md-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500'
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
            >
              <option value=''>Any</option>
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
        {err && <p className='mt-3 text-sm text-rose-600'>{err}</p>}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
        {items.map((c) => (
          <div
            key={c._id}
            className='bg-white shadow-md rounded-2xl overflow-hidden'
          >
            {c.coverImage ? (
              <img
                src={c.coverImage}
                alt=''
                className='w-full h-40 object-cover'
              />
            ) : (
              <div className='w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400'>
                <ImageOff />
              </div>
            )}
            <div className='p-4'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-lg'>{c.title}</h3>
                <span className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700'>
                  {c.level}
                </span>
              </div>
              <p className='text-sm text-gray-600 mt-1 line-clamp-2'>
                {c.description}
              </p>
              <div className='mt-2 flex flex-wrap gap-1'>
                {(c.tags || []).map((t) => (
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
                  {c.language.toUpperCase()}
                </span>
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      setEditing(c);
                      setCreating(false);
                    }}
                    className='inline-flex items-center gap-1 px-3 py-1.5 rounded-xl shadow-md hover:bg-gray-50'
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(c._id)}
                    className='inline-flex items-center gap-1 px-3 py-1.5 rounded-xl shadow-md shadow-md-rose-300 text-rose-700 hover:bg-rose-50'
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
              <div className='mt-3'>
                <Link
                  to={`/admin/lessons?course=${c._id}`}
                  className='text-sm text-indigo-600 hover:text-indigo-700'
                >
                  Manage lessons →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className='mt-6 flex items-center justify-center gap-2'>
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className='px-3 py-1.5 rounded-lg shadow-md bg-white disabled:opacity-50'
          >
            Prev
          </button>
          <span className='text-sm text-gray-600'>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className='px-3 py-1.5 rounded-lg shadow-md bg-white disabled:opacity-50'
          >
            Next
          </button>
        </div>
      )}

      {(creating || editing) && (
        <div className='fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='w-full max-w-2xl'>
            <CourseForm
              course={editing}
              onClose={() => {
                setCreating(false);
                setEditing(null);
              }}
              onSaved={() => {
                setCreating(false);
                setEditing(null);
                fetchCourses();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
