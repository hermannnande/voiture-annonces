import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'SELLER' | 'SUPER_ADMIN';
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, accessToken, refreshToken } = response.data;

        // Stocker dans localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      register: async (data) => {
        const response = await api.post('/auth/register', data);
        const { user, accessToken, refreshToken } = response.data;

        // Stocker dans localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialUpdate: true,
    },
  ),
);

// Fonction pour initialiser l'authentification au chargement
if (typeof window !== 'undefined') {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userStr = localStorage.getItem('user');

  if (accessToken && refreshToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      useAuthStore.setState({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Erreur lors de la restauration de la session:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
}





