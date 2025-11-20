'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle } from 'lucide-react';

function RegistrationSuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🎉 Inscription réussie !
        </h1>
        <p className="text-gray-600 mb-6">
          Bienvenue sur <strong>Voiture Annonces</strong> !
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-3">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Un email de vérification a été envoyé à :
          </p>
          <p className="font-semibold text-blue-600 mb-3 break-all">
            {email}
          </p>
          <p className="text-xs text-gray-600">
            Veuillez cliquer sur le lien dans l'email pour activer votre compte.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-700">
            <strong>📌 Note :</strong> Si vous ne trouvez pas l'email, vérifiez votre dossier spam ou courrier indésirable.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/auth/login" className="btn-primary block">
            Aller à la connexion
          </Link>
          <Link href="/" className="btn-secondary block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <RegistrationSuccessContent />
    </Suspense>
  );
}
