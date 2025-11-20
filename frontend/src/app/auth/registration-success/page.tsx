'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Mail, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

function RegistrationSuccessContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setResending(true);
    setResendMessage('');

    try {
      await api.post('/auth/resend-verification', { email });
      setResendMessage('✅ Un nouvel email de vérification a été envoyé !');
    } catch (error: any) {
      setResendMessage('❌ ' + (error.response?.data?.message || 'Erreur lors de l\'envoi'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Icône de succès */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            🎉 Inscription réussie !
          </h1>
          <p className="text-lg text-gray-600">
            Bienvenue sur <strong>Annonces Auto CI</strong>
          </p>
        </div>

        {/* Message de vérification */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start">
            <Mail className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                📧 Vérifiez votre adresse email
              </h3>
              <p className="text-blue-800 mb-3">
                Un email de confirmation a été envoyé à :
              </p>
              <p className="font-semibold text-blue-900 bg-blue-100 px-4 py-2 rounded-lg inline-block mb-3">
                {email || 'votre adresse email'}
              </p>
              <p className="text-sm text-blue-700">
                Cliquez sur le lien dans l'email pour activer votre compte et commencer à publier vos annonces.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">📋 Prochaines étapes :</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
              <span>Ouvrez votre boîte email (<strong>{email?.split('@')[1] || 'Gmail, Yahoo, etc.'}</strong>)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
              <span>Cherchez l'email de <strong>Voiture Annonces</strong> (vérifiez aussi les spams)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
              <span>Cliquez sur le lien de vérification (valable 24 heures)</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
              <span>Connectez-vous et commencez à publier vos annonces !</span>
            </li>
          </ol>
        </div>

        {/* Renvoyer l'email */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <p className="text-sm text-yellow-800 mb-3">
            <strong>Vous n'avez pas reçu l'email ?</strong>
          </p>
          {resendMessage && (
            <div className={`mb-3 p-3 rounded-lg text-sm ${
              resendMessage.startsWith('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {resendMessage}
            </div>
          )}
          <button
            onClick={handleResendEmail}
            disabled={resending || !email}
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {resending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Renvoyer l'email de vérification
              </>
            )}
          </button>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-purple-700 transition-all text-center"
          >
            Se connecter
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-center"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
      </div>
    }>
      <RegistrationSuccessContent />
    </Suspense>
  );
}
