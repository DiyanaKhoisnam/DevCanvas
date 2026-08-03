import { create } from 'zustand';
import { UserProfile } from '../types';
import { setAccessToken, api } from '../services/api';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserProfile | null, token: string | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    setAccessToken(token);
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      setAccessToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await api.post('/auth/refresh', {}, { timeout: 3000 });
      const { user, accessToken } = res.data;
      if (user && accessToken) {
        setAccessToken(accessToken);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        setAccessToken(null);
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      setAccessToken(null);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
