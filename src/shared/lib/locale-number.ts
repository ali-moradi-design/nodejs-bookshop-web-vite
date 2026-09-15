const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const EN_DIGITS = '0123456789';

const toFaDigits = (s: string) => s.replace(/\d/g, (d) => FA_DIGITS[Number(d)] ?? d);

const toEnDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => EN_DIGITS[FA_DIGITS.indexOf(d)] ?? d);

/** Format a number with thousand separators; Persian digits when locale starts with fa. */
export function formatLocaleNumber(value: number, locale = 'en'): string {
  const n = Number.isFinite(value) ? Math.round(value) : 0;
  const formatted = n.toLocaleString('en-US');
  return locale.startsWith('fa') ? toFaDigits(formatted) : formatted;
}

/** Parse user input that may contain Persian digits, commas, or spaces. */
export function parseLocaleNumber(raw: string): number | null {
  const normalized = toEnDigits(raw)
    .replace(/[,\s٬]/g, '')
    .trim();
  if (!normalized) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
