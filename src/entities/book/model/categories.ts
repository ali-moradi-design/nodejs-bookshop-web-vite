/** Seed-aligned category list for catalog filters (nodejs-bookshop-layered). */
export const BOOK_CATEGORIES = [
  'algorithms',
  'architecture',
  'business',
  'c',
  'classics',
  'data',
  'ddd',
  'design-patterns',
  'devops',
  'dystopia',
  'fantasy',
  'fiction',
  'history',
  'horror',
  'java',
  'javascript',
  'management',
  'microservices',
  'nonfiction',
  'philosophy',
  'physics',
  'programming',
  'sci-fi',
  'science',
  'software',
  'sre',
  'young-adult',
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

/** Dual-range price slider bounds (seed max ≈ 90). */
export const BOOK_PRICE_MIN = 0;
export const BOOK_PRICE_MAX = 100;
