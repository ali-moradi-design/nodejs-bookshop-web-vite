import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_MODE, DEFAULT_THEME, type ColorMode, type ThemeName } from '@/shared/config';

export type Locale = 'en' | 'fa';

interface PreferencesState {
  theme: ThemeName;
  mode: ColorMode;
  locale: Locale;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  setLocale: (locale: Locale) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,
      mode: DEFAULT_MODE,
      locale: 'en',
      setTheme: (theme) => set({ theme }),
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === 'light' ? 'dark' : 'light' }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'bookstore-prefs' },
  ),
);
