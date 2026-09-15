import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/entities/user';
import { isAdminUser } from '@/entities/user';
import * as userApi from '@/entities/user';

interface AuthState {
  user: User | null;
  hydrated: boolean;
  setUser: (user: User | null) => void;
  setHydrated: (v: boolean) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (input: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<User | null>;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,
      setUser: (user) => set({ user }),
      setHydrated: (hydrated) => set({ hydrated }),
      login: async (email, password) => {
        const res = await userApi.login(email, password);
        set({ user: res.user });
        try {
          const me = await userApi.fetchMe();
          set({ user: me.data });
          return me.data;
        } catch {
          return res.user;
        }
      },
      register: async (input) => {
        const res = await userApi.register(input);
        set({ user: res.user });
        try {
          const me = await userApi.fetchMe();
          set({ user: me.data });
          return me.data;
        } catch {
          return res.user;
        }
      },
      logout: async () => {
        try {
          await userApi.logout();
        } finally {
          set({ user: null });
        }
      },
      refreshMe: async () => {
        try {
          const me = await userApi.fetchMe();
          set({ user: me.data });
          return me.data;
        } catch {
          set({ user: null });
          return null;
        }
      },
      isAdmin: () => isAdminUser(get().user),
    }),
    {
      name: 'bookstore-auth',
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
