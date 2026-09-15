import { describe, expect, it } from 'vitest';
import { buildParams, draftFromSearchParams, parseOrder, parseSort } from '../parse-book-filters';

describe('parseSort / parseOrder', () => {
  it('accepts known values', () => {
    expect(parseSort('price')).toBe('price');
    expect(parseOrder('asc')).toBe('asc');
  });
  it('falls back', () => {
    expect(parseSort('nope')).toBe('createdAt');
    expect(parseOrder('nope')).toBe('desc');
  });
});

describe('draftFromSearchParams', () => {
  it('reads URL filters', () => {
    const sp = new URLSearchParams('q=nest&category=fiction&minPrice=10&maxPrice=40&inStock=true');
    const draft = draftFromSearchParams(sp);
    expect(draft.q).toBe('nest');
    expect(draft.category).toBe('fiction');
    expect(draft.priceRange).toEqual([10, 40]);
    expect(draft.inStock).toBe(true);
  });
});

describe('buildParams', () => {
  it('builds list params including page', () => {
    const sp = new URLSearchParams('q=a&page=2');
    const params = buildParams(sp, 12);
    expect(params.q).toBe('a');
    expect(params.page).toBe(2);
    expect(params.limit).toBe(12);
  });
});
