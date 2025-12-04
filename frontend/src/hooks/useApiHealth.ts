import { useEffect, useState } from 'react';
import api from '@/lib/api';

/**
 * Hook pour vérifier la santé de l'API backend
 * Détecte si l'API est accessible et alerte l'utilisateur si elle est down
 */
export function useApiHealth() {
  const [isApiHealthy, setIsApiHealthy] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiHealth = async () => {
    try {
      // Essayer de ping l'API (endpoint léger)
      await api.get('/health', { timeout: 5000 });
      
      if (!isApiHealthy) {
        console.log('✅ API backend est de nouveau accessible');
      }
      
      setIsApiHealthy(true);
      setLastCheck(new Date());
    } catch (error: any) {
      console.error('❌ API backend inaccessible:', error.message);
      setIsApiHealthy(false);
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    // Vérifier au montage du composant
    checkApiHealth();

    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    isApiHealthy,
    lastCheck,
    checkApiHealth,
  };
}

