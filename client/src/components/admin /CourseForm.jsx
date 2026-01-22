import { useEffect, useMemo, useState } from 'react';
import { X, ImagePlus, Save } from 'lucide-react';

import { api } from '../../lib/api';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function CourseForm({ course, onClose, onSaved }) {
  const isEdit = Boolean(course?._id);
  const [form, setForm] = useState({
    language: course?.language || '',
    title: course?.title || '',
    level: course?.level || 'A1',
    description: course?.description || '',
    tags: Array.isArray(course?.tags) ? course.tags.join(', ') : '',
  });
  const [cover, setCover] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const coverPreview = useMemo(() => {
    if (cover) return URL.createObjectURL(cover);
    if (course?.coverImage) return course.coverImage;
    return null;
  }, [cover, course?.coverImage]);

  useEffect(
    () => () => {
      if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    },
    [coverPreview]
  );

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (file && file.size > 8 * 1024 * 1024) {
      setErr('Cover must be under 8MB.');
      return;
    }
    setErr('');
    setCover(file || null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('language', form.language);
      fd.append('title', form.title);
      fd.append('level', form.level);
      if (form.description) fd.append('description', form.description);
      if (form.tags) fd.append('tags', form.tags);
      if (cover) fd.append('cover', cover);

      if (isEdit) {
        await api.put(`/courses/${course._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/courses', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSaved?.();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='bg-white rounded-2xl border shadow-sm overflow-hidden'>
      <div className='px-6 py-4 border-b bg-gradient-to-r from-indigo-600 to-indigo-500 text-white flex items-center justify-between'>
        <div className='font-semibold'>
          {isEdit ? 'Edit course' : 'Create new course'}
        </div>
        <button
          onClick={onClose}
          className='p-1 rounded-lg hover:bg-white/10'
          aria-label='Close'
        >
          <X size={18} />
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className='p-6 grid grid-cols-1 md:grid-cols-5 gap-6'
      >
        <div className='md:col-span-3 space-y-4'>
          {err && (
            <div className='rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700'>
              {err}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-800 mb-1'>
              Language
            </label>
            <input
              required
              className='w-full rounded-xl border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500'
              placeholder='en / de / es…'
              value={form.language}
              onChange={(e) =>
                setForm((f) => ({ ...f, language: e.target.value }))
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-800 mb-1'>
              Title
            </label>
            <input
              required
              className='w-full rounded-xl border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500'
              placeholder='English for Beginners'
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-800 mb-1'>
              Level
            </label>
            <select
              required
              className='w-full rounded-xl border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500'
              value={form.level}
              onChange={(e) =>
                setForm((f) => ({ ...f, level: e.target.value }))
              }
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-800 mb-1'>
              Tags
            </label>
            <input
              className='w-full rounded-xl border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500'
              placeholder='beginner, travel, conversation'
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            />
            <p className='text-xs text-gray-500 mt-1'>Comma-separated list.</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-800 mb-1'>
              Description
            </label>
            <textarea
              rows={5}
              className='w-full rounded-xl border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500'
              placeholder='Course overview…'
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 disabled:opacity-60'
          >
            <Save size={18} />
            {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create course'}
          </button>
        </div>

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-gray-800 mb-2'>
            Cover image
          </label>
          <div className='aspect-video rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden'>
            {coverPreview ? (
              <img
                src={coverPreview}
                alt='Cover'
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='flex flex-col items-center text-gray-500'>
                <ImagePlus size={28} />
                <span className='text-xs mt-1'>Upload up to 8MB</span>
              </div>
            )}
          </div>

          <div className='mt-3'>
            <label className='inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer text-sm font-medium'>
              <ImagePlus size={16} />
              Choose image
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={onFileChange}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
