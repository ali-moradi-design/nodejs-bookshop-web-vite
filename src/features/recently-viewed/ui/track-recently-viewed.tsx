import { useEffect } from 'react';
import type { Book } from '@/entities/book';
import { pushRecentlyViewed } from '../model/recently-viewed';

/** Call on book-detail mount to record a view. */
export function useTrackRecentlyViewed(book: Book | null | undefined) {
  useEffect(() => {
    if (!book?.id) return;
    pushRecentlyViewed({
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      currency: book.currency,
      coverImageUrl: book.coverImageUrl,
    });
  }, [book?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- snapshot on id change
}
