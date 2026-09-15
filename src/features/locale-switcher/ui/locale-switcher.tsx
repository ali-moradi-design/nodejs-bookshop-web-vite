import { useTranslation } from 'react-i18next';
import { usePreferences, type Locale } from '@/shared/hooks';
import { Button } from '@/shared/ui';

export function LocaleSwitcher() {
  const { t } = useTranslation();
  const locale = usePreferences((s) => s.locale);
  const setLocale = usePreferences((s) => s.setLocale);

  const toggle = () => {
    const next: Locale = locale === 'en' ? 'fa' : 'en';
    setLocale(next);
  };

  return (
    <Button variant="outline" size="sm" onClick={toggle} aria-label={t('theme.language')}>
      {locale === 'en' ? 'فا' : 'EN'}
    </Button>
  );
}
