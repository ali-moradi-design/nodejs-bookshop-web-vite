export type ThemeName = 'default' | 'ocean' | 'ember';
export type ColorMode = 'light' | 'dark';

export interface ThemeDefinition {
  id: ThemeName;
  label: string;
  labelFa: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'default', label: 'Default', labelFa: 'پیش‌فرض' },
  { id: 'ocean', label: 'Ocean', labelFa: 'اقیانوس' },
  { id: 'ember', label: 'Ember', labelFa: 'اخگر' },
];

export const DEFAULT_THEME: ThemeName = 'default';
export const DEFAULT_MODE: ColorMode = 'light';
