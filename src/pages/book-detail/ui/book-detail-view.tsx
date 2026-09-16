import { useParams } from 'react-router-dom';
import { BookDetailPanel } from '@/widgets/book-detail';

export function BookDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? '');
  return <BookDetailPanel bookId={id} />;
}
