import { describe, expect, it } from 'vitest';
import { formatLocaleNumber, parseLocaleNumber } from '../locale-number';

describe('formatLocaleNumber', () => {
  it('formats en with commas and Latin digits', () => {
    expect(formatLocaleNumber(1234, 'en')).toBe('1,234');
  });
  it('formats fa with Persian digits', () => {
    expect(formatLocaleNumber(1234, 'fa')).toBe('۱,۲۳۴');
  });
});

describe('parseLocaleNumber', () => {
  it('parses Latin with commas', () => {
    expect(parseLocaleNumber('1,234')).toBe(1234);
  });
  it('parses Persian digits', () => {
    expect(parseLocaleNumber('۱٬۲۳۴')).toBe(1234);
    expect(parseLocaleNumber('۱۲۳۴')).toBe(1234);
  });
  it('returns null for empty/invalid', () => {
    expect(parseLocaleNumber('')).toBeNull();
    expect(parseLocaleNumber('abc')).toBeNull();
  });
});
