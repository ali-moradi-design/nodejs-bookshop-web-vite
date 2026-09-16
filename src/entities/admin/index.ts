export type { DashboardSummary } from './model/types';
export {
  adminKeys,
  fetchDashboardSummary,
  fetchRecentOrders,
  fetchLowStock,
} from './api/admin-api';
export { useDashboardSummaryQuery } from './api/use-dashboard-summary-query';
export { useRecentOrdersQuery } from './api/use-recent-orders-query';
export { useLowStockQuery } from './api/use-low-stock-query';
