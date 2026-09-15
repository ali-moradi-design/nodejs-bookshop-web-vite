export interface Favorite {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
  updatedAt: string;
  populated?: {
    book?: {
      id: string;
      title: string;
      author: string;
      price: number;
      coverImageUrl?: string;
    };
  };
}
