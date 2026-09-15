import { useEffect } from 'react';
import { usePreferences } from '@/shared/hooks';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = usePreferences((s) => s.theme);
  const mode = usePreferences((s) => s.mode);
  const locale = usePreferences((s) => s.locale);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle('dark', mode === 'dark');
    root.lang = locale;
    root.dir = locale === 'fa' ? 'rtl' : 'ltr';
  }, [theme, mode, locale]);

  return <>{children}</>;
}
