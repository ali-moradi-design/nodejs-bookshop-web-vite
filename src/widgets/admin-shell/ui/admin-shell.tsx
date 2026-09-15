import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth';
import { isAdminUser } from '@/entities/user';
import { cn } from '@/shared/lib';
import { Alert, PageLoader } from '@/shared/ui';

const links = [
  { href: '/admin', key: 'dashboard' },
  { href: '/admin/books', key: 'books' },
  { href: '/admin/orders', key: 'orders' },
  { href: '/admin/users', key: 'users' },
  { href: '/admin/roles', key: 'roles' },
  { href: '/admin/permissions', key: 'permissions' },
  { href: '/admin/discounts', key: 'discounts' },
  { href: '/admin/reports', key: 'reports' },
  { href: '/admin/analytics', key: 'analytics' },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const admin = isAdminUser(user);

  useEffect(() => {
    if (hydrated && !user) navigate('/login', { replace: true });
  }, [hydrated, user, navigate]);

  if (!hydrated || !user) return <PageLoader />;

  if (!admin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Alert variant="destructive">Forbidden: admin role required.</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-60">
        <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('admin.title')}
        </div>
        <nav className="flex flex-row gap-1 overflow-x-auto rounded-xl border bg-card p-2 lg:flex-col">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors',
                pathname === link.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
