import { useEffect } from 'react';

const APP_NAME = 'Bookshop';

/** Sets document.title to `${title} · Bookshop` (or app name alone). */
export function usePageTitle(title?: string | null) {
  useEffect(() => {
    const prev = document.title;
    document.title = title?.trim() ? `${title.trim()} · ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
