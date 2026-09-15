const STORAGE_KEY = 'bookstore-recently-viewed';
const MAX = 8;

export type RecentBookSnapshot = {
  id: string;
  title: string;
  author: string;
  price: number;
  currency: string;
  coverImageUrl?: string;
  viewedAt: number;
};

export function readRecentlyViewed(): RecentBookSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentBookSnapshot[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(
  book: Omit<RecentBookSnapshot, 'viewedAt'>,
): RecentBookSnapshot[] {
  const next: RecentBookSnapshot = { ...book, viewedAt: Date.now() };
  const prev = readRecentlyViewed().filter((b) => b.id !== book.id);
  const list = [next, ...prev].slice(0, MAX);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* ignore quota */
  }
  return list;
}
