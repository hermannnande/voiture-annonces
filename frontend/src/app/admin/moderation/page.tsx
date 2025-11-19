'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { CheckCircle, XCircle, Eye, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ModerationPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchPendingListings();
  }, [isAuthenticated, user, router]);

  const fetchPendingListings = async () => {
    try {
      const response = await api.get('/admin/moderation/pending');
      setListings(response.data.listings || response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approuver cette annonce ?')) return;

    try {
      await api.post(`/admin/moderation/${id}/approve`);
      alert('✅ Annonce approuvée');
      fetchPendingListings();
    } catch (error) {
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Motif du refus (obligatoire):');
    if (!reason || !reason.trim()) {
      alert('Le motif du refus est obligatoire');
      return;
    }

    try {
      await api.post(`/admin/moderation/${id}/reject`, { reason });
      alert('❌ Annonce refusée');
      fetchPendingListings();
    } catch (error) {
      alert('Erreur lors du refus');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) {
      alert('Veuillez sélectionner au moins une annonce');
      return;
    }

    if (!confirm(`Approuver ${selectedIds.length} annonce(s) ?`)) return;

    try {
      await Promise.all(
        selectedIds.map(id => api.post(`/admin/moderation/${id}/approve`))
      );
      alert(`✅ ${selectedIds.length} annonce(s) approuvée(s)`);
      setSelectedIds([]);
      fetchPendingListings();
    } catch (error) {
      alert('Erreur lors de l\'approbation en masse');
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === listings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(listings.map((l: any) => l.id));
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Modération des annonces</h1>
              <p className="text-gray-600">
                {listings.length} annonce(s) en attente de validation
              </p>
            </div>
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkApprove}
                className="btn-primary flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Approuver la sélection ({selectedIds.length})</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="card p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Aucune annonce en attente
              </h2>
              <p className="text-gray-600">
                Toutes les annonces ont été modérées
              </p>
            </div>
          ) : (
            <>
              {/* Actions en masse */}
              <div className="card p-4 mb-6 flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === listings.length}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 text-primary-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Tout sélectionner
                  </span>
                </label>
                <div className="text-sm text-gray-600">
                  {selectedIds.length} annonce(s) sélectionnée(s)
                </div>
              </div>

              {/* Liste des annonces */}
              <div className="space-y-6">
                {listings.map((listing: any) => (
                  <div
                    key={listing.id}
                    className={`card p-6 ${
                      selectedIds.includes(listing.id) ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(listing.id)}
                        onChange={() => toggleSelection(listing.id)}
                        className="mt-1 w-5 h-5 text-primary-600 rounded"
                      />

                      {/* Image */}
                      <div className="w-48 h-36 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {listing.images?.[0]?.url ? (
                          <img
                            src={listing.images[0].url}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Pas d'image
                          </div>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {listing.title}
                            </h3>
                            <p className="text-2xl font-bold text-primary-600">
                              {formatPrice(listing.priceFcfa)} FCFA
                            </p>
                          </div>
                          <span className="badge badge-warning">En attente</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-600">Marque:</span>
                            <span className="ml-1 font-semibold">{listing.brand?.name}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Année:</span>
                            <span className="ml-1 font-semibold">{listing.year}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Kilométrage:</span>
                            <span className="ml-1 font-semibold">{listing.mileageKm} km</span>
                          </div>
                          <div>
                            <span className="text-gray-600">État:</span>
                            <span className="ml-1 font-semibold">
                              {listing.state === 'NEUF' ? 'Neuf' : 'Occasion'}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                          {listing.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span>Par {listing.user?.name}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(listing.createdAt)}</span>
                            <span className="mx-2">•</span>
                            <span>{listing.locationCity}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(listing.id)}
                              className="btn-sm bg-green-600 text-white hover:bg-green-700 flex items-center space-x-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Approuver</span>
                            </button>
                            <button
                              onClick={() => handleReject(listing.id)}
                              className="btn-sm bg-red-600 text-white hover:bg-red-700 flex items-center space-x-1"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Refuser</span>
                            </button>
                            <Link
                              href={`/listings/${listing.id}`}
                              target="_blank"
                              className="btn-outline btn-sm flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Voir</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}





