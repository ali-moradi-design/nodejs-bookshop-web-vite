import { useTranslation } from 'react-i18next';
import type { BookListParams } from '@/entities/book';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui';
import type { BookFiltersState } from '../model/use-book-filters';

type Props = Pick<
  BookFiltersState,
  | 'q'
  | 'setQ'
  | 'category'
  | 'setCategory'
  | 'minPrice'
  | 'setMinPrice'
  | 'maxPrice'
  | 'setMaxPrice'
  | 'inStock'
  | 'setInStock'
  | 'sort'
  | 'order'
  | 'setSortOrder'
>;

export function BookFilters(props: Props) {
  const { t } = useTranslation();
  const {
    q,
    setQ,
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    inStock,
    setInStock,
    sort,
    order,
    setSortOrder,
  } = props;

  return (
    <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-6">
      <div className="md:col-span-2 space-y-1">
        <Label>{t('catalog.query')}</Label>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('common.search')} />
      </div>
      <div className="space-y-1">
        <Label>{t('catalog.category')}</Label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>{t('catalog.minPrice')}</Label>
        <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>{t('catalog.maxPrice')}</Label>
        <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>
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
            <SelectItem value="createdAt:desc">Newest</SelectItem>
            <SelectItem value="price:asc">Price ↑</SelectItem>
            <SelectItem value="price:desc">Price ↓</SelectItem>
            <SelectItem value="title:asc">Title A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <label className="flex items-center gap-2 text-sm md:col-span-6">
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
        {t('catalog.inStock')}
      </label>
    </div>
  );
}
