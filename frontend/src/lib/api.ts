import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction helper pour décoder le JWT et obtenir l'expiration
function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convertir en millisecondes
  } catch (error) {
    return null;
  }
}

// Fonction de refresh des tokens
async function refreshTokens(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    console.log('✅ Token refreshed automatiquement');
    return accessToken;
  } catch (error) {
    console.error('❌ Échec du refresh automatique');
    return null;
  }
}

// ✅ Intercepteur amélioré : refresh automatique AVANT expiration
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('accessToken');
      
      if (token) {
        const expiryTime = getTokenExpiry(token);
        const now = Date.now();
        
        // ✅ Si le token expire dans moins de 5 minutes, le refresh automatiquement
        if (expiryTime && (expiryTime - now < 5 * 60 * 1000)) {
          console.log('⏰ Token va expirer bientôt, refresh automatique...');
          const newToken = await refreshTokens();
          token = newToken || token; // Utiliser le nouveau token si le refresh a réussi
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Variable pour éviter les multiples tentatives de refresh simultanées
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Intercepteur pour gérer le refresh du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 et pas déjà en train de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre la requête en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken, user } = response.data;

        // Mettre à jour le localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Mettre à jour le header de la requête originale
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Traiter la queue des requêtes en attente
        processQueue(null, accessToken);
        
        isRefreshing = false;

        // Réessayer la requête originale
        return api(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        processQueue(refreshError, null);
        isRefreshing = false;
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Rediriger vers la page de connexion
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;





