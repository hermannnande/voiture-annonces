'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import { Plus, Eye, MessageSquare, Edit, Trash2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function MyListingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchListings();
  }, [isAuthenticated, router, filter]);

  const fetchListings = async () => {
    try {
      const params: any = { userId: user?.id };
      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await api.get('/listings', { params });
      setListings(response.data.listings);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    try {
      await api.delete(`/listings/${id}`);
      alert('Annonce supprimée avec succès');
      fetchListings();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleMarkSold = async (id: string) => {
    if (!confirm('Marquer cette annonce comme vendue ?')) {
      return;
    }

    try {
      await api.post(`/listings/${id}/mark-sold`);
      alert('Annonce marquée comme vendue');
      fetchListings();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      BROUILLON: 'badge-warning',
      EN_ATTENTE: 'badge-info',
      APPROUVEE: 'badge-success',
      REFUSEE: 'badge-error',
      VENDU: 'badge bg-gray-500 text-white',
    };

    const labels: any = {
      BROUILLON: 'Brouillon',
      EN_ATTENTE: 'En attente',
      APPROUVEE: 'En ligne',
      REFUSEE: 'Refusée',
      VENDU: 'Vendu',
    };

    return (
      <span className={badges[status] || 'badge'}>
        {labels[status] || status}
      </span>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes annonces</h1>
              <p className="text-gray-600">Gérez vos annonces</p>
            </div>
            <Link href="/dashboard/listings/create" className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Nouvelle annonce</span>
            </Link>
          </div>

          {/* Filtres */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('EN_ATTENTE')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'EN_ATTENTE' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('APPROUVEE')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'APPROUVEE' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              En ligne
            </button>
            <button
              onClick={() => setFilter('REFUSEE')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'REFUSEE' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Refusées
            </button>
            <button
              onClick={() => setFilter('VENDU')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'VENDU' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Vendues
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-600 mb-4">Aucune annonce trouvée</p>
              <Link href="/dashboard/listings/create" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Créer ma première annonce</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing: any) => (
                <div key={listing.id} className="card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="w-full md:w-48 h-36 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {listing.images?.[0]?.url ? (
                        <img
                          src={getImageUrl(listing.images[0].url)}
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
                        {getStatusBadge(listing.status)}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        Publié le {formatDate(listing.createdAt)}
                      </p>

                      {listing.status === 'REFUSEE' && listing.rejectionReason && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm font-medium text-red-900">Motif du refus:</p>
                          <p className="text-sm text-red-700">{listing.rejectionReason}</p>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{listing.viewCount || 0} vues</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>0 messages</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/listings/${listing.id}`}
                          className="btn-outline btn-sm"
                          target="_blank"
                        >
                          Voir l'annonce
                        </Link>

                        {listing.status === 'APPROUVEE' && (
                          <button
                            onClick={() => handleMarkSold(listing.id)}
                            className="btn-secondary btn-sm"
                          >
                            Marquer comme vendu
                          </button>
                        )}

                        <Link
                          href={`/dashboard/listings/${listing.id}/boost`}
                          className="btn-sm bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-1"
                        >
                          <TrendingUp className="w-4 h-4" />
                          <span>Booster</span>
                        </Link>

                        {listing.status !== 'VENDU' && (
                          <>
                            <Link
                              href={`/dashboard/listings/${listing.id}/edit`}
                              className="btn-secondary btn-sm flex items-center space-x-1"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Modifier</span>
                            </Link>

                            <button
                              onClick={() => handleDelete(listing.id)}
                              className="btn-sm bg-red-600 text-white hover:bg-red-700 flex items-center space-x-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Supprimer</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

