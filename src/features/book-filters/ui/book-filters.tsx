import { useTranslation } from 'react-i18next';
import { BOOK_CATEGORIES, type BookListParams } from '@/entities/book';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import type { BookFiltersState } from '../model/use-book-filters';
import { PriceRangeFilter } from './price-range-filter';

const ALL_CATEGORY = '__all__';

type Props = Pick<
  BookFiltersState,
  | 'q'
  | 'setQ'
  | 'category'
  | 'setCategory'
  | 'priceRange'
  | 'setPriceRange'
  | 'inStock'
  | 'setInStock'
  | 'sort'
  | 'order'
  | 'setSortOrder'
  | 'applyFilters'
  | 'resetFilters'
>;

export function BookFilters(props: Props) {
  const { t } = useTranslation();
  const {
    q,
    setQ,
    category,
    setCategory,
    priceRange,
    setPriceRange,
    inStock,
    setInStock,
    sort,
    order,
    setSortOrder,
    applyFilters,
    resetFilters,
  } = props;

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-5">
        <div className="space-y-1 md:col-span-2">
          <Label htmlFor="catalog-q">{t('catalog.query')}</Label>
          <Input
            id="catalog-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('catalog.searchPlaceholder')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyFilters();
            }}
          />
        </div>

        <div className="space-y-1">
          <Label>{t('catalog.category')}</Label>
          <Select
            value={category || ALL_CATEGORY}
            onValueChange={(v) => setCategory(v === ALL_CATEGORY ? '' : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('common.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORY}>{t('common.all')}</SelectItem>
              {BOOK_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} />

        <div className="space-y-1">
          <Label>{t('catalog.sort')}</Label>
          <Select
            value={`${sort}:${order}`}
            onValueChange={(v) => {
              const [s, o] = v.split(':') as [BookListParams['sort'], BookListParams['order']];
              setSortOrder(s, o);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">{t('catalog.sortNewest')}</SelectItem>
              <SelectItem value="price:asc">{t('catalog.sortPriceAsc')}</SelectItem>
              <SelectItem value="price:desc">{t('catalog.sortPriceDesc')}</SelectItem>
              <SelectItem value="title:asc">{t('catalog.sortTitleAsc')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="h-4 w-4 rounded border"
          />
          {t('catalog.inStock')}
        </label>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={resetFilters}>
            {t('catalog.reset')}
          </Button>
          <Button type="button" size="sm" onClick={applyFilters}>
            {t('catalog.apply')}
          </Button>
        </div>
      </div>
    </div>
  );
}
