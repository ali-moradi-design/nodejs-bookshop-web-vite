import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BOOK_PRICE_MAX, BOOK_PRICE_MIN } from '@/entities/book';
import { formatLocaleNumber, parseLocaleNumber } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { Label, Slider } from '@/shared/ui';

type Props = {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function PriceRangeFilter({ priceRange, setPriceRange }: Props) {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const id = useId();
  const [minText, setMinText] = useState(() => formatLocaleNumber(priceRange[0], locale));
  const [maxText, setMaxText] = useState(() => formatLocaleNumber(priceRange[1], locale));

  useEffect(() => {
    setMinText(formatLocaleNumber(priceRange[0], locale));
    setMaxText(formatLocaleNumber(priceRange[1], locale));
  }, [priceRange, locale]);

  const commitMin = (raw: string) => {
    const parsed = parseLocaleNumber(raw);
    if (parsed == null) {
      setMinText(formatLocaleNumber(priceRange[0], locale));
      return;
    }
    const nextMin = clamp(parsed, BOOK_PRICE_MIN, priceRange[1]);
    setPriceRange([nextMin, priceRange[1]]);
  };

  const commitMax = (raw: string) => {
    const parsed = parseLocaleNumber(raw);
    if (parsed == null) {
      setMaxText(formatLocaleNumber(priceRange[1], locale));
      return;
    }
    const nextMax = clamp(parsed, priceRange[0], BOOK_PRICE_MAX);
    setPriceRange([priceRange[0], nextMax]);
  };

  return (
    <div className="flex h-full flex-col justify-end gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{t('catalog.priceRange')}</Label>
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <span className="sr-only">{t('catalog.from')}</span>
          <div className="flex items-baseline gap-1 border-b border-border pb-0.5">
            <input
              id={`${id}-min`}
              inputMode="numeric"
              value={minText}
              onChange={(e) => setMinText(e.target.value)}
              onBlur={() => commitMin(minText)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitMin(minText);
              }}
              className="w-full bg-transparent text-xs outline-none"
              aria-label={t('catalog.from')}
            />
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {t('catalog.currency')}
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <span className="sr-only">{t('catalog.to')}</span>
          <div className="flex items-baseline gap-1 border-b border-border pb-0.5">
            <input
              id={`${id}-max`}
              inputMode="numeric"
              value={maxText}
              onChange={(e) => setMaxText(e.target.value)}
              onBlur={() => commitMax(maxText)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitMax(maxText);
              }}
              className="w-full bg-transparent text-xs outline-none"
              aria-label={t('catalog.to')}
            />
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {t('catalog.currency')}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-1 px-0.5 pt-1">
        <Slider
          min={BOOK_PRICE_MIN}
          max={BOOK_PRICE_MAX}
          step={1}
          value={priceRange}
          onValueChange={(v) => {
            const [a, b] = v;
            setPriceRange([Math.min(a, b), Math.max(a, b)]);
          }}
          className="h-4"
          aria-label={t('catalog.priceRange')}
        />
        <div className="flex justify-between text-[10px] leading-none text-muted-foreground">
          <span>{t('catalog.cheapest')}</span>
          <span>{t('catalog.mostExpensive')}</span>
        </div>
      </div>
    </div>
  );
}
