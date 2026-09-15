import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { StorefrontShell } from '@/widgets/storefront-shell';
import { PanelShell } from '@/widgets/panel-shell';
import { AdminShell } from '@/widgets/admin-shell';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { PageLoader } from '@/shared/ui';
import { HomePage } from '@/pages/home';
import { CatalogPage } from '@/pages/catalog';
import { BookDetailPage } from '@/pages/book-detail';
import { CartPage } from '@/pages/cart';
import { CheckoutPage } from '@/pages/checkout';
import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { PanelDashboardPage } from '@/pages/panel/dashboard';
import { ProfilePage } from '@/pages/panel/profile';
import { PanelOrdersPage } from '@/pages/panel/orders';
import { PanelOrderDetailPage } from '@/pages/panel/order-detail';
import { FavoritesPage } from '@/pages/panel/favorites';
import { MyReviewsPage } from '@/pages/panel/reviews';
import { ReportIssuePage } from '@/pages/panel/report';

const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/dashboard').then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminBooksPage = lazy(() =>
  import('@/pages/admin/books').then((m) => ({ default: m.AdminBooksPage })),
);
const AdminOrdersPage = lazy(() =>
  import('@/pages/admin/orders').then((m) => ({ default: m.AdminOrdersPage })),
);
const AdminUsersPage = lazy(() =>
  import('@/pages/admin/users').then((m) => ({ default: m.AdminUsersPage })),
);
const AdminRolesPage = lazy(() =>
  import('@/pages/admin/roles').then((m) => ({ default: m.AdminRolesPage })),
);
const AdminPermissionsPage = lazy(() =>
  import('@/pages/admin/permissions').then((m) => ({ default: m.AdminPermissionsPage })),
);
const AdminDiscountsPage = lazy(() =>
  import('@/pages/admin/discounts').then((m) => ({ default: m.AdminDiscountsPage })),
);
const AdminReportsPage = lazy(() =>
  import('@/pages/admin/reports').then((m) => ({ default: m.AdminReportsPage })),
);
const AdminAnalyticsPage = lazy(() =>
  import('@/pages/admin/analytics').then((m) => ({ default: m.AdminAnalyticsPage })),
);

const StorefrontLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <StorefrontShell>
      <Outlet />
    </StorefrontShell>
    <Footer />
  </div>
);

const PanelLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <PanelShell>
      <Outlet />
    </PanelShell>
  </div>
);

const AdminLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <AdminShell>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </AdminShell>
  </div>
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route element={<StorefrontLayout />}>
            <Route index element={<HomePage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="books/:id" element={<BookDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          <Route path="panel" element={<PanelLayout />}>
            <Route index element={<PanelDashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<PanelOrdersPage />} />
            <Route path="orders/:id" element={<PanelOrderDetailPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="reviews" element={<MyReviewsPage />} />
            <Route path="report" element={<ReportIssuePage />} />
          </Route>

          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="books" element={<AdminBooksPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="roles" element={<AdminRolesPage />} />
            <Route path="permissions" element={<AdminPermissionsPage />} />
            <Route path="discounts" element={<AdminDiscountsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProviders>
    </BrowserRouter>
  );
}
