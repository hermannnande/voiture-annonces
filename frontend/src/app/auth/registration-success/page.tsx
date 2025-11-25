'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

function RegistrationSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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

        {/* Card de succès */}
        <div className="card p-8 text-center">
          {/* Icône de succès */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Inscription Réussie ! 🎉
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Votre compte a été créé avec succès. Un email de vérification a été envoyé à :
          </p>

          {/* Email */}
          {email && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">{email}</span>
            </div>
          )}

          {/* Instructions */}
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <p className="text-sm text-gray-700">
              <strong>📧 Prochaines étapes :</strong>
            </p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Vérifiez votre boîte de réception</li>
              <li>Cliquez sur le lien de vérification</li>
              <li>Connectez-vous et commencez à vendre</li>
            </ol>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 mb-6">
            💡 Vous pouvez déjà vous connecter, mais certaines fonctionnalités nécessitent la vérification de votre email.
          </p>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/login')}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <span>Se connecter maintenant</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              href="/"
              className="btn-secondary w-full block text-center"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Aide */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/80 mb-2">
            Vous n'avez pas reçu l'email ?
          </p>
          <button
            onClick={() => router.push('/auth/resend-verification')}
            className="text-white font-medium hover:underline text-sm"
          >
            Renvoyer l'email de vérification
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-blue-800 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    }>
      <RegistrationSuccessContent />
    </Suspense>
  );
}
