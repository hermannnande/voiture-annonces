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
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');

    // 🔍 Vérifier l'intégrité de la session
    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // 🔐 Validation supplémentaire : vérifier que les données sont cohérentes
        if (!user.id || !user.email || !user.role) {
          console.error('⚠️  Session corrompue (données utilisateur incomplètes)');
          localStorage.clear();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          return;
        }
        
        // 🕐 Vérifier que la session n'est pas trop vieille (> 30 jours)
        if (sessionTimestamp) {
          const sessionAge = Date.now() - parseInt(sessionTimestamp);
          const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
          
          if (sessionAge > thirtyDaysInMs) {
            console.warn('⚠️  Session expirée (> 30 jours), reconnexion nécessaire');
            localStorage.clear();
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
            });
            return;
          }
        }
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
        
        console.log('✅ Session restaurée:', { 
          userId: user.id,
          userName: user.name, 
          userEmail: user.email,
          userRole: user.role,
          sessionAge: sessionTimestamp ? `${Math.floor((Date.now() - parseInt(sessionTimestamp)) / (1000 * 60 * 60 * 24))} jours` : 'inconnue'
        });
      } catch (error) {
        console.error('❌ Erreur restauration session:', error);
        localStorage.clear();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      }
    } else {
      console.log('⚠️  Pas de session à restaurer (tokens manquants)');
      // Nettoyer tout le localStorage au cas où
      localStorage.clear();
    }
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = response.data;

    // 🔒 Sécurité : Nettoyer toute session existante avant de créer la nouvelle
    localStorage.clear();
    
    // Stocker dans localStorage (requis pour api.ts)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    // 🔐 Ajouter un timestamp pour vérifier la fraîcheur de la session
    localStorage.setItem('sessionTimestamp', Date.now().toString());

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });

    console.log('✅ Connexion réussie:', {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: new Date().toISOString()
    });
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
    const storedAccessToken = localStorage.getItem('accessToken');
    
    // 🔐 SÉCURITÉ CRITIQUE : Vérifier la cohérence de la session
    if (storedUserStr && storedAccessToken) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        
        // Si l'utilisateur en mémoire est différent de celui dans localStorage
        if (currentUser?.id !== storedUser?.id) {
          console.warn('🚨 ALERTE SÉCURITÉ : Utilisateur différent détecté !', {
            currentUserId: currentUser?.id,
            currentUserEmail: currentUser?.email,
            storedUserId: storedUser?.id,
            storedUserEmail: storedUser?.email,
            timestamp: new Date().toISOString()
          });
          
          // 🔒 FORCER la resynchronisation
          useAuthStore.getState().initializeAuth();
          
          // Recharger la page pour éviter tout problème de sécurité
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          console.log('✅ Session cohérente, même utilisateur');
        }
      } catch (error) {
        console.error('❌ Erreur parsing user lors du focus:', error);
        // En cas d'erreur, déconnecter par sécurité
        localStorage.clear();
        window.location.href = '/auth/login';
      }
    } else if (currentUser && !storedUserStr) {
      // Si on a un user en mémoire mais pas dans localStorage
      console.warn('⚠️  Session en mémoire mais pas dans localStorage, déconnexion');
      useAuthStore.getState().logout();
    }
  });
}
