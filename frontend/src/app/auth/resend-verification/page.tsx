'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

export default function ResendVerificationPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.post('/auth/resend-verification', { email });
      setSuccess(true);
      setError('');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Erreur lors de l\'envoi de l\'email'
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Mail className="w-16 h-16 mx-auto text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Renvoyer l'email de vérification
          </h1>
          <p className="text-gray-600">
            Entrez votre adresse email pour recevoir un nouveau lien de vérification
          </p>
        </div>

        {/* Formulaire */}
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="votre.email@exemple.com"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span>Envoyer l'email</span>
                </>
              )}
            </button>

            <Link
              href="/auth/login"
              className="btn-outline w-full inline-flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à la connexion</span>
            </Link>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Email envoyé !
              </h2>
              <p className="text-gray-600 mb-4">
                Un nouvel email de vérification a été envoyé à <strong>{email}</strong>.
                Vérifiez votre boîte de réception et vos spams.
              </p>
            </div>
            <div className="space-y-2">
              <Link
                href="/auth/login"
                className="btn-primary w-full inline-block"
              >
                Retour à la connexion
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="btn-outline w-full"
              >
                Renvoyer à nouveau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

