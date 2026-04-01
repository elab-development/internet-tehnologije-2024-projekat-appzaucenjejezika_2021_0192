import { useEffect, useMemo, useRef, useState } from 'react';

const LANG_MAP = {
  en: 'English',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  sr: 'Serbian',
  it: 'Italian',
};

const cache = new Map();

export function usePexelsImage(languageCode, opts = {}) {
  const { enabled = true } = opts;
  const [url, setUrl] = useState(() => cache.get(languageCode) || '');
  const [loading, setLoading] = useState(!cache.has(languageCode) && enabled);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  const query = useMemo(() => {
    const lang =
      LANG_MAP[languageCode?.toLowerCase?.()] || languageCode || 'language';
    return `${lang} language course`;
  }, [languageCode]);

  useEffect(() => {
    if (!enabled || cache.has(languageCode)) return;

    const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
    if (!API_KEY) {
      setLoading(false);
      setError('Missing VITE_PEXELS_API_KEY');
      return;
    }

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    (async () => {
      try {
        setLoading(true);
        setError('');

        const params = new URLSearchParams({
          query,
          per_page: '1',
          orientation: 'landscape',
          size: 'large',
        });

        const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
          headers: { Authorization: API_KEY },
          signal: ctrl.signal,
        });

        if (!res.ok) {
          throw new Error(`Pexels error: ${res.status}`);
        }

        const data = await res.json();
        const photo = data?.photos?.[0];
        const candidate =
          photo?.src?.landscape ||
          photo?.src?.large ||
          photo?.src?.medium ||
          photo?.src?.original ||
          '';

        if (candidate) {
          cache.set(languageCode, candidate);
          setUrl(candidate);
        } else {
          setError('No image found');
        }
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'Fetch failed');
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [enabled, languageCode, query]);

  return { url, loading, error };
}
