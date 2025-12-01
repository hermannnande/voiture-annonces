'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

export default function PaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'pending'>('checking');
  const [message, setMessage] = useState('Vérification du paiement...');

  useEffect(() => {
    const monerooPaymentId = searchParams.get('monerooPaymentId');
    const monerooPaymentStatus = searchParams.get('monerooPaymentStatus');

    if (!monerooPaymentId) {
      setStatus('failed');
      setMessage('ID de paiement manquant');
      return;
    }

    // Déterminer le statut basé sur le paramètre Moneroo
    if (monerooPaymentStatus === 'success' || monerooPaymentStatus === 'successful') {
      setStatus('success');
      setMessage('Paiement réussi ! Vos crédits ont été ajoutés à votre wallet.');
    } else if (monerooPaymentStatus === 'failed' || monerooPaymentStatus === 'error') {
      setStatus('failed');
      setMessage('Le paiement a échoué. Veuillez réessayer.');
    } else if (monerooPaymentStatus === 'pending' || monerooPaymentStatus === 'processing') {
      setStatus('pending');
      setMessage('Paiement en cours de traitement. Vos crédits seront ajoutés sous peu.');
    } else {
      setStatus('checking');
      setMessage('Vérification en cours...');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card p-8 text-center">
            {/* Icône selon le statut */}
            <div className="mb-6">
              {status === 'checking' && (
                <Loader className="w-20 h-20 mx-auto text-primary-600 animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
              )}
              {status === 'failed' && (
                <XCircle className="w-20 h-20 mx-auto text-red-500" />
              )}
              {status === 'pending' && (
                <Clock className="w-20 h-20 mx-auto text-yellow-500" />
              )}
            </div>

            {/* Titre selon le statut */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {status === 'checking' && 'Vérification en cours...'}
              {status === 'success' && '🎉 Paiement réussi !'}
              {status === 'failed' && 'Paiement échoué'}
              {status === 'pending' && 'Paiement en traitement'}
            </h1>

            {/* Message */}
            <p className="text-gray-600 mb-6">{message}</p>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/dashboard/wallet"
                className="block btn-primary w-full text-center"
              >
                Retour au Wallet
              </Link>

              {status === 'failed' && (
                <button
                  onClick={() => router.back()}
                  className="block btn-outline w-full"
                >
                  Réessayer
                </button>
              )}

              {status === 'success' && (
                <Link
                  href="/dashboard/listings"
                  className="block btn-outline w-full text-center"
                >
                  Booster une annonce
                </Link>
              )}
            </div>

            {/* Info complémentaire */}
            {status === 'pending' && (
              <p className="text-xs text-gray-500 mt-6">
                💡 Vos crédits seront ajoutés automatiquement dès confirmation du paiement (généralement sous 5 minutes).
              </p>
            )}

            {status === 'failed' && (
              <p className="text-xs text-gray-500 mt-6">
                💬 Besoin d'aide ? Contactez-nous sur WhatsApp : +225 07 78 03 00 75
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

