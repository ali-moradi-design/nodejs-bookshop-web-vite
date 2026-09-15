import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth';
import { ProfileForm } from '@/features/profile';

export function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const refreshMe = useAuthStore((s) => s.refreshMe);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.profile')}</h1>
      <ProfileForm
        user={user}
        onUpdated={async (next) => {
          setUser(next);
          await refreshMe();
        }}
      />
    </div>
  );
}
