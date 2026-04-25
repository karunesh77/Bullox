import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  role: 'USER' | 'PRO' | 'EXPERT' | 'ADMIN';
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAuthStore = create<AuthStore>(
  persist(
    (set: any) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user: User, accessToken: string, refreshToken: string) => {
        localStorage.setItem('refreshToken', refreshToken);
        set({ user, accessToken, isAuthenticated: true });
      },
      setUser: (user: User) => set({ user }),
      logout: () => {
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-store',
    }
  ) as any
);
