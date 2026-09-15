import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookCard, type Book } from '@/entities/book';
import { FavoriteToggleButton } from '@/features/favorites';
import { useAuthStore } from '@/features/auth';
import { readRecentlyViewed, type RecentBookSnapshot } from '@/features/recently-viewed';

function snapshotToBook(s: RecentBookSnapshot): Book {
  return {
    id: s.id,
    title: s.title,
    author: s.author,
    description: '',
    price: s.price,
    currency: s.currency,
    stock: 1,
    coverImageUrl: s.coverImageUrl,
    featured: false,
    createdAt: new Date(s.viewedAt).toISOString(),
    updatedAt: new Date(s.viewedAt).toISOString(),
  };
}

export function RecentlyViewedSection({ excludeId }: { excludeId?: string }) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<RecentBookSnapshot[]>([]);

  useEffect(() => {
    setItems(readRecentlyViewed());
  }, []);

  const books = useMemo(
    () =>
      items
        .filter((s) => s.id !== excludeId)
        .map(snapshotToBook)
        .slice(0, 8),
    [items, excludeId],
  );

  if (books.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{t('home.recentlyViewed')}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            actions={
              <FavoriteToggleButton bookId={book.id} compact isAuthenticated={Boolean(user)} />
            }
          />
        ))}
      </div>
    </section>
  );
}
