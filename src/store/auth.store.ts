import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/features/auth/types/auth.types';
import { setClientToken, setClientUser, removeClientToken } from '@/lib/auth/session';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (partialUser: Partial<User>) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, accessToken) => {
        setClientToken(accessToken);
        setClientUser(user);
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      setUser: (user) => {
        const current = get().user;
        const permissions =
          user.permissions && user.permissions.length > 0
            ? user.permissions
            : current?.permissions || [];
        const mergedUser = { ...current, ...user, permissions } as User;
        setClientUser(mergedUser);
        set({ user: mergedUser });
      },

      setAccessToken: (accessToken) => {
        setClientToken(accessToken);
        set({ accessToken, isAuthenticated: true });
      },

      updateUser: (partialUser) => {
        const currentUser = get().user;
        if (currentUser) {
          const updated = { ...currentUser, ...partialUser } as User;
          setClientUser(updated);
          set({ user: updated });
        }
      },

      logout: () => {
        removeClientToken();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user) return false;
        if (user.role?.name === 'SUPER_ADMIN') return true;

        // 1. Direct user permissions array
        if (user.permissions?.includes(permission)) return true;

        // 2. Role string permissions array
        if (user.role?.permissions?.includes(permission)) return true;

        // 3. Nested rolePermissions objects from Prisma include
        if (user.role?.rolePermissions) {
          const names = user.role.rolePermissions.map(
            (rp) => rp.permission?.name || rp.permissionId
          );
          if (names.includes(permission)) return true;
        }

        return false;
      },
    }),
    {
      name: 'giant-bd-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    },
  ),
);

