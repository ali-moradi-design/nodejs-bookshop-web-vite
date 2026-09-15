import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((s) => s.hydrated);
  const refreshMe = useAuthStore((s) => s.refreshMe);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    if (!hydrated) {
      // zustand persist may already hydrate; ensure flag
      setHydrated(true);
    }
    void refreshMe();
  }, [hydrated, refreshMe, setHydrated]);

  return <>{children}</>;
}
