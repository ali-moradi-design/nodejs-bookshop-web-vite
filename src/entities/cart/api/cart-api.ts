import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api';
import type { ApiData } from '@/shared/api';
import type { Order } from '@/entities/order';
import type { Cart, CheckoutInput } from '../model/types';

export const cartKeys = {
  all: ['cart'] as const,
  current: () => [...cartKeys.all, 'current'] as const,
};

export const fetchCart = () => apiGet<ApiData<Cart>>('/cart');

export const addCartItem = (bookId: string, quantity: number) =>
  apiPost<ApiData<Cart>>('/cart/items', { bookId, quantity });

export const updateCartItem = (bookId: string, quantity: number) =>
  apiPatch<ApiData<Cart>>(`/cart/items/${bookId}`, { quantity });

export const removeCartItem = (bookId: string) => apiDelete<ApiData<Cart>>(`/cart/items/${bookId}`);

export const clearCart = () => apiDelete<ApiData<Cart>>('/cart');

export const checkoutCart = (input: CheckoutInput) =>
  apiPost<ApiData<Order>>('/cart/checkout', input);
