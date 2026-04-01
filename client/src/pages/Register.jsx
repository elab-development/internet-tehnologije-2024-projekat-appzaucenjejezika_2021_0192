import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      await register(form, avatar);
      navigate('/');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className='max-w-md mx-auto bg-white shadow rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Create account</h2>
      {err && <p className='text-red-600 text-sm mb-2'>{err}</p>}
      <form onSubmit={onSubmit} className='space-y-3'>
        <input
          className='w-full border rounded p-2'
          placeholder='Display name'
          value={form.displayName}
          onChange={(e) =>
            setForm((f) => ({ ...f, displayName: e.target.value }))
          }
        />
        <input
          className='w-full border rounded p-2'
          placeholder='Email'
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <input
          className='w-full border rounded p-2'
          type='password'
          placeholder='Password'
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        <input
          type='file'
          accept='image/*'
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
        />
        <button className='w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700'>
          Sign up
        </button>
      </form>
    </div>
  );
}
