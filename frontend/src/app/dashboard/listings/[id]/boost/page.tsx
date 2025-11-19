'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { TrendingUp, Zap, Star, Crown, ArrowLeft, Wallet, CreditCard, Check, X } from 'lucide-react';
import Link from 'next/link';

export default function BoostListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id as string;
  const { isAuthenticated } = useAuthStore();
  
  const [products, setProducts] = useState([]);
  const [listing, setListing] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credits' | 'whatsapp'>('credits');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    fetchData();
  }, [isAuthenticated, router, listingId]);

  const fetchData = async () => {
    try {
      const [productsRes, listingRes, walletRes] = await Promise.all([
        api.get('/boosts/products'),
        api.get(`/listings/${listingId}`),
        api.get('/wallet/me'),
      ]);

      setProducts(productsRes.data);
      setListing(listingRes.data);
      setWallet(walletRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      alert('Erreur lors du chargement des données');
      router.push('/dashboard/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    // Déterminer la méthode de paiement par défaut selon le solde
    const hasEnoughCredits = wallet && parseInt(wallet.balanceCredits) >= parseInt(product.creditsCost);
    setPaymentMethod(hasEnoughCredits ? 'credits' : 'whatsapp');
  };

  const handlePurchaseWithCredits = async () => {
    if (!selectedProduct) return;

    const hasEnoughCredits = wallet && parseInt(wallet.balanceCredits) >= parseInt(selectedProduct.creditsCost);
    if (!hasEnoughCredits) {
      alert('Crédits insuffisants. Veuillez acheter des crédits ou payer via WhatsApp.');
      return;
    }

    setPurchasing(true);
    try {
      await api.post('/boosts/purchase-with-credits', {
        listingId,
        boostProductId: selectedProduct.id,
      });

      alert(`✅ Boost activé avec succès ! Votre annonce sera épinglée en tête de liste pendant ${selectedProduct.durationDays} jour(s).`);
      router.push('/dashboard/listings');
    } catch (error: any) {
      console.error('Erreur lors de l\'achat:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de l\'achat du boost';
      alert(errorMsg);
    } finally {
      setPurchasing(false);
    }
  };

  const handlePurchaseWithWhatsApp = () => {
    if (!selectedProduct) return;

    // Message WhatsApp détaillé
    const message = `🚗 DEMANDE DE BOOST D'ANNONCE

📦 Pack choisi: ${selectedProduct.name}
💰 Prix: ${formatPrice(selectedProduct.priceFcfa)} FCFA
⏱️ Durée: ${selectedProduct.durationDays} jour(s)

📢 Mon annonce:
"${listing?.title}"

Prix de l'annonce: ${formatPrice(listing?.priceFcfa)} FCFA

Je souhaite promouvoir cette annonce. Merci de me contacter pour finaliser le paiement.`;

    const whatsappUrl = `https://wa.me/2250778030075?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setSelectedProduct(null);
  };

  const handleConfirmPurchase = () => {
    if (paymentMethod === 'credits') {
      handlePurchaseWithCredits();
    } else {
      handlePurchaseWithWhatsApp();
    }
  };

  const getIcon = (priority: number) => {
    if (priority >= 15) return Crown;
    if (priority >= 10) return Star;
    return TrendingUp;
  };

  if (!isAuthenticated) {
    return null;
  }

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
          <Link
            href="/dashboard/listings"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à mes annonces
          </Link>

          {/* Solde de crédits */}
          {wallet && (
            <div className="card p-4 mb-6 bg-gradient-to-r from-primary-600 to-primary-700">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Solde de crédits disponible</p>
                    <p className="text-2xl font-bold">{wallet.balanceCredits} crédits</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/wallet"
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Voir mon wallet
                </Link>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booster votre annonce
            </h1>
            <p className="text-gray-600 mb-4">
              Augmentez la visibilité de votre annonce et vendez plus rapidement
            </p>
            
            {/* Instructions */}
            <div className="card p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">⚡ Comment ça marche ?</h3>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li><span className="font-bold">1.</span> Choisissez le pack qui vous convient</li>
                    <li><span className="font-bold">2.</span> Payez avec vos crédits OU via WhatsApp (Orange Money, Wave, MTN, Moov)</li>
                    <li><span className="font-bold">3.</span> Votre annonce est épinglée en tête de liste immédiatement ! ✅</li>
                  </ol>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-300">
                    <p className="text-sm font-semibold text-blue-900">
                      💳 Paiement WhatsApp: <span className="text-blue-700">+225 07 78 03 00 75</span>
                    </p>
                    <p className="text-sm font-semibold text-blue-900">
                      💰 Ou utilisez vos crédits
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aperçu de l'annonce */}
          {listing && (
            <div className="card p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Annonce sélectionnée
              </h2>
              <div className="flex items-center space-x-4">
                {listing.images?.[0]?.url && (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{listing.title}</h3>
                  <p className="text-xl font-bold text-primary-600 mt-1">
                    {formatPrice(listing.priceFcfa)} FCFA
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {listing.brand?.name} {listing.model?.name} • {listing.year}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Produits de boost */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Choisissez un pack de boost
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => {
                const Icon = getIcon(product.priority);
                const isPopular = product.priceFcfa === 2000; // Le pack à 2000 FCFA est populaire

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
                            product.priority >= 15 ? 'bg-yellow-100' :
                            product.priority >= 10 ? 'bg-purple-100' :
                            'bg-blue-100'
                          }`}>
                            <Icon className={`w-8 h-8 ${
                              product.priority >= 15 ? 'text-yellow-600' :
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
                      <div className="flex items-center justify-center space-x-4">
                        <div>
                          <p className="text-2xl font-bold text-primary-600">
                            {formatPrice(product.priceFcfa)}
                          </p>
                          <p className="text-xs text-gray-600">FCFA</p>
                        </div>
                        <div className="text-gray-400">OU</div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {product.creditsCost}
                          </p>
                          <p className="text-xs text-gray-600">crédits</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-700">
                        <Zap className="w-4 h-4 mr-2 text-primary-600" />
                        <span>Durée: {product.durationDays} jour{product.durationDays > 1 ? 's' : ''}</span>
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
                      onClick={() => handleSelectProduct(product)}
                      className={`w-full ${
                        isPopular ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      Choisir ce pack
                    </button>
                    
                    {/* Indicateur de crédits suffisants */}
                    {wallet && parseInt(wallet.balanceCredits) >= parseInt(product.creditsCost) && (
                      <p className="text-xs text-center text-green-600 mt-2 font-medium">
                        ✅ Vous avez assez de crédits
                      </p>
                    )}
                    {wallet && parseInt(wallet.balanceCredits) < parseInt(product.creditsCost) && (
                      <p className="text-xs text-center text-orange-600 mt-2 font-medium">
                        ⚠️ Crédits insuffisants (paiement WhatsApp disponible)
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Avantages */}
          <div className="card p-6 mt-8 bg-primary-50 border-primary-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              ⚡ Pourquoi booster votre annonce ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📈 Plus de visibilité</h4>
                <p className="text-sm text-gray-600">
                  Votre annonce apparaît en premier dans les résultats de recherche
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🚀 Vente plus rapide</h4>
                <p className="text-sm text-gray-600">
                  Recevez jusqu'à 5x plus de contacts et messages
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">⭐ Badge Premium</h4>
                <p className="text-sm text-gray-600">
                  Mettez en valeur votre annonce avec un badge spécial
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de confirmation de paiement */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Confirmer le boost
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Résumé du produit */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedProduct.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{selectedProduct.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Durée:</span>
                <span className="font-semibold">{selectedProduct.durationDays} jour{selectedProduct.durationDays > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Choix du mode de paiement */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choisissez votre mode de paiement
              </label>
              <div className="space-y-3">
                {/* Option Crédits */}
                <button
                  onClick={() => setPaymentMethod('credits')}
                  disabled={wallet && parseInt(wallet.balanceCredits) < parseInt(selectedProduct.creditsCost)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'credits'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    wallet && parseInt(wallet.balanceCredits) < parseInt(selectedProduct.creditsCost)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        paymentMethod === 'credits' ? 'bg-green-600' : 'bg-gray-200'
                      }`}>
                        <Wallet className={`w-5 h-5 ${
                          paymentMethod === 'credits' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Payer avec mes crédits</p>
                        <p className="text-sm text-gray-600">
                          {wallet ? `Solde: ${wallet.balanceCredits} crédits` : 'Chargement...'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedProduct.creditsCost}
                      </p>
                      <p className="text-xs text-gray-600">crédits</p>
                    </div>
                  </div>
                  {wallet && parseInt(wallet.balanceCredits) < parseInt(selectedProduct.creditsCost) && (
                    <p className="text-xs text-orange-600 mt-2">
                      ⚠️ Crédits insuffisants. Utilisez WhatsApp ou rechargez votre wallet.
                    </p>
                  )}
                </button>

                {/* Option WhatsApp */}
                <button
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        paymentMethod === 'whatsapp' ? 'bg-green-600' : 'bg-gray-200'
                      }`}>
                        <svg className={`w-5 h-5 ${
                          paymentMethod === 'whatsapp' ? 'text-white' : 'text-gray-600'
                        }`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Payer via WhatsApp</p>
                        <p className="text-sm text-gray-600">Orange Money, Wave, MTN, Moov</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {formatPrice(selectedProduct.priceFcfa)}
                      </p>
                      <p className="text-xs text-gray-600">FCFA</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 btn-secondary"
                disabled={purchasing}
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={purchasing || (paymentMethod === 'credits' && wallet && parseInt(wallet.balanceCredits) < parseInt(selectedProduct.creditsCost))}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                {purchasing ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{paymentMethod === 'credits' ? 'Acheter avec crédits' : 'Contacter sur WhatsApp'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

