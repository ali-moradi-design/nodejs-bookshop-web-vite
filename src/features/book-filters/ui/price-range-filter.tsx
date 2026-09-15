import { useEffect, useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BOOK_PRICE_MAX, BOOK_PRICE_MIN } from '@/entities/book';
import { formatLocaleNumber, parseLocaleNumber, cn } from '@/shared/lib';
import { usePreferences } from '@/shared/hooks';
import { Label, Slider } from '@/shared/ui';

type Props = {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  defaultOpen?: boolean;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function PriceRangeFilter({ priceRange, setPriceRange, defaultOpen = true }: Props) {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
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
    <div className="rounded-lg border bg-card/50">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-start text-sm font-medium"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{t('catalog.priceRange')}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open ? (
        <div id={panelId} className="space-y-4 border-t px-3 pb-3 pt-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor={`${panelId}-min`} className="text-xs text-muted-foreground">
                {t('catalog.from')}
              </Label>
              <div className="flex items-baseline gap-2 border-b border-border pb-1">
                <input
                  id={`${panelId}-min`}
                  inputMode="numeric"
                  value={minText}
                  onChange={(e) => setMinText(e.target.value)}
                  onBlur={() => commitMin(minText)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitMin(minText);
                  }}
                  className="w-full bg-transparent text-sm outline-none"
                  aria-label={t('catalog.from')}
                />
                <span className="shrink-0 text-xs text-muted-foreground">
                  {t('catalog.currency')}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor={`${panelId}-max`} className="text-xs text-muted-foreground">
                {t('catalog.to')}
              </Label>
              <div className="flex items-baseline gap-2 border-b border-border pb-1">
                <input
                  id={`${panelId}-max`}
                  inputMode="numeric"
                  value={maxText}
                  onChange={(e) => setMaxText(e.target.value)}
                  onBlur={() => commitMax(maxText)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitMax(maxText);
                  }}
                  className="w-full bg-transparent text-sm outline-none"
                  aria-label={t('catalog.to')}
                />
                <span className="shrink-0 text-xs text-muted-foreground">
                  {t('catalog.currency')}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 px-1">
            <Slider
              min={BOOK_PRICE_MIN}
              max={BOOK_PRICE_MAX}
              step={1}
              value={priceRange}
              onValueChange={(v) => {
                const [a, b] = v;
                setPriceRange([Math.min(a, b), Math.max(a, b)]);
              }}
              className="mt-1"
              aria-label={t('catalog.priceRange')}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('catalog.cheapest')}</span>
              <span>{t('catalog.mostExpensive')}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
