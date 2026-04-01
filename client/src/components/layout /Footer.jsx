import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className='mt-10 border-t border-gray-200 bg-white'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>LingoFlow</h3>
            <p className='mt-2 text-sm text-gray-600'>
              Learn smarter. Track progress per lesson and exercise, from A1 to
              C2.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-semibold text-gray-900'>Product</h4>
              <ul className='mt-2 space-y-2 text-sm'>
                <li>
                  <Link
                    className='hover:text-gray-900 text-gray-600'
                    to='/courses'
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    className='hover:text-gray-900 text-gray-600'
                    to='/dashboard'
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    className='hover:text-gray-900 text-gray-600'
                    to='/profile'
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='text-sm font-semibold text-gray-900'>Company</h4>
              <ul className='mt-2 space-y-2 text-sm'>
                <li>
                  <a className='hover:text-gray-900 text-gray-600' href='#'>
                    Privacy
                  </a>
                </li>
                <li>
                  <a className='hover:text-gray-900 text-gray-600' href='#'>
                    Terms
                  </a>
                </li>
                <li>
                  <a className='hover:text-gray-900 text-gray-600' href='#'>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='flex md:justify-end items-start md:items-center gap-3'>
            <a
              className='p-2 rounded-lg border border-gray-200 hover:bg-gray-50'
              href='#'
              aria-label='GitHub'
            >
              <Github size={18} />
            </a>
            <a
              className='p-2 rounded-lg border border-gray-200 hover:bg-gray-50'
              href='#'
              aria-label='LinkedIn'
            >
              <Linkedin size={18} />
            </a>
            <a
              className='p-2 rounded-lg border border-gray-200 hover:bg-gray-50'
              href='#'
              aria-label='Email'
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className='mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600'>
          <p>© {new Date().getFullYear()} LingoFlow. All rights reserved.</p>
          <p className='inline-flex items-center gap-1'>
            Crafted with <Heart size={14} className='text-rose-500' /> for
            language learners.
          </p>
        </div>
      </div>
    </footer>
  );
}
