export default function Layout({ children }) {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50 text-gray-900'>
      <header className='border-b bg-white'>
        <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
          <a href='/' className='font-bold text-xl text-indigo-700'>
            LingoFlow
          </a>
          <nav className='flex gap-3 text-sm'>
            <a href='/' className='hover:underline'>
              Home
            </a>
            <a href='/login' className='hover:underline'>
              Log in
            </a>
            <a href='/register' className='hover:underline'>
              Sign up
            </a>
          </nav>
        </div>
      </header>

      <main className='flex-1 container mx-auto px-4 py-6'>{children}</main>

      <footer className='border-t bg-white'>
        <div className='container mx-auto px-4 py-6 text-sm text-gray-600'>
          © {new Date().getFullYear()} LingoFlow
        </div>
      </footer>
    </div>
  );
}
