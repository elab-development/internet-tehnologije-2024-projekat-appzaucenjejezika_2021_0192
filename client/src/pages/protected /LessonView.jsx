import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Home,
  Loader2,
  PlayCircle,
  ArrowRight,
  Award,
  RefreshCw,
} from 'lucide-react';

import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { ExerciseRunner } from '../../components/lesson/ExerciseRunner';

export default function LessonView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startBusy, setStartBusy] = useState(false);
  const [submitBusy, setSubmitBusy] = useState(false);
  const [err, setErr] = useState('');

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lastResult, setLastResult] = useState(null);
  const [lessonProgress, setLessonProgress] = useState(null);
  const [xpToast, setXpToast] = useState(null);

  const exercises = lesson?.exercises || [];
  const current = exercises[index];

  const percent = lessonProgress?.percent ?? 0;
  const lessonPassed = lessonProgress?.status === 'passed';

  const canPrev = index > 0;
  const canNext = index < exercises.length - 1;

  const goPrev = () => canPrev && setIndex((i) => i - 1);
  const goNext = () => canNext && setIndex((i) => i + 1);

  const loadLesson = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get(`/learn/lessons/${lessonId}`);
      setLesson(data.lesson || null);
      setIndex(0);
      setLastResult(null);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  const ensureStarted = useCallback(async () => {
    if (!user || !lessonId) return;
    setStartBusy(true);
    try {
      const { data } = await api.post(`/learn/lessons/${lessonId}/start`);
      if (data?.progress) {
        setLessonProgress((prev) => prev || data.progress);
      }
    } catch (e) {
    } finally {
      setStartBusy(false);
    }
  }, [lessonId, user]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  useEffect(() => {
    ensureStarted();
  }, [ensureStarted]);

  useEffect(() => {
    if (!lastResult?.gainedXp) return;
    setXpToast({
      gainedXp: lastResult.gainedXp,
      totalXp: lastResult.totalXp,
    });
    const t = setTimeout(() => setXpToast(null), 2000);
    return () => clearTimeout(t);
  }, [lastResult]);

  const onChangeAnswer = (exerciseId, value) => {
    setAnswers((a) => ({ ...a, [exerciseId]: value }));
  };

  const onSubmit = async () => {
    if (!current?._id) return;
    setSubmitBusy(true);
    setErr('');
    try {
      const payload = { answer: answers[current._id] ?? '' };
      const { data } = await api.post(
        `/learn/lessons/${lessonId}/exercises/${current._id}/submit`,
        payload
      );
      setLastResult(data);
      if (data?.lessonProgress) setLessonProgress(data.lessonProgress);
      if (data?.result?.passed) {
        setTimeout(() => {
          if (index < exercises.length - 1) setIndex(index + 1);
        }, 600);
      }
    } catch (e) {
      setErr(e?.response?.data?.message || 'Submit failed');
    } finally {
      setSubmitBusy(false);
    }
  };

  const isAnsweredCorrectly = useMemo(() => {
    if (!lastResult || !current) return false;
    return (
      String(lastResult.exerciseProgress?.exercise) === String(current._id) &&
      lastResult.result?.passed
    );
  }, [lastResult, current]);

  const submitLabel = isAnsweredCorrectly ? 'Correct!' : 'Check answer';

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <div className='shadow-md rounded-2xl bg-white p-6 flex items-center gap-3'>
          <Loader2 className='animate-spin' />
          <div>Loading lesson…</div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className='container mx-auto px-4 py-10'>
        <div className='shadow-md rounded-2xl bg-white p-6'>
          <p className='text-rose-700 text-sm'>{err}</p>
          <button
            onClick={loadLesson}
            className='mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl shadow-md bg-white hover:bg-gray-50'
          >
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className='container mx-auto px-4 py-6'>
      <div className='shadow-md rounded-2xl bg-white p-4 md:p-5'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <Link
              to={`/courses/${lesson.course}`}
              className='inline-flex items-center gap-2 px-3 py-2 rounded-xl shadow-md bg-white hover:bg-gray-50'
              title='Back to course'
            >
              <Home size={16} /> Back
            </Link>
            <h1 className='text-xl md:text-2xl font-bold'>{lesson.title}</h1>
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700'>
              Order #{lesson.order}
            </span>
            <span className='text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700'>
              ~{lesson.estDurationMin} min
            </span>
            {lessonPassed ? (
              <span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-50 text-green-700'>
                <CheckCircle2 size={14} /> Passed ({percent}%)
              </span>
            ) : (
              <span className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700'>
                <Circle size={12} className='animate-pulse' /> In progress (
                {percent}%)
              </span>
            )}
          </div>
        </div>

        {lesson.content?.introText && (
          <p className='text-sm text-gray-600 mt-2'>
            {lesson.content.introText}
          </p>
        )}

        <div className='mt-3 h-2 rounded-full bg-gray-100 overflow-hidden'>
          <div
            className='h-full bg-indigo-600'
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className='mt-6 shadow-md rounded-2xl bg-white p-4 md:p-5'>
        <div className='flex items-center justify-between'>
          <button
            onClick={goPrev}
            disabled={!canPrev}
            className='inline-flex items-center gap-2 px-3 py-2 rounded-xl shadow-md bg-white disabled:opacity-50'
          >
            <ChevronLeft size={18} /> Prev
          </button>

          <div className='text-sm text-gray-600'>
            Exercise {index + 1} of {exercises.length}
          </div>

          <button
            onClick={goNext}
            disabled={!canNext}
            className='inline-flex items-center gap-2 px-3 py-2 rounded-xl shadow-md bg-white disabled:opacity-50'
          >
            Next <ChevronRight size={18} />
          </button>
        </div>

        {/* current exercise */}
        {current ? (
          <div className='mt-5'>
            <ExerciseRunner
              key={current._id}
              exercise={current}
              value={answers[current._id]}
              onChange={(v) => onChangeAnswer(current._id, v)}
            />

            <div className='mt-5 flex items-center justify-between'>
              <div className='text-sm text-gray-600'>
                {isAnsweredCorrectly ? (
                  <span className='inline-flex items-center gap-1 text-green-700'>
                    <CheckCircle2 size={16} /> Correct (+{current.points ?? 10}{' '}
                    XP)
                  </span>
                ) : lastResult?.result && !lastResult.result.passed ? (
                  <span className='text-rose-700'>Incorrect. Try again.</span>
                ) : (
                  <span className='inline-flex items-center gap-1 text-gray-600'>
                    <PlayCircle size={16} /> Submit your answer
                  </span>
                )}
              </div>

              <button
                onClick={onSubmit}
                disabled={submitBusy || startBusy || !user}
                className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50'
              >
                {submitBusy ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  <ArrowRight size={16} />
                )}
                {submitBusy ? 'Checking…' : submitLabel}
              </button>
            </div>
          </div>
        ) : (
          <div className='text-sm text-gray-600 mt-3'>
            No exercises in this lesson.
          </div>
        )}
      </div>

      {(lesson.content?.phrases?.length || lesson.content?.grammarNotes) && (
        <div className='mt-6 grid md:grid-cols-2 gap-5'>
          {lesson.content?.phrases?.length ? (
            <div className='shadow-md rounded-2xl bg-white p-4'>
              <h3 className='font-semibold'>Phrases</h3>
              <ul className='mt-2 space-y-2 text-sm'>
                {lesson.content.phrases.map((p, i) => (
                  <li
                    key={i}
                    className='flex items-start justify-between gap-3'
                  >
                    <div>
                      <div className='font-medium'>{p.target}</div>
                      <div className='text-gray-600'>{p.native}</div>
                      {p.note && (
                        <div className='text-xs text-gray-500 mt-0.5'>
                          {p.note}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {lesson.content?.grammarNotes ? (
            <div className='shadow-md rounded-2xl bg-white p-4'>
              <h3 className='font-semibold'>Grammar notes</h3>
              <p className='mt-2 text-sm text-gray-700 whitespace-pre-line'>
                {lesson.content.grammarNotes}
              </p>
            </div>
          ) : null}
        </div>
      )}

      {xpToast && (
        <div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50'>
          <div className='shadow-md rounded-xl bg-white px-4 py-2 flex items-center gap-2'>
            <Award size={16} className='text-amber-600' />
            <span className='text-sm font-medium'>+{xpToast.gainedXp} XP</span>
            <span className='text-xs text-gray-600'>
              Total: {xpToast.totalXp}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
