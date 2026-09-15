import { apiDelete, apiGet, apiPatch, apiPost } from '@/shared/api';
import type { ApiData, ApiMessage } from '@/shared/api';
import type {
  CreateIssueInput,
  IssueReport,
  OrdersByStatusItem,
  RevenueSummary,
  SalesByDateItem,
  TopBookItem,
  UpdateIssueInput,
} from '../model/types';

export const reportKeys = {
  all: ['reports'] as const,
  issues: () => [...reportKeys.all, 'issues'] as const,
  revenue: (from?: string, to?: string) => [...reportKeys.all, 'revenue', from, to] as const,
  ordersByStatus: () => [...reportKeys.all, 'orders-by-status'] as const,
  topBooks: (from?: string, to?: string) => [...reportKeys.all, 'top-books', from, to] as const,
  salesByDate: (from?: string, to?: string) =>
    [...reportKeys.all, 'sales-by-date', from, to] as const,
};

export const fetchIssues = () => apiGet<ApiData<IssueReport[]>>('/reports/issues');

export const createIssue = (input: CreateIssueInput) =>
  apiPost<ApiData<IssueReport>>('/reports/issues', input);

export const updateIssue = (id: string, input: UpdateIssueInput) =>
  apiPatch<ApiData<IssueReport>>(`/reports/issues/${id}`, input);

export const deleteIssue = (id: string) => apiDelete<ApiMessage>(`/reports/issues/${id}`);

export const fetchRevenue = (from?: string, to?: string) =>
  apiGet<ApiData<RevenueSummary>>('/reports/analytics/revenue', { from, to });

export const fetchOrdersByStatus = () =>
  apiGet<ApiData<OrdersByStatusItem[]>>('/reports/analytics/orders-by-status');

export const fetchTopBooks = (from?: string, to?: string) =>
  apiGet<ApiData<TopBookItem[]>>('/reports/analytics/top-books', { from, to });

export const fetchSalesByDate = (from?: string, to?: string) =>
  apiGet<ApiData<SalesByDateItem[]>>('/reports/analytics/sales-by-date', { from, to });
