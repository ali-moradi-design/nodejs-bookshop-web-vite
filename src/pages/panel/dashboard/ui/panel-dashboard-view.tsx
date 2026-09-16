import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth';
import { useOrdersQuery } from '@/entities/order';
import { useFavoritesQuery } from '@/entities/favorite';
import { useReviewsQuery } from '@/entities/review';
import { KpiCards } from '@/widgets/kpi-cards';
import { Button, Card, CardContent, CardHeader, CardTitle, PageLoader } from '@/shared/ui';

export function PanelDashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const ordersQ = useOrdersQuery();
  const favQ = useFavoritesQuery();
  const reviewsQ = useReviewsQuery({ user: user?.id, limit: 100 }, { enabled: Boolean(user?.id) });

  if (ordersQ.isLoading || favQ.isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {t('panel.welcome')}
          {user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>
      <KpiCards
        items={[
          { label: t('panel.ordersCount'), value: ordersQ.data?.length ?? 0 },
          { label: t('panel.favoritesCount'), value: favQ.data?.length ?? 0 },
          { label: t('panel.reviewsCount'), value: reviewsQ.data?.length ?? 0 },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { href: '/panel/orders', label: t('nav.orders') },
          { href: '/panel/favorites', label: t('nav.favorites') },
          { href: '/panel/report', label: t('nav.report') },
        ].map((item) => (
          <Card key={item.href}>
            <CardHeader>
              <CardTitle className="text-base">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link to={item.href}>{t('common.next')}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
