import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { BookListParams } from '@/entities/book';
import { BOOK_PRICE_MAX, BOOK_PRICE_MIN } from '@/entities/book';
import {
  buildParams,
  DEFAULT_ORDER,
  DEFAULT_SORT,
  draftFromSearchParams,
  filterSignature,
  type FilterParamKey,
} from './parse-book-filters';

export type { BookFiltersDraft } from './parse-book-filters';
export { draftFromSearchParams, buildParams, parseSort, parseOrder } from './parse-book-filters';

export function useBookFilters(limit = 12) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [draft, setDraft] = useState(() => draftFromSearchParams(searchParams));

  const signature = filterSignature(searchParams);
  useEffect(() => {
    setDraft(draftFromSearchParams(searchParams));
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

  const removeFilterParam = useCallback(
    (key: FilterParamKey) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(key);
          if (key === 'minPrice' || key === 'maxPrice') {
            // keep the other price bound
          }
          next.delete('page');
          return next;
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

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
    removeFilterParam,
  };
}

export type BookFiltersState = ReturnType<typeof useBookFilters>;
