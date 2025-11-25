'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { LogIn } from 'lucide-react';
import GoogleButton from '@/components/auth/GoogleButton';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-bold text-xl">AC</span>
            </div>
            <span className="text-2xl font-bold text-white">
              Annonces Auto CI
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-primary-100">
            Bienvenue ! Connectez-vous à votre compte
          </p>
        </div>

        {/* Formulaire */}
        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Connexion...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OU</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Bouton Google */}
          <GoogleButton text="Se connecter avec Google" />

          <div className="mt-6 text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Inscrivez-vous
            </Link>
          </div>
        </div>

        {/* Comptes de test */}
        <div className="mt-6 card p-4 bg-blue-50 border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-2">Comptes de test :</p>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>Admin :</strong> admin@voiture.com / admin123</p>
            <p><strong>Vendeur :</strong> vendeur1@gmail.com / seller123</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white hover:text-primary-100 text-sm">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}





