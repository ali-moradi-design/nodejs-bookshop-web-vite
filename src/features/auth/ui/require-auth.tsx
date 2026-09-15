import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdminUser } from '@/entities/user';
import { Alert, PageLoader } from '@/shared/ui';
import { useAuthStore } from '../model/auth-store';

type Props = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

/** Route-level auth gate (used by app layouts). */
export function RequireAuth({ children, requireAdmin = false }: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (hydrated && !user) navigate('/login', { replace: true });
  }, [hydrated, user, navigate]);

  if (!hydrated || !user) return <PageLoader />;

  if (requireAdmin && !isAdminUser(user)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <Alert variant="destructive">Forbidden: admin role required.</Alert>
      </div>
    );
  }

  return children;
}
