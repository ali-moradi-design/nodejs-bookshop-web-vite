import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const src = resolveImageUrl(book.coverImageUrl) || '/placeholder-book.svg';

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/books/${book.id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          <img
            src={src}
            alt={book.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
          {book.featured ? (
            <Badge className="absolute start-2 top-2">{t('book.featured')}</Badge>
          ) : null}
        </div>
        <CardHeader className="space-y-1 p-4 pb-2">
          <CardTitle className="line-clamp-2 text-base">{book.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{book.author}</p>
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
  );
}
