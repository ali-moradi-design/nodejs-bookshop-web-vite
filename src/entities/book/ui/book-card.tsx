import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'motion/react';
import type { Book } from '../model/types';
import { formatMoney, resolveImageUrl } from '@/shared/lib';
import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui';
import { usePreferences } from '@/shared/hooks';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const reduceMotion = useReducedMotion();
  const src = resolveImageUrl(book.coverImageUrl) || '/placeholder-book.svg';
  const categories = book.categories ?? [];
  const visibleCats = categories.slice(0, 2);
  const overflow = categories.length - visibleCats.length;

  return (
    <motion.div
      className="h-full"
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -6,
              scale: 1.02,
            }
      }
      transition={{ type: 'spring', stiffness: 360, damping: 22 }}
    >
      <Card className="group relative flex h-full flex-col overflow-hidden border-border/80 transition-[box-shadow,border-color] duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/25">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] ring-0 ring-primary/0 transition-[box-shadow] duration-300 group-hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_40%,transparent)]"
        />
        {!reduceMotion ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/15 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
          />
        ) : null}

        <Link to={`/books/${book.id}`} className="relative flex flex-1 flex-col">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
            <img
              src={src}
              alt={book.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            {book.featured ? (
              <Badge className="absolute start-2 top-2 z-10">{t('book.featured')}</Badge>
            ) : null}
          </div>
          <CardHeader className="space-y-1 p-4 pb-2">
            <CardTitle className="line-clamp-2 text-base">{book.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            {visibleCats.length > 0 ? (
              <div className="flex flex-wrap gap-1 pt-1">
                {visibleCats.map((c) => (
                  <Badge key={c} variant="secondary" className="font-normal capitalize">
                    {c}
                  </Badge>
                ))}
                {overflow > 0 ? (
                  <Badge variant="outline" className="font-normal">
                    +{overflow}
                  </Badge>
                ) : null}
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0">
            <p className="line-clamp-2 text-xs text-muted-foreground">{book.description}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 pt-0">
            <span className="font-semibold">{formatMoney(book.price, book.currency, locale)}</span>
            <span className="text-xs text-muted-foreground">
              {book.stock > 0 ? `${t('book.stock')}: ${book.stock}` : t('book.outOfStock')}
            </span>
          </CardFooter>
        </Link>
      </Card>
    </motion.div>
  );
}
