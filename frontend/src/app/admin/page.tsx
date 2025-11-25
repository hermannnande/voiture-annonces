'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import {
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Eye,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/moderation/pending', { params: { limit: 5 } }),
      ]);

      setStats(statsRes.data);
      setPendingListings(pendingRes.data.listings);
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
      fetchData();
    } catch (error) {
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Motif du refus (obligatoire):');
    if (!reason) return;

    try {
      await api.post(`/admin/moderation/${id}/reject`, { reason });
      alert('❌ Annonce refusée');
      fetchData();
    } catch (error) {
      alert('Erreur lors du refus');
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              👑 Dashboard Administrateur
            </h1>
            <p className="text-gray-600">
              Vue d'ensemble et gestion de la plateforme
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Statistiques */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Total Annonces</h3>
                      <Package className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.listings.total}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.listings.approved} en ligne
                    </p>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">En Attente</h3>
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{stats.listings.pending}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      À modérer
                    </p>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Vendus</h3>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{stats.listings.sold}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.listings.rejected} refusées
                    </p>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Revenus Boosts</h3>
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">
                      {formatPrice(stats.boosts.revenue)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.boosts.total} boosts
                    </p>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Utilisateurs</h3>
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{stats.users.total}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Inscrits
                    </p>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Temps d'Approbation</h3>
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.avgApprovalTime}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      minutes (moyenne)
                    </p>
                  </div>

                  <div className="md:col-span-2 card p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">Top Catégories</h3>
                    <div className="space-y-2">
                      {stats.topCategories.slice(0, 3).map((cat: any) => (
                        <div key={cat.id} className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">{cat.name}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {cat._count.listings} annonces
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions rapides */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link
                  href="/admin/moderation"
                  className="card p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Modération</h3>
                      <p className="text-sm text-gray-600">
                        {stats?.listings.pending || 0} en attente
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/users"
                  className="card p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Utilisateurs</h3>
                      <p className="text-sm text-gray-600">Gérer les comptes</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/wallets"
                  className="card p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                      <Wallet className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Wallets</h3>
                      <p className="text-sm text-gray-600">Crédits vendeurs</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/audit-logs"
                  className="card p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Eye className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Logs d'Audit</h3>
                      <p className="text-sm text-gray-600">Traçabilité</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Annonces en attente */}
              {pendingListings.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Annonces en attente de modération
                    </h2>
                    <Link href="/admin/moderation" className="text-primary-600 hover:text-primary-700 font-medium">
                      Voir toutes →
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {pendingListings.map((listing: any) => (
                      <div key={listing.id} className="card p-6">
                        <div className="flex flex-col md:flex-row gap-4">
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

                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {listing.title}
                            </h3>
                            <p className="text-lg font-bold text-primary-600 mb-2">
                              {formatPrice(listing.priceFcfa)} FCFA
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              Par {listing.user.name} • {formatDate(listing.createdAt)}
                            </p>
                            <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                              {listing.description}
                            </p>

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
                                className="btn-outline btn-sm"
                              >
                                Voir détails
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

