import { create } from 'zustand';

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
  setDemoMode: () => void;
  logout: () => void;
}

const DEMO_USER: User = {
  id: 'demo-001',
  email: 'client@demo.bullox.com',
  username: 'ClientDemo',
  role: 'PRO',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ClientDemo',
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: DEMO_USER,
  accessToken: 'demo-token-preview',
  isAuthenticated: true,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  setUser: (user) => set({ user }),

  setDemoMode: () => {
    // Demo mode for Vercel preview (no backend required)
    const demoToken = 'demo-token-' + Date.now();
    localStorage.setItem('accessToken', demoToken);
    localStorage.setItem('refreshToken', 'demo-refresh-' + Date.now());
    set({ user: DEMO_USER, accessToken: demoToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
