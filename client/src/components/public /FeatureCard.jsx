export function FeatureCard({ icon, title, text }) {
  return (
    <div className='rounded-2xl shadow-md bg-white p-5'>
      <div className='inline-flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white'>
        {icon}
      </div>
      <h3 className='mt-3 font-semibold'>{title}</h3>
      <p className='text-sm text-gray-600 mt-1'>{text}</p>
    </div>
  );
}
