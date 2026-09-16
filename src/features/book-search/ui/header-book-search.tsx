import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Book } from '@/entities/book';
import { useDebouncedValue, usePreferences } from '@/shared/hooks';
import { useBookSearchQuery } from '../model/use-book-search-query';
import { formatMoney, resolveImageUrl, cn } from '@/shared/lib';
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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQ = useDebouncedValue(query.trim(), 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQ]);

  const enabled = open && debouncedQ.length > 0;

  const { data, isFetching, isError } = useBookSearchQuery(debouncedQ, { enabled });

  const results: Book[] = data?.data ?? [];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      setOpen(false);
      navigate(`/books/${results[activeIndex].id}`);
    }
  };

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
              ref={inputRef}
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t('search.searchPlaceholder')}
              className="h-12 ps-10 text-base"
              aria-label={t('common.search')}
              aria-autocomplete="list"
              aria-controls="header-search-results"
            />
          </div>
          <p className="text-xs text-muted-foreground">{t('search.shortcutHint')}</p>
        </DialogHeader>

        <div
          id="header-search-results"
          role="listbox"
          className="max-h-[min(60vh,28rem)] overflow-y-auto p-2"
        >
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
              {results.map((book, idx) => {
                const src = resolveImageUrl(book.coverImageUrl) || '/placeholder-book.svg';
                return (
                  <li key={book.id} role="option" aria-selected={idx === activeIndex}>
                    <Link
                      to={`/books/${book.id}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent',
                        idx === activeIndex && 'bg-accent',
                      )}
                    >
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
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
