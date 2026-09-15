import { apiGet, apiPatch, apiPost } from '@/shared/api';
import type { ApiData } from '@/shared/api';
import type { Order, OrderStatus } from '../model/types';

export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

export const fetchOrders = () => apiGet<ApiData<Order[]>>('/orders');

export const fetchOrder = (id: string) => apiGet<ApiData<Order>>(`/orders/${id}`);

export const payOrder = (id: string) => apiPost<ApiData<Order>>(`/orders/${id}/pay`);

export const updateOrderStatus = (id: string, status: OrderStatus, note?: string) =>
  apiPatch<ApiData<Order>>(`/orders/${id}/status`, { status, note });
