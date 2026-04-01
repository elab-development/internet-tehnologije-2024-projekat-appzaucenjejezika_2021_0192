import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Languages,
  Menu,
  X,
  LogIn,
  LogOut,
  UserRound,
  BookOpen,
  Home,
  Shield,
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { NavItem } from './NavItem/NavItem';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className='sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/75 bg-white/90 border-b border-gray-200'>
      <div className='container mx-auto px-4'>
        <div className='h-16 flex items-center justify-between'>
          <Link to='/' className='flex items-center gap-2 group'>
            <div className='p-2 rounded-xl bg-indigo-600 text-white shadow-sm group-hover:scale-105 transition'>
              <Languages size={18} />
            </div>
            <span className='text-lg font-bold tracking-tight text-gray-900'>
              LingoFlow
            </span>
          </Link>

          <nav className='hidden md:flex items-center gap-2'>
            <NavItem to='/' end>
              <Home size={16} />
              Home
            </NavItem>
            <NavItem to='/courses'>
              <BookOpen size={16} />
              Courses
            </NavItem>
            {user && (
              <>
                <NavItem to='/dashboard'>Dashboard</NavItem>
                <NavItem to='/profile'>
                  <UserRound size={16} />
                  Profile
                </NavItem>
              </>
            )}
            {role === 'admin' && (
              <NavItem to='/admin'>
                <Shield size={16} />
                Admin
              </NavItem>
            )}
          </nav>

          <div className='hidden md:flex items-center gap-2'>
            {!user ? (
              <>
                <Link
                  to='/login'
                  className='inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition'
                >
                  <LogIn size={16} />
                  Log in
                </Link>
                <Link
                  to='/register'
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm'
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                onClick={onLogout}
                className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition shadow-sm'
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>

          <button
            className='md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100'
            onClick={() => setOpen((v) => !v)}
            aria-label='Toggle menu'
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className='md:hidden border-t border-gray-200'>
          <div className='container mx-auto px-4 py-3 flex flex-col gap-2'>
            <NavLink
              to='/'
              end
              onClick={() => setOpen(false)}
              className='inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100'
            >
              <Home size={16} />
              Home
            </NavLink>

            <NavLink
              to='/courses'
              onClick={() => setOpen(false)}
              className='inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100'
            >
              <BookOpen size={16} />
              Courses
            </NavLink>

            {user && (
              <>
                <NavLink
                  to='/dashboard'
                  onClick={() => setOpen(false)}
                  className='inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100'
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to='/profile'
                  onClick={() => setOpen(false)}
                  className='inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100'
                >
                  <UserRound size={16} />
                  Profile
                </NavLink>
              </>
            )}

            {role === 'admin' && (
              <NavLink
                to='/admin'
                onClick={() => setOpen(false)}
                className='inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100'
              >
                <Shield size={16} />
                Admin
              </NavLink>
            )}

            {!user ? (
              <>
                <Link
                  to='/login'
                  onClick={() => setOpen(false)}
                  className='inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100'
                >
                  <LogIn size={16} />
                  Log in
                </Link>
                <Link
                  to='/register'
                  onClick={() => setOpen(false)}
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700'
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                onClick={async () => {
                  await onLogout();
                  setOpen(false);
                }}
                className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800'
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
