import { describe, expect, it } from 'vitest';
import { formatMoney, resolveImageUrl } from '../format';

describe('formatMoney', () => {
  it('formats USD', () => {
    expect(formatMoney(12.5, 'USD', 'en')).toContain('12.50');
  });
});

describe('resolveImageUrl', () => {
  it('returns absolute urls as-is', () => {
    expect(resolveImageUrl('https://cdn.example/x.png')).toBe('https://cdn.example/x.png');
  });
  it('prefixes relative paths', () => {
    expect(resolveImageUrl('/uploads/a.png', 'http://localhost:4000')).toBe(
      'http://localhost:4000/uploads/a.png',
    );
  });
  it('handles null', () => {
    expect(resolveImageUrl(null)).toBeNull();
  });
});
