'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { TrendingUp, Zap, Star, Crown } from 'lucide-react';

export default function BoostsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [myBoosts, setMyBoosts] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchData();
  }, [isAuthenticated, router]);

  const fetchData = async () => {
    try {
      const [productsRes, boostsRes, listingsRes] = await Promise.all([
        api.get('/boosts/products'),
        api.get('/boosts/my-boosts'),
        api.get('/listings', { params: { status: 'APPROUVEE' } }),
      ]);

      setProducts(productsRes.data);
      setMyBoosts(boostsRes.data);
      setMyListings(listingsRes.data.listings);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (productId: number) => {
    if (!selectedListing) {
      alert('Veuillez sélectionner une annonce');
      return;
    }

    if (!confirm('Confirmer l\'achat de ce boost ?')) {
      return;
    }

    try {
      await api.post('/boosts/purchase', {
        listingId: selectedListing,
        boostProductId: productId,
        paymentProvider: 'mock',
      });

      alert('✅ Boost acheté avec succès ! Votre annonce bénéficie maintenant d\'une visibilité accrue.');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de l\'achat du boost');
    }
  };

  const getIcon = (priority: number) => {
    if (priority >= 20) return Crown;
    if (priority >= 10) return Star;
    return TrendingUp;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booster mes annonces
            </h1>
            <p className="text-gray-600">
              Augmentez la visibilité de vos annonces et vendez plus rapidement
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {/* Sélection de l'annonce */}
              <div className="card p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  1. Sélectionnez l'annonce à booster
                </h2>
                {myListings.length === 0 ? (
                  <p className="text-gray-600">
                    Vous n'avez pas encore d'annonces approuvées.
                  </p>
                ) : (
                  <select
                    value={selectedListing}
                    onChange={(e) => setSelectedListing(e.target.value)}
                    className="input"
                  >
                    <option value="">Choisissez une annonce</option>
                    {myListings.map((listing: any) => (
                      <option key={listing.id} value={listing.id}>
                        {listing.title} - {formatPrice(listing.priceFcfa)} FCFA
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Produits de boost */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  2. Choisissez un pack de boost
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product: any) => {
                    const Icon = getIcon(product.priority);
                    const isPopular = product.priority >= 15;

                    return (
                      <div
                        key={product.id}
                        className={`card p-6 relative ${
                          isPopular ? 'border-2 border-primary-500 shadow-lg' : ''
                        }`}
                      >
                        {isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                              POPULAIRE
                            </span>
                          </div>
                        )}

                        <div className="flex justify-center mb-4">
                          <div className={`p-4 rounded-full ${
                            product.priority >= 20 ? 'bg-yellow-100' :
                            product.priority >= 10 ? 'bg-purple-100' :
                            'bg-blue-100'
                          }`}>
                            <Icon className={`w-8 h-8 ${
                              product.priority >= 20 ? 'text-yellow-600' :
                              product.priority >= 10 ? 'text-purple-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-600 text-center mb-4 min-h-[60px]">
                          {product.description}
                        </p>

                        <div className="text-center mb-4">
                          <p className="text-3xl font-bold text-primary-600">
                            {formatPrice(product.priceFcfa)}
                          </p>
                          <p className="text-sm text-gray-600">FCFA</p>
                        </div>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-sm text-gray-700">
                            <Zap className="w-4 h-4 mr-2 text-primary-600" />
                            <span>Durée: {product.durationDays} jours</span>
                          </div>
                          {product.features && (
                            <>
                              {product.features.topListing && (
                                <div className="flex items-center text-sm text-gray-700">
                                  <TrendingUp className="w-4 h-4 mr-2 text-primary-600" />
                                  <span>Top de liste</span>
                                </div>
                              )}
                              {product.features.homepage && (
                                <div className="flex items-center text-sm text-gray-700">
                                  <Star className="w-4 h-4 mr-2 text-primary-600" />
                                  <span>Page d'accueil</span>
                                </div>
                              )}
                              {product.features.badge && (
                                <div className="flex items-center text-sm text-gray-700">
                                  <Crown className="w-4 h-4 mr-2 text-primary-600" />
                                  <span>Badge Premium</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => handlePurchase(product.id)}
                          disabled={!selectedListing}
                          className={`w-full ${
                            isPopular ? 'btn-primary' : 'btn-outline'
                          } ${!selectedListing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Choisir ce pack
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Historique des boosts */}
              {myBoosts.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Mes boosts actifs et passés
                  </h2>
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Annonce
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pack
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Début
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {myBoosts.map((boost: any) => {
                            const isActive = new Date(boost.endsAt) > new Date();

                            return (
                              <tr key={boost.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {boost.listing.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {boost.boostProduct.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {formatDate(boost.startsAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {formatDate(boost.endsAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                  {formatPrice(boost.paymentAmount)} FCFA
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`badge ${
                                      isActive ? 'badge-success' : 'badge bg-gray-500 text-white'
                                    }`}
                                  >
                                    {isActive ? 'Actif' : 'Expiré'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
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





