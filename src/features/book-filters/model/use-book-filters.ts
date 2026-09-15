import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { BookListParams } from '@/entities/book';
import { BOOK_PRICE_MAX, BOOK_PRICE_MIN } from '@/entities/book';

const DEFAULT_SORT: NonNullable<BookListParams['sort']> = 'createdAt';
const DEFAULT_ORDER: NonNullable<BookListParams['order']> = 'desc';

export type BookFiltersDraft = {
  q: string;
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  sort: NonNullable<BookListParams['sort']>;
  order: NonNullable<BookListParams['order']>;
};

function parseSort(raw: string | null): NonNullable<BookListParams['sort']> {
  if (raw === 'price' || raw === 'title' || raw === 'createdAt') return raw;
  return DEFAULT_SORT;
}

function parseOrder(raw: string | null): NonNullable<BookListParams['order']> {
  if (raw === 'asc' || raw === 'desc') return raw;
  return DEFAULT_ORDER;
}

function draftFromSearchParams(sp: URLSearchParams): BookFiltersDraft {
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

function filterSignature(sp: URLSearchParams): string {
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

function buildParams(sp: URLSearchParams, limit: number): BookListParams {
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

export function useBookFilters(limit = 12) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [draft, setDraft] = useState(() => draftFromSearchParams(searchParams));

  const signature = filterSignature(searchParams);
  useEffect(() => {
    setDraft(draftFromSearchParams(searchParams));
    // Re-sync draft when applied filter URL params change (not page-only).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- signature encodes filter params
  }, [signature]);

  const params = useMemo(() => buildParams(searchParams, limit), [searchParams, limit]);
  const page = params.page ?? 1;

  const setQ = useCallback((v: string) => setDraft((d) => ({ ...d, q: v })), []);
  const setCategory = useCallback((v: string) => setDraft((d) => ({ ...d, category: v })), []);
  const setPriceRange = useCallback(
    (range: [number, number]) => setDraft((d) => ({ ...d, priceRange: range })),
    [],
  );
  const setInStock = useCallback((v: boolean) => setDraft((d) => ({ ...d, inStock: v })), []);
  const setSortOrder = useCallback(
    (sort: BookListParams['sort'], order: BookListParams['order']) =>
      setDraft((d) => ({
        ...d,
        sort: sort ?? DEFAULT_SORT,
        order: order ?? DEFAULT_ORDER,
      })),
    [],
  );

  const applyFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        if (draft.q.trim()) next.set('q', draft.q.trim());
        if (draft.category) next.set('category', draft.category);
        if (draft.priceRange[0] > BOOK_PRICE_MIN) next.set('minPrice', String(draft.priceRange[0]));
        if (draft.priceRange[1] < BOOK_PRICE_MAX) next.set('maxPrice', String(draft.priceRange[1]));
        if (draft.inStock) next.set('inStock', 'true');
        if (draft.sort !== DEFAULT_SORT) next.set('sort', draft.sort);
        if (draft.order !== DEFAULT_ORDER) next.set('order', draft.order);
        // Always reset page on Apply
        // Preserve unrelated params if any (none today)
        void prev;
        return next;
      },
      { replace: false },
    );
  }, [draft, setSearchParams]);

  const resetFilters = useCallback(() => {
    setDraft({
      q: '',
      category: '',
      priceRange: [BOOK_PRICE_MIN, BOOK_PRICE_MAX],
      inStock: false,
      sort: DEFAULT_SORT,
      order: DEFAULT_ORDER,
    });
    setSearchParams({}, { replace: false });
  }, [setSearchParams]);

  const setPage = useCallback(
    (value: number | ((prev: number) => number)) => {
      setSearchParams(
        (prev) => {
          const current = Math.max(1, Number(prev.get('page') || '1') || 1);
          const nextPage = typeof value === 'function' ? value(current) : value;
          const next = new URLSearchParams(prev);
          if (nextPage <= 1) next.delete('page');
          else next.set('page', String(nextPage));
          return next;
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

  return {
    params,
    page,
    setPage,
    q: draft.q,
    setQ,
    category: draft.category,
    setCategory,
    priceRange: draft.priceRange,
    setPriceRange,
    minPrice: String(draft.priceRange[0]),
    maxPrice: String(draft.priceRange[1]),
    inStock: draft.inStock,
    setInStock,
    sort: draft.sort,
    order: draft.order,
    setSortOrder,
    applyFilters,
    resetFilters,
  };
}

export type BookFiltersState = ReturnType<typeof useBookFilters>;
