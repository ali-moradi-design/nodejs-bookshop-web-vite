import { useMemo, useState } from 'react';
import type { BookListParams } from '@/entities/book';

export function useBookFilters(limit = 12) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<BookListParams['sort']>('createdAt');
  const [order, setOrder] = useState<BookListParams['order']>('desc');
  const [page, setPage] = useState(1);

  const resetPage = () => setPage(1);

  const params: BookListParams = useMemo(
    () => ({
      q: q || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock || undefined,
      sort,
      order,
      page,
      limit,
    }),
    [q, category, minPrice, maxPrice, inStock, sort, order, page, limit],
  );

  return {
    params,
    page,
    setPage,
    q,
    setQ: (v: string) => {
      setQ(v);
      resetPage();
    },
    category,
    setCategory: (v: string) => {
      setCategory(v);
      resetPage();
    },
    minPrice,
    setMinPrice: (v: string) => {
      setMinPrice(v);
      resetPage();
    },
    maxPrice,
    setMaxPrice: (v: string) => {
      setMaxPrice(v);
      resetPage();
    },
    inStock,
    setInStock: (v: boolean) => {
      setInStock(v);
      resetPage();
    },
    sort,
    order,
    setSortOrder: (sortValue: BookListParams['sort'], orderValue: BookListParams['order']) => {
      setSort(sortValue);
      setOrder(orderValue);
      resetPage();
    },
  };
}

export type BookFiltersState = ReturnType<typeof useBookFilters>;
