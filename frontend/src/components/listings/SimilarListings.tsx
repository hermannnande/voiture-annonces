'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Calendar, Gauge } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';

interface SimilarListingsProps {
  listingId: string;
}

export default function SimilarListings({ listingId }: SimilarListingsProps) {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarListings = async () => {
      try {
        const response = await api.get(`/listings/${listingId}/similar`);
        setListings(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des annonces similaires:', error);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchSimilarListings();
    }
  }, [listingId]);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Annonces similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Annonces similaires
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {listings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => router.push(`/listings/${listing.id}`)}
              className="card overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <Image
                    src={getImageUrl(listing.images[0]?.url)}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Aucune image
                  </div>
                )}
                
                {/* Badge Premium */}
                {listing.isSponsored && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    ⭐ Premium
                  </span>
                )}
                
                {/* Badge État */}
                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full shadow ${
                    listing.state === 'NEUF'
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {listing.state === 'NEUF' ? 'Neuf' : 'Occasion'}
                </span>
              </div>

              {/* Contenu */}
              <div className="p-4">
                {/* Titre */}
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {listing.title}
                </h3>

                {/* Prix */}
                <div className="mb-3">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(listing.priceFcfa)}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">FCFA</span>
                </div>

                {/* Informations */}
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{listing.locationCity}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{listing.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Gauge className="w-4 h-4 text-gray-400" />
                      <span>{formatPrice(listing.mileageKm)} km</span>
                    </div>
                  </div>
                </div>

                {/* Marque et carburant */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span className="font-medium">{listing.brand.name}</span>
                  <span>{listing.fuel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

