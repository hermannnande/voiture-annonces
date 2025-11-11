'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { Search, Plus, Minus, Wallet } from 'lucide-react';

export default function AdminWalletsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'credit' | 'debit'>('credit');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchWallets();
  }, [isAuthenticated, user, router]);

  const fetchWallets = async () => {
    try {
      const response = await api.get('/wallet/admin/all', {
        params: { query: searchQuery, limit: 100 },
      });
      setWallets(response.data.wallets || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (userId: string, type: 'credit' | 'debit') => {
    setSelectedUserId(userId);
    setModalType(type);
    setAmount('');
    setReason('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!amount || !reason) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setProcessing(true);
    try {
      const endpoint = `/wallet/admin/${selectedUserId}/${modalType}`;
      await api.post(endpoint, { amount, reason });
      
      alert(`✅ Wallet ${modalType === 'credit' ? 'crédité' : 'débité'} avec succès`);
      setShowModal(false);
      fetchWallets();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de l\'opération');
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Wallets</h1>
          </div>

          {/* Recherche */}
          <div className="card p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchWallets()}
                  className="input pl-10"
                />
              </div>
              <button onClick={fetchWallets} className="btn-primary">
                Rechercher
              </button>
            </div>
          </div>

          {/* Liste des wallets */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Solde
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Transactions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wallets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          Aucun wallet trouvé
                        </td>
                      </tr>
                    ) : (
                      wallets.map((wallet) => (
                        <tr key={wallet.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-bold">
                                  {wallet.user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {wallet.user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {wallet.user.role}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {wallet.user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Wallet className="w-5 h-5 mr-2 text-primary-600" />
                              <span className="text-lg font-bold text-gray-900">
                                {wallet.balanceCredits}
                              </span>
                              <span className="text-sm text-gray-600 ml-1">crédits</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {wallet._count?.transactions || 0} transactions
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => handleOpenModal(wallet.userId, 'credit')}
                              className="btn-sm bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1"
                              title="Créditer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Créditer</span>
                            </button>
                            <button
                              onClick={() => handleOpenModal(wallet.userId, 'debit')}
                              className="btn-sm bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1"
                              title="Débiter"
                            >
                              <Minus className="w-4 h-4" />
                              <span>Débiter</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal Créditer/Débiter */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {modalType === 'credit' ? 'Créditer' : 'Débiter'} le wallet
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Montant (en crédits) *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 100"
                  className="input"
                  min="1"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Motif * 
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Recharge suite paiement Orange Money"
                  className="input"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={processing}
                className="flex-1 btn-outline"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={processing}
                className={`flex-1 ${
                  modalType === 'credit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                } text-white px-4 py-2 rounded-lg font-semibold`}
              >
                {processing ? 'En cours...' : modalType === 'credit' ? 'Créditer' : 'Débiter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





