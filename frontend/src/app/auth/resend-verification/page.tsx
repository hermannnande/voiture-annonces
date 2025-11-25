'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ResendVerificationPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/resend-verification', { email });
      setSuccess(true);
    } catch (error: any) {
      setError(
        error.response?.data?.message || 
        'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">AC</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Annonces Auto CI
              </span>
            </Link>
          </div>

          <div className="card p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Email Envoyé ! ✅
            </h1>

            <p className="text-gray-600 mb-6">
              Un nouvel email de vérification a été envoyé à <strong>{email}</strong>.
              Vérifiez votre boîte de réception.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="btn-primary w-full"
              >
                Se connecter
              </button>

              <Link
                href="/"
                className="btn-secondary w-full block text-center"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-white mb-2">
            Renvoyer l'Email de Vérification
          </h1>
          <p className="text-primary-100">
            Entrez votre email pour recevoir un nouveau lien
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="votre@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Envoi en cours...</span>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Renvoyer l'Email</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la connexion</span>
            </Link>
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
