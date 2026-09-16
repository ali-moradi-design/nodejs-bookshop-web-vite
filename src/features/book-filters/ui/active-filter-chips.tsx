import { useTranslation } from 'react-i18next';
import type { useBookFilters } from '../model/use-book-filters';

type Filters = ReturnType<typeof useBookFilters>;

export function ActiveFilterChips({ filters }: { filters: Filters }) {
  const { t } = useTranslation();
  const chips: { key: string; label: string; clear: () => void }[] = [];

  if (filters.params.q) {
    chips.push({
      key: 'q',
      label: `${t('catalog.query')}: ${filters.params.q}`,
      clear: () => filters.removeFilterParam('q'),
    });
  }
  if (filters.params.category) {
    chips.push({
      key: 'category',
      label: `${t('catalog.category')}: ${filters.params.category}`,
      clear: () => filters.removeFilterParam('category'),
    });
  }
  if (filters.params.minPrice != null) {
    chips.push({
      key: 'minPrice',
      label: `${t('catalog.from')}: ${filters.params.minPrice}`,
      clear: () => filters.removeFilterParam('minPrice'),
    });
  }
  if (filters.params.maxPrice != null) {
    chips.push({
      key: 'maxPrice',
      label: `${t('catalog.to')}: ${filters.params.maxPrice}`,
      clear: () => filters.removeFilterParam('maxPrice'),
    });
  }
  if (filters.params.inStock) {
    chips.push({
      key: 'inStock',
      label: t('catalog.inStock'),
      clear: () => filters.removeFilterParam('inStock'),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={t('catalog.activeFilters')}>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.clear}
          className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2.5 py-1 text-xs hover:bg-muted"
        >
          {chip.label}
          <span aria-hidden className="opacity-60">
            ×
          </span>
        </button>
      ))}
    </div>
  );
}
