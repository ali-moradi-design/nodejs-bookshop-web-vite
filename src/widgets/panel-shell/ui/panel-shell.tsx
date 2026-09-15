import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib';

const links = [
  { href: '/panel', key: 'dashboard' },
  { href: '/panel/profile', key: 'profile' },
  { href: '/panel/orders', key: 'orders' },
  { href: '/panel/favorites', key: 'favorites' },
  { href: '/panel/reviews', key: 'reviews' },
  { href: '/panel/report', key: 'report' },
] as const;

export function PanelShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div className="mx-auto flex w-full max-w-[120rem] flex-1 flex-col gap-6 px-4 py-8 md:flex-row">
      <aside className="w-full shrink-0 md:w-56">
        <nav className="flex flex-row gap-1 overflow-x-auto rounded-xl border bg-card p-2 md:flex-col">
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
