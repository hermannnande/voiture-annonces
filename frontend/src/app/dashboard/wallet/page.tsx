'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Wallet, Plus, Clock, ArrowUpCircle, ArrowDownCircle, MessageCircle } from 'lucide-react';

export default function WalletPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Packs de crédits disponibles
  const creditPacks = [
    {
      id: 'starter',
      name: 'Pack Starter',
      credits: 50,
      price: 5000,
      description: '1 boost "Top de liste 7j"',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'standard',
      name: 'Pack Standard',
      credits: 100,
      price: 9500,
      description: '2 boosts (-5%)',
      popular: true,
      color: 'from-primary-500 to-primary-600',
    },
    {
      id: 'premium',
      name: 'Pack Premium',
      credits: 500,
      price: 45000,
      description: '10 boosts (-10%)',
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchWalletData();
  }, [isAuthenticated, router]);

  const fetchWalletData = async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        api.get('/wallet/me'),
        api.get('/wallet/me/transactions?limit=50'),
      ]);

      setWallet(walletRes.data);
      setTransactions(transactionsRes.data.transactions || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (pack: any) => {
    setPaymentProcessing(true);
    try {
      // Initialiser le paiement Moneroo
      const response = await api.post('/payments/initialize-credits', {
        creditsAmount: pack.credits,
        packName: pack.name,
        returnUrl: `${window.location.origin}/dashboard/wallet/payment-result`,
      });

      // Rediriger vers la page de paiement Moneroo
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        alert('Erreur lors de la création du paiement');
      }
    } catch (error: any) {
      console.error('Erreur paiement:', error);
      alert(error.response?.data?.message || 'Erreur lors de l\'initialisation du paiement');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleWhatsAppContact = () => {
    const creditsText = selectedPack ? `${selectedPack.credits}` : (amount || '...');
    const priceText = selectedPack ? ` (${selectedPack.price.toLocaleString()} FCFA)` : '';
    
    const message = `🪙 DEMANDE D'ACHAT DE CRÉDITS

Je souhaite acheter ${creditsText} crédits${priceText} pour booster mes annonces.

Merci de me recontacter pour organiser le paiement.`;

    const whatsappUrl = `https://wa.me/2250778030075?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowBuyModal(false);
    setSelectedPack(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon Wallet</h1>

          {/* Solde du Wallet */}
          <div className="card p-8 mb-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 mb-2">Solde disponible</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">{wallet?.balanceCredits || '0'}</span>
                  <span className="text-2xl ml-2">crédits</span>
                </div>
              </div>
              <Wallet className="w-20 h-20 text-primary-200 opacity-50" />
            </div>

            <button
              onClick={() => setShowBuyModal(true)}
              className="mt-6 bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Acheter des crédits</span>
            </button>
          </div>

          {/* Info Box */}
          <div className="card p-4 mb-8 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ À propos des crédits</h3>
            <p className="text-sm text-blue-800">
              Les crédits vous permettent d'acheter des packs de boost pour mettre en avant vos annonces.
              Pour acheter des crédits, contactez-nous via WhatsApp. Le paiement se fait par Orange Money, Wave, MTN Money ou Moov Money.
            </p>
          </div>

          {/* Historique des Transactions */}
          <div className="card">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Clock className="w-6 h-6 mr-2" />
                Historique des transactions
              </h2>
            </div>

            <div className="overflow-x-auto">
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Aucune transaction pour le moment</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Motif
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(transaction.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {transaction.type === 'CREDIT' ? (
                            <span className="flex items-center text-green-600">
                              <ArrowUpCircle className="w-5 h-5 mr-2" />
                              Crédit
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <ArrowDownCircle className="w-5 h-5 mr-2" />
                              Débit
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-bold ${
                            transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'CREDIT' ? '+' : '-'}{transaction.amount} crédits
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {transaction.reason || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal d'achat de crédits */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              💰 Acheter des crédits
            </h2>

            <p className="text-gray-600 mb-6">
              Choisissez un pack et payez directement en ligne ou contactez l'admin via WhatsApp.
            </p>

            {/* Packs de crédits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {creditPacks.map((pack) => (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPack(pack)}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-lg ${
                    selectedPack?.id === pack.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        ⭐ Populaire
                      </span>
                    </div>
                  )}
                  <div className={`bg-gradient-to-br ${pack.color} text-white rounded-lg p-3 mb-3`}>
                    <div className="text-3xl font-bold">{pack.credits}</div>
                    <div className="text-sm opacity-90">crédits</div>
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">{pack.name}</div>
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {pack.price.toLocaleString()} <span className="text-sm">FCFA</span>
                  </div>
                  <div className="text-xs text-gray-600">{pack.description}</div>
                </div>
              ))}
            </div>

            {selectedPack && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-blue-900">{selectedPack.name}</div>
                    <div className="text-sm text-blue-700">
                      {selectedPack.credits} crédits = {selectedPack.price.toLocaleString()} FCFA
                    </div>
                  </div>
                  <div className="text-sm text-blue-600">
                    {(selectedPack.price / selectedPack.credits).toFixed(0)} FCFA/crédit
                  </div>
                </div>
              </div>
            )}

            {/* Moyens de paiement disponibles */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">💳 Paiements acceptés</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-green-800">
                  <span className="mr-2">🧡</span> Orange Money
                </div>
                <div className="flex items-center text-green-800">
                  <span className="mr-2">💙</span> Wave
                </div>
                <div className="flex items-center text-green-800">
                  <span className="mr-2">💛</span> MTN Money
                </div>
                <div className="flex items-center text-green-800">
                  <span className="mr-2">💜</span> Moov Money
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              {/* Bouton Payer maintenant (Moneroo) */}
              {selectedPack && (
                <button
                  onClick={() => handlePayNow(selectedPack)}
                  disabled={paymentProcessing}
                  className="w-full btn-primary bg-primary-600 hover:bg-primary-700 flex items-center justify-center space-x-2 text-lg py-4"
                >
                  {paymentProcessing ? (
                    <span>Chargement...</span>
                  ) : (
                    <>
                      <span className="text-2xl">💳</span>
                      <span>Payer {selectedPack.price.toLocaleString()} FCFA maintenant</span>
                    </>
                  )}
                </button>
              )}

              {/* Bouton WhatsApp (option alternative) */}
              <button
                onClick={handleWhatsAppContact}
                disabled={!selectedPack && !amount}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Ou contacter l'admin via WhatsApp</span>
              </button>

              {/* Bouton Annuler */}
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setSelectedPack(null);
                  setAmount('');
                }}
                className="w-full btn-outline"
              >
                Annuler
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              🔒 Paiement sécurisé par Moneroo • WhatsApp : +225 07 78 03 00 75
            </p>
          </div>
        </div>
      )}
    </div>
  );
}





