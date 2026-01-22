import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, idx) => {
    const path = '/' + segments.slice(0, idx + 1).join('/');
    return {
      name: decodeURIComponent(seg),
      path,
    };
  });

  if (crumbs.length === 0) return null;

  return (
    <nav className='text-sm text-gray-600 my-4'>
      <ol className='flex items-center flex-wrap gap-1'>
        <li>
          <Link to='/' className='hover:text-indigo-600'>
            Home
          </Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.path} className='flex items-center gap-1'>
            <ChevronRight size={14} className='text-gray-400' />
            {i < crumbs.length - 1 ? (
              <Link to={c.path} className='hover:text-indigo-600'>
                {c.name}
              </Link>
            ) : (
              <span className='text-gray-800'>{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
