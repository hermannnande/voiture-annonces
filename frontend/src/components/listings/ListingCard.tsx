import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Fuel, Calendar, Gauge, Pin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    priceFcfa: string;
    year: number;
    mileageKm: number;
    fuel: string;
    state: string;
    locationCity: string;
    isSponsored: boolean;
    images: Array<{ url: string }>;
    brand: { name: string };
    boosts?: Array<{
      startsAt: string;
      endsAt: string;
      boostProduct: {
        name: string;
        priority: number;
      };
    }>;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = getImageUrl(listing.images?.[0]?.url);
  
  // Vérifier si l'annonce a un boost actif
  const now = new Date();
  const activeBoost = listing.boosts?.find((boost) => {
    const startsAt = new Date(boost.startsAt);
    const endsAt = new Date(boost.endsAt);
    return startsAt <= now && endsAt >= now;
  });
  
  const isBoosted = !!activeBoost;

  return (
    <Link href={`/listings/${listing.id}`} className="group">
      <div className="card-hover overflow-hidden">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {isBoosted && (
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-bold flex items-center space-x-1 animate-pulse">
                <Pin className="w-3 h-3" />
                <span>📌 Épinglé</span>
              </span>
            )}
            {listing.isSponsored && !isBoosted && (
              <span className="badge-primary text-xs px-2 py-1">
                ⭐ Premium
              </span>
            )}
            <span className={`badge ${listing.state === 'NEUF' ? 'badge-success' : 'badge-info'} text-xs px-2 py-1`}>
              {listing.state === 'NEUF' ? 'Neuf' : 'Occasion'}
            </span>
          </div>

          {/* Prix */}
          <div className="absolute bottom-2 left-2 bg-white px-3 py-1 rounded-lg shadow-md">
            <span className="font-bold text-primary-600">{formatPrice(listing.priceFcfa)} FCFA</span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {listing.title}
          </h3>

          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{listing.locationCity}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{listing.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Gauge className="w-3 h-3" />
              <span>{formatPrice(listing.mileageKm)} km</span>
            </div>
            <div className="flex items-center space-x-1">
              <Fuel className="w-3 h-3" />
              <span>{listing.fuel}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}


