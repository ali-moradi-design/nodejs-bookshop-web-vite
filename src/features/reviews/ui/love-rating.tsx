import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib';

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
} as const;

export type LoveRatingSize = keyof typeof SIZES;

export type LoveRatingProps = {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: LoveRatingSize;
  className?: string;
  /** Accessible name for the radiogroup (defaults to i18n “Your rating”) */
  'aria-label'?: string;
};

export function LoveRating({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: LoveRatingProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<number | null>(null);

  const displayValue = !readOnly && hovered != null ? hovered : value;
  const iconSize = SIZES[size];
  const interactive = !readOnly && typeof onChange === 'function';

  return (
    <div
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={ariaLabel ?? t('book.yourRating')}
      aria-readonly={readOnly || undefined}
      className={cn('inline-flex items-center gap-0.5 leading-none', className)}
      onMouseLeave={() => setHovered(null)}
    >
      {([1, 2, 3, 4, 5] as const).map((n) => {
        const filled = n <= Math.round(displayValue);
        const heartClass = cn(
          iconSize,
          'transition-colors',
          filled ? 'fill-current text-fiery-terracotta-500' : 'text-muted-foreground/40',
        );

        if (!interactive) {
          return (
            <Heart key={n} className={heartClass} aria-hidden strokeWidth={filled ? 0 : 1.75} />
          );
        }

        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={t('book.rateOutOf5', { n })}
            className={cn(
              'inline-flex items-center justify-center rounded-sm p-0.5 outline-none transition-transform hover:scale-110',
              'focus-visible:ring-2 focus-visible:ring-fiery-terracotta-500/60 focus-visible:ring-offset-2',
            )}
            onMouseEnter={() => setHovered(n)}
            onFocus={() => setHovered(n)}
            onBlur={() => setHovered(null)}
            onClick={() => onChange(n)}
          >
            <Heart className={heartClass} strokeWidth={filled ? 0 : 1.75} />
          </button>
        );
      })}
    </div>
  );
}
