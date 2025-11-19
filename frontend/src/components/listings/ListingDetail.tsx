'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  MapPin, Calendar, Fuel, Gauge, Cog, Palette, 
  Phone, MessageCircle, Share2, Heart 
} from 'lucide-react';
import { formatPrice, formatDate, getWhatsAppLink, getPhoneLink } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';

interface ListingDetailProps {
  listing: any;
}

export default function ListingDetail({ listing }: ListingDetailProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [contactingViaMessage, setContactingViaMessage] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const characteristics = [
    { label: 'Marque', value: listing.brand.name, icon: Cog },
    { label: 'Modèle', value: listing.model?.name || '-', icon: Cog },
    { label: 'Année', value: listing.year, icon: Calendar },
    { label: 'Kilométrage', value: `${formatPrice(listing.mileageKm)} km`, icon: Gauge },
    { label: 'Carburant', value: listing.fuel, icon: Fuel },
    { label: 'Boîte', value: listing.gearbox === 'MANUELLE' ? 'Manuelle' : 'Automatique', icon: Cog },
    { label: 'Couleur', value: listing.color, icon: Palette },
    { label: 'Portes', value: listing.doors || '-', icon: Cog },
    { label: 'Puissance', value: listing.powerCv ? `${listing.powerCv} CV` : '-', icon: Cog },
    { label: 'État', value: listing.state === 'NEUF' ? 'Neuf' : 'Occasion', icon: Cog },
  ];

  const handleContactWhatsApp = () => {
    const message = `Bonjour, je suis intéressé(e) par votre annonce : ${listing.title}`;
    window.open(getWhatsAppLink(listing.user.phone, message), '_blank');
  };

  const handleContactPhone = () => {
    window.location.href = getPhoneLink(listing.user.phone);
  };

  const handleContactMessage = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/listings/${listing.id}`);
      return;
    }

    setContactingViaMessage(true);
    try {
      // Créer ou obtenir la conversation avec un message par défaut
      const defaultMessage = `Bonjour, je suis intéressé(e) par votre annonce "${listing.title}". Est-elle toujours disponible ?`;
      
      const response = await api.post('/messages/threads', {
        listingId: listing.id,
        message: defaultMessage,
      });
      
      // Rediriger vers la page de messages avec le thread créé
      router.push(`/dashboard/messages?thread=${response.data.id}`);
    } catch (error: any) {
      console.error('Erreur lors de la création de la conversation:', error);
      alert('Erreur lors de l\'ouverture de la messagerie. Veuillez réessayer.');
    } finally {
      setContactingViaMessage(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Galerie d'images */}
          <div className="card overflow-hidden">
            {/* Image principale */}
            <div className="relative h-96 bg-gray-200">
              {listing.images && listing.images.length > 0 ? (
                <Image
                  src={getImageUrl(listing.images[selectedImage]?.url)}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Aucune image
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {listing.isSponsored && (
                  <span className="badge-primary px-3 py-1">⭐ Premium</span>
                )}
                <span className={`badge ${listing.state === 'NEUF' ? 'badge-success' : 'badge-info'} px-3 py-1`}>
                  {listing.state === 'NEUF' ? 'Neuf' : 'Occasion'}
                </span>
              </div>
            </div>

            {/* Miniatures */}
            {listing.images && listing.images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {listing.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary-600 scale-105' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={getImageUrl(image.url)}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Titre et prix */}
          <div className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="flex items-baseline space-x-2 mb-4">
              <span className="text-4xl font-bold text-primary-600">
                {formatPrice(listing.priceFcfa)}
              </span>
              <span className="text-xl text-gray-600">FCFA</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{listing.locationCity}, {listing.locationCountry}</span>
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Caractéristiques */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Caractéristiques</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {characteristics.map((char, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <char.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{char.label}</p>
                    <p className="font-semibold text-gray-900">{char.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="card p-6 bg-gray-50">
            <p className="text-sm text-gray-600">
              Annonce publiée le {formatDate(listing.createdAt)} • {listing.viewCount} vues
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20 space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Contacter le vendeur</h3>
            
            <div className="space-y-3">
              {listing.user.phone && (
                <>
                  <button
                    onClick={handleContactWhatsApp}
                    className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleContactPhone}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Appeler</span>
                  </button>
                </>
              )}

              <button
                onClick={handleContactMessage}
                disabled={contactingViaMessage}
                className="w-full flex items-center justify-center space-x-2 btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {contactingViaMessage ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    <span>Ouverture...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>Message</span>
                  </>
                )}
              </button>

              <button className="w-full flex items-center justify-center space-x-2 btn-secondary">
                <Share2 className="w-5 h-5" />
                <span>Partager</span>
              </button>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">
                    {listing.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{listing.user.name}</p>
                  <p className="text-sm text-gray-600">Vendeur</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t text-sm text-gray-600">
              <p className="flex items-start space-x-2">
                <span>⚠️</span>
                <span>
                  Ne payez jamais à l'avance. Vérifiez toujours le véhicule avant tout paiement.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

