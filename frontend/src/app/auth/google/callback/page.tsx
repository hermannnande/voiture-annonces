'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTokens, fetchUser } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');

      if (!accessToken || !refreshToken) {
        setStatus('error');
        setMessage('Tokens d\'authentification manquants');
        return;
      }

      try {
        // Sauvegarder les tokens
        setTokens(accessToken, refreshToken);

        // Récupérer les infos utilisateur
        await fetchUser();

        setStatus('success');
        setMessage('Connexion réussie ! Redirection en cours...');

        // Rediriger vers le dashboard après 2 secondes
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error: any) {
        setStatus('error');
        setMessage('Erreur lors de la récupération des informations utilisateur');
        console.error('Erreur Google OAuth:', error);
      }
    };

    handleCallback();
  }, [searchParams, router, setTokens, fetchUser]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <Loader2 className="w-16 h-16 text-primary-600 mx-auto animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Connexion avec Google...
          </h2>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous vous authentifions.
          </p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ✅ Connexion réussie !
          </h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          ❌ Erreur d'authentification
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Retour à la connexion
          </Link>
          <Link
            href="/auth/register"
            className="block w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="w-16 h-16 text-primary-600 animate-spin" />
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}

