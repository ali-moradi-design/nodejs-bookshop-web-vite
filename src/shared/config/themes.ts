export type ThemeName = 'default' | 'desert' | 'rosy';
export type ColorMode = 'light' | 'dark';

export interface ThemeDefinition {
  id: ThemeName;
  label: string;
  labelFa: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'default', label: 'Default (Dusty Olive)', labelFa: 'پیش‌فرض' },
  { id: 'desert', label: 'Desert', labelFa: 'کویری' },
  { id: 'rosy', label: 'Rosy', labelFa: 'گل‌گون' },
];

export const DEFAULT_THEME: ThemeName = 'default';
export const DEFAULT_MODE: ColorMode = 'light';
