import { Volume2 } from 'lucide-react';

export function ExerciseRunner({ exercise, value, onChange }) {
  const { type, prompt, options = [], media = {} } = exercise;

  return (
    <div className='shadow-md rounded-2xl bg-white p-4'>
      <h3 className='font-semibold'>{labelFor(type)}</h3>
      <p className='text-sm text-gray-700 mt-1'>{prompt}</p>

      {media?.audioUrl && (
        <div className='mt-3 inline-flex items-center gap-2 text-sm text-gray-700'>
          <Volume2 size={16} />
          <audio controls src={media.audioUrl} className='w-full md:w-auto' />
        </div>
      )}
      {media?.imageUrl && (
        <div className='mt-3'>
          <img
            src={media.imageUrl}
            alt='Exercise image'
            className='w-full h-48 object-cover rounded-lg'
          />
        </div>
      )}

      <div className='mt-4'>
        {type === 'multiple_choice' && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {options.map((op, i) => {
              const active = String(value) === String(op);
              return (
                <button
                  key={i}
                  type='button'
                  onClick={() => onChange(op)}
                  className={`text-left px-3 py-2 rounded-xl shadow-md hover:bg-gray-50 ${
                    active ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  {op}
                </button>
              );
            })}
          </div>
        )}

        {(type === 'translate' ||
          type === 'fill_gap' ||
          type === 'audio_dictation') && (
          <input
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className='w-full rounded-xl border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-indigo-500'
            placeholder={
              type === 'translate'
                ? 'Type your translation…'
                : type === 'fill_gap'
                ? 'Type the missing word…'
                : 'Type what you hear…'
            }
          />
        )}
      </div>
    </div>
  );
}

function labelFor(type) {
  switch (type) {
    case 'multiple_choice':
      return 'Multiple choice';
    case 'translate':
      return 'Translate';
    case 'fill_gap':
      return 'Fill the gap';
    case 'audio_dictation':
      return 'Audio dictation';
    default:
      return 'Exercise';
  }
}
