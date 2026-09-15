import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { StorefrontShell } from '@/widgets/storefront-shell';
import { PanelShell } from '@/widgets/panel-shell';
import { AdminShell } from '@/widgets/admin-shell';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { RequireAuth } from '@/features/auth';
import { PageLoader } from '@/shared/ui';

const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('@/pages/catalog').then((m) => ({ default: m.CatalogPage })));
const BookDetailPage = lazy(() =>
  import('@/pages/book-detail').then((m) => ({ default: m.BookDetailPage })),
);
const CartPage = lazy(() => import('@/pages/cart').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() =>
  import('@/pages/checkout').then((m) => ({ default: m.CheckoutPage })),
);
const LoginPage = lazy(() => import('@/pages/login').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import('@/pages/register').then((m) => ({ default: m.RegisterPage })),
);
const PanelDashboardPage = lazy(() =>
  import('@/pages/panel/dashboard').then((m) => ({ default: m.PanelDashboardPage })),
);
const ProfilePage = lazy(() =>
  import('@/pages/panel/profile').then((m) => ({ default: m.ProfilePage })),
);
const PanelOrdersPage = lazy(() =>
  import('@/pages/panel/orders').then((m) => ({ default: m.PanelOrdersPage })),
);
const PanelOrderDetailPage = lazy(() =>
  import('@/pages/panel/order-detail').then((m) => ({ default: m.PanelOrderDetailPage })),
);
const FavoritesPage = lazy(() =>
  import('@/pages/panel/favorites').then((m) => ({ default: m.FavoritesPage })),
);
const MyReviewsPage = lazy(() =>
  import('@/pages/panel/reviews').then((m) => ({ default: m.MyReviewsPage })),
);
const ReportIssuePage = lazy(() =>
  import('@/pages/panel/report').then((m) => ({ default: m.ReportIssuePage })),
);
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

const RouteFallback = () => <PageLoader />;

const StorefrontLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <StorefrontShell>
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </StorefrontShell>
    <Footer />
  </div>
);

const PanelLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <RequireAuth>
      <PanelShell>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </PanelShell>
    </RequireAuth>
  </div>
);

const AdminLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <RequireAuth requireAdmin>
      <AdminShell>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </AdminShell>
    </RequireAuth>
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
