'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader } from 'lucide-react';

function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore(state => state.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      // Sauvegarder les tokens dans le store Zustand
      setAuth({
        accessToken,
        refreshToken,
        user: null, // Sera chargé automatiquement par le store
      });

      // Rediriger vers le dashboard
      router.push('/dashboard');
    } else {
      // Erreur - rediriger vers la page de connexion
      router.push('/auth/login?error=google_auth_failed');
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Connexion avec Google en cours... 🔐
        </h2>
        <p className="text-gray-600">
          Veuillez patienter un instant
        </p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <Loader className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    }>
      <GoogleCallbackHandler />
    </Suspense>
  );
}
