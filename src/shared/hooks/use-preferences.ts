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

const VALID_THEMES: ThemeName[] = ['default', 'desert', 'rosy'];

function migrateTheme(value: unknown): ThemeName {
  if (value === 'ocean') return 'desert';
  if (value === 'ember') return 'rosy';
  if (typeof value === 'string' && (VALID_THEMES as string[]).includes(value)) {
    return value as ThemeName;
  }
  return DEFAULT_THEME;
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
    {
      name: 'bookstore-prefs',
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<PreferencesState>;
        return {
          ...state,
          theme: migrateTheme(state.theme),
        } as PreferencesState;
      },
      version: 1,
    },
  ),
);
