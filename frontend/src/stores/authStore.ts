import { create } from 'zustand';
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
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  // Initialiser l'auth depuis localStorage au chargement
  initializeAuth: () => {
    if (typeof window === 'undefined') return;

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');

    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
        console.log('✅ Session restaurée:', { 
          userName: user.name, 
          userEmail: user.email,
          userRole: user.role 
        });
      } catch (error) {
        console.error('❌ Erreur restauration session:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    } else {
      console.log('⚠️  Pas de session à restaurer (un ou plusieurs tokens manquants)');
    }
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = response.data;

    // Stocker dans localStorage (requis pour api.ts)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });

    console.log('✅ Connexion réussie, session stockée');
  },

  register: async (data) => {
    const response = await api.post('/auth/register', data);
    const { user, accessToken, refreshToken } = response.data;

    // Stocker dans localStorage (requis pour api.ts)
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
      console.log('✅ Inscription réussie, session stockée');
    } else {
      set({
        user: null,
        accessToken,
        refreshToken,
        isAuthenticated: false,
      });
    }
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

    console.log('✅ Déconnexion réussie, session supprimée');
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

// Initialiser automatiquement au chargement de l'app
if (typeof window !== 'undefined') {
  useAuthStore.getState().initializeAuth();
  
  // 🔄 Synchroniser le localStorage entre les onglets
  window.addEventListener('storage', (e) => {
    // Détecter les changements de localStorage dans d'autres onglets
    if (e.key === 'accessToken' || e.key === 'refreshToken' || e.key === 'user') {
      console.log('🔄 Changement localStorage détecté dans un autre onglet:', e.key);
      
      // Si un token a été supprimé (déconnexion), déconnecter aussi ici
      if (e.key === 'accessToken' && !e.newValue) {
        console.log('🚪 Déconnexion détectée dans un autre onglet');
        useAuthStore.getState().logout();
        return;
      }
      
      // Sinon, réinitialiser l'auth pour synchroniser
      setTimeout(() => {
        useAuthStore.getState().initializeAuth();
      }, 100);
    }
  });
  
  // 🔄 Synchroniser aussi au focus de la fenêtre (quand l'utilisateur revient sur l'onglet)
  window.addEventListener('focus', () => {
    console.log('👀 Focus sur l\'onglet, vérification de la session...');
    const currentUser = useAuthStore.getState().user;
    const storedUserStr = localStorage.getItem('user');
    
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        // Si l'utilisateur en mémoire est différent de celui dans localStorage
        if (currentUser?.id !== storedUser?.id) {
          console.log('⚠️  Utilisateur différent détecté, resynchronisation...', {
            currentUser: currentUser?.email,
            storedUser: storedUser?.email
          });
          useAuthStore.getState().initializeAuth();
        }
      } catch (error) {
        console.error('❌ Erreur parsing user lors du focus:', error);
      }
    }
  });
}
