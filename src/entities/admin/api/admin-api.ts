import { apiGet } from '@/shared/api';
import type { ApiData } from '@/shared/api';
import type { Book } from '@/entities/book';
import type { Order } from '@/entities/order';
import type { DashboardSummary } from '../model/types';

export const adminKeys = {
  all: ['admin'] as const,
  summary: () => [...adminKeys.all, 'summary'] as const,
  recentOrders: (limit?: number) => [...adminKeys.all, 'recent-orders', limit] as const,
  lowStock: (threshold?: number) => [...adminKeys.all, 'low-stock', threshold] as const,
};

export const fetchDashboardSummary = () =>
  apiGet<ApiData<DashboardSummary>>('/admin/dashboard/summary');

export const fetchRecentOrders = (limit = 10) =>
  apiGet<ApiData<Order[]>>('/admin/dashboard/recent-orders', { limit });

export const fetchLowStock = (threshold = 5) =>
  apiGet<ApiData<Book[]>>('/admin/dashboard/low-stock', { threshold });
