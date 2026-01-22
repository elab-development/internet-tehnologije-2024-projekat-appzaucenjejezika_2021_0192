import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (!canceled && data?.user) setUser(data.user);
      } catch (_) {
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  async function login(payload) {
    const { data } = await api.post('/auth/login', payload);
    setUser(data.user);
    return data.user;
  }

  async function register(payload, avatarFile) {
    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => form.append(k, v));
    if (avatarFile) form.append('avatar', avatarFile);
    const { data } = await api.post('/auth/register', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await api.post('/auth/logout');
    setUser(null);
  }

  const value = { user, role: user?.role, loading, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
