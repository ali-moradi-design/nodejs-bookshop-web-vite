import { Link } from 'react-router-dom';
import { BookOpen, ShoppingCart, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth';
import { ThemeSwitcher } from '@/features/theme-switcher';
import { LocaleSwitcher } from '@/features/locale-switcher';
import { HeaderBookSearch } from '@/features/book-search';
import { Button } from '@/shared/ui';
import { isAdminUser } from '@/entities/user';

export function Header() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[120rem] items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>{t('common.appName')}</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link to="/catalog" className="text-muted-foreground hover:text-foreground">
              {t('nav.catalog')}
            </Link>
            {user ? (
              <Link to="/panel" className="text-muted-foreground hover:text-foreground">
                {t('nav.account')}
              </Link>
            ) : null}
            {isAdminUser(user) ? (
              <Link to="/admin" className="text-muted-foreground hover:text-foreground">
                {t('nav.admin')}
              </Link>
            ) : null}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <HeaderBookSearch />
          <LocaleSwitcher />
          <ThemeSwitcher />
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart" aria-label={t('nav.cart')}>
              <ShoppingCart />
            </Link>
          </Button>
          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/panel" aria-label={t('nav.account')}>
                  <User />
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => void logout()}>
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">{t('nav.register')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
