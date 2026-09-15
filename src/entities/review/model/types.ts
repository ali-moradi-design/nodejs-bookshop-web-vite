export interface Review {
  id: string;
  book: string;
  user: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  populated?: {
    user?: { name: string; email: string };
    book?: { title: string; author: string };
  };
}

export interface CreateReviewInput {
  book: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface ReviewListParams {
  book?: string;
  user?: string;
  page?: number;
  limit?: number;
}
