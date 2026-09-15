import type { BookListParams } from '@/entities/book';
import { BOOK_PRICE_MAX, BOOK_PRICE_MIN } from '@/entities/book';

export const DEFAULT_SORT: NonNullable<BookListParams['sort']> = 'createdAt';
export const DEFAULT_ORDER: NonNullable<BookListParams['order']> = 'desc';

export type BookFiltersDraft = {
  q: string;
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  sort: NonNullable<BookListParams['sort']>;
  order: NonNullable<BookListParams['order']>;
};

export function parseSort(raw: string | null): NonNullable<BookListParams['sort']> {
  if (raw === 'price' || raw === 'title' || raw === 'createdAt') return raw;
  return DEFAULT_SORT;
}

export function parseOrder(raw: string | null): NonNullable<BookListParams['order']> {
  if (raw === 'asc' || raw === 'desc') return raw;
  return DEFAULT_ORDER;
}

export function draftFromSearchParams(sp: URLSearchParams): BookFiltersDraft {
  const minRaw = sp.get('minPrice');
  const maxRaw = sp.get('maxPrice');
  const min = minRaw != null && minRaw !== '' ? Number(minRaw) : BOOK_PRICE_MIN;
  const max = maxRaw != null && maxRaw !== '' ? Number(maxRaw) : BOOK_PRICE_MAX;
  return {
    q: sp.get('q') ?? '',
    category: sp.get('category') ?? '',
    priceRange: [
      Number.isFinite(min)
        ? Math.min(BOOK_PRICE_MAX, Math.max(BOOK_PRICE_MIN, min))
        : BOOK_PRICE_MIN,
      Number.isFinite(max)
        ? Math.min(BOOK_PRICE_MAX, Math.max(BOOK_PRICE_MIN, max))
        : BOOK_PRICE_MAX,
    ],
    inStock: sp.get('inStock') === 'true' || sp.get('inStock') === '1',
    sort: parseSort(sp.get('sort')),
    order: parseOrder(sp.get('order')),
  };
}

export function filterSignature(sp: URLSearchParams): string {
  return [
    sp.get('q') ?? '',
    sp.get('category') ?? '',
    sp.get('minPrice') ?? '',
    sp.get('maxPrice') ?? '',
    sp.get('inStock') ?? '',
    sp.get('sort') ?? '',
    sp.get('order') ?? '',
  ].join('\0');
}

export function buildParams(sp: URLSearchParams, limit: number): BookListParams {
  const draft = draftFromSearchParams(sp);
  const pageRaw = Number(sp.get('page') || '1');
  const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1;
  const minPrice = sp.get('minPrice');
  const maxPrice = sp.get('maxPrice');

  return {
    q: draft.q || undefined,
    category: draft.category || undefined,
    minPrice: minPrice != null && minPrice !== '' ? Number(minPrice) : undefined,
    maxPrice: maxPrice != null && maxPrice !== '' ? Number(maxPrice) : undefined,
    inStock: draft.inStock || undefined,
    sort: draft.sort,
    order: draft.order,
    page,
    limit,
  };
}

export type FilterParamKey =
  'q' | 'category' | 'minPrice' | 'maxPrice' | 'inStock' | 'sort' | 'order';
