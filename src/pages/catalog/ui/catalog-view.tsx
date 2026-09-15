import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { bookKeys, fetchBooks, type BookListParams } from '@/entities/book';
import { BookGrid } from '@/widgets/book-grid';
import {
  Alert,
  Button,
  EmptyState,
  Input,
  Label,
  PageLoader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import { ApiError } from '@/shared/api';

export function CatalogPage() {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<BookListParams['sort']>('createdAt');
  const [order, setOrder] = useState<BookListParams['order']>('desc');
  const [page, setPage] = useState(1);

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
      limit: 12,
    }),
    [q, category, minPrice, maxPrice, inStock, sort, order, page],
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: bookKeys.list(params),
    queryFn: () => fetchBooks(params),
  });

  const books = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('catalog.title')}</h1>
      <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-6">
        <div className="md:col-span-2 space-y-1">
          <Label>{t('catalog.query')}</Label>
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder={t('common.search')}
          />
        </div>
        <div className="space-y-1">
          <Label>{t('catalog.category')}</Label>
          <Input
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="space-y-1">
          <Label>{t('catalog.minPrice')}</Label>
          <Input
            type="number"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="space-y-1">
          <Label>{t('catalog.maxPrice')}</Label>
          <Input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="space-y-1">
          <Label>{t('catalog.sort')}</Label>
          <Select
            value={`${sort}:${order}`}
            onValueChange={(v) => {
              const [s, o] = v.split(':') as [BookListParams['sort'], BookListParams['order']];
              setSort(s);
              setOrder(o);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Newest</SelectItem>
              <SelectItem value="price:asc">Price ↑</SelectItem>
              <SelectItem value="price:desc">Price ↓</SelectItem>
              <SelectItem value="title:asc">Title A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm md:col-span-6">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => {
              setInStock(e.target.checked);
              setPage(1);
            }}
          />
          {t('catalog.inStock')}
        </label>
      </div>

      {isLoading ? <PageLoader /> : null}
      {error ? (
        <Alert variant="destructive">
          {error instanceof ApiError ? error.message : t('common.error')}{' '}
          <button className="underline" onClick={() => void refetch()}>
            {t('common.retry')}
          </button>
        </Alert>
      ) : null}
      {!isLoading && !error && books.length === 0 ? (
        <EmptyState title={t('catalog.noResults')} />
      ) : null}
      {books.length > 0 ? <BookGrid books={books} /> : null}

      {meta && meta.pages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            {t('common.previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('common.page')} {meta.page} {t('common.of')} {meta.pages}
          </span>
          <Button
            variant="outline"
            disabled={page >= meta.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
