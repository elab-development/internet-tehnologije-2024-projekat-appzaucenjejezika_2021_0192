import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      await login(form);
      navigate('/');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className='max-w-md mx-auto bg-white shadow rounded-lg p-6'>
      <h2 className='text-xl font-semibold mb-4'>Log in</h2>
      {err && <p className='text-red-600 text-sm mb-2'>{err}</p>}
      <form onSubmit={onSubmit} className='space-y-3'>
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
        <button className='w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700'>
          Log in
        </button>
      </form>
    </div>
  );
}
