import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api';
import type { ApiData, ApiMessage } from '@/shared/api';
import type { CreateDiscountInput, Discount, UpdateDiscountInput } from '../model/types';

export const discountKeys = {
  all: ['discounts'] as const,
  list: () => [...discountKeys.all, 'list'] as const,
};

export const fetchDiscounts = () => apiGet<ApiData<Discount[]>>('/discounts');

export const createDiscount = (input: CreateDiscountInput) =>
  apiPost<ApiData<Discount>>('/discounts', input);

export const updateDiscount = (id: string, input: UpdateDiscountInput) =>
  apiPatch<ApiData<Discount>>(`/discounts/${id}`, input);

export const deleteDiscount = (id: string) => apiDelete<ApiMessage>(`/discounts/${id}`);
