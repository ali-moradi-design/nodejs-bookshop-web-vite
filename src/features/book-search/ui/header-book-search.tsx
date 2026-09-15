import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { bookKeys, fetchBooks, type Book } from '@/entities/book';
import { useDebouncedValue, usePreferences } from '@/shared/hooks';
import { formatMoney, resolveImageUrl } from '@/shared/lib';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Spinner,
} from '@/shared/ui';

export function HeaderBookSearch() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQ = useDebouncedValue(query.trim(), 300);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const enabled = open && debouncedQ.length > 0;

  const { data, isFetching, isError } = useQuery({
    queryKey: bookKeys.list({ q: debouncedQ, limit: 8, page: 1 }),
    queryFn: () => fetchBooks({ q: debouncedQ, limit: 8, page: 1 }),
    enabled,
  });

  const results: Book[] = data?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('common.search')}>
          <Search />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="space-y-3 border-b p-4 pb-3 text-start sm:text-start">
          <DialogTitle>{t('common.search')}</DialogTitle>
          <DialogDescription className="sr-only">{t('search.dialogHint')}</DialogDescription>
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.searchPlaceholder')}
              className="h-12 ps-10 text-base"
            />
          </div>
        </DialogHeader>

        <div className="max-h-[min(60vh,28rem)] overflow-y-auto p-2">
          {!debouncedQ ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {t('search.typeToSearch')}
            </p>
          ) : null}

          {enabled && isFetching ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Spinner className="h-4 w-4" />
              {t('common.loading')}
            </div>
          ) : null}

          {enabled && !isFetching && isError ? (
            <p className="px-3 py-8 text-center text-sm text-destructive">{t('common.error')}</p>
          ) : null}

          {enabled && !isFetching && !isError && results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {t('search.noResults')}
            </p>
          ) : null}

          {enabled && !isFetching && results.length > 0 ? (
            <ul className="space-y-1">
              {results.map((book) => {
                const src = resolveImageUrl(book.coverImageUrl) || '/placeholder-book.svg';
                return (
                  <li key={book.id}>
                    <Link
                      to={`/books/${book.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-14 w-10 shrink-0 rounded object-cover bg-muted"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium leading-tight">{book.title}</p>
                        <p className="truncate text-sm text-muted-foreground">{book.author}</p>
                      </div>
                      <span className="shrink-0 text-sm font-medium tabular-nums">
                        {formatMoney(book.price, book.currency, locale)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        {debouncedQ ? (
          <div className="border-t p-3">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link
                to={`/catalog?q=${encodeURIComponent(debouncedQ)}`}
                onClick={() => setOpen(false)}
              >
                {t('search.viewAllInCatalog', { q: debouncedQ })}
              </Link>
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
