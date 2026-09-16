export type ThemeName = 'default' | 'amethyst' | 'terracotta';
export type ColorMode = 'light' | 'dark';

export interface ThemeDefinition {
  id: ThemeName;
  label: string;
  labelFa: string;
}

export const THEMES: ThemeDefinition[] = [
  { id: 'default', label: 'Pine', labelFa: 'کاج' },
  { id: 'amethyst', label: 'Amethyst', labelFa: 'آمتیست' },
  { id: 'terracotta', label: 'Terracotta', labelFa: 'سفال' },
];

export const DEFAULT_THEME: ThemeName = 'default';
export const DEFAULT_MODE: ColorMode = 'light';
