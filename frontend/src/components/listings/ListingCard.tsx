import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Fuel, Calendar, Gauge, Rocket } from 'lucide-react';
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
      <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-36 sm:h-44 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Icône favoris - Style affiche */}
          <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          {/* Badge État - Coins supérieurs */}
          <div className="absolute top-2 left-2">
            {isBoosted && (
              <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full shadow-lg font-bold flex items-center space-x-1">
                <Rocket className="w-3 h-3" />
                <span>Boost</span>
              </span>
            )}
          </div>
        </div>

        {/* Contenu - Style affiche */}
        <div className="p-3 sm:p-4">
          {/* Titre - Plus grand et bold */}
          <h3 className="font-bold text-sm sm:text-base text-navy-900 mb-1 line-clamp-2 group-hover:text-accent-600 transition-colors min-h-[2.5rem]">
            {listing.title}
          </h3>

          {/* Année - Style affiche */}
          <p className="text-xs text-gray-500 mb-2">{listing.year}</p>

          {/* Prix - Plus visible, style affiche */}
          <div className="mb-3">
            <span className="text-lg sm:text-xl font-bold text-navy-900">{formatPrice(listing.priceFcfa)}</span>
            <span className="text-sm text-gray-600 ml-1">XOF</span>
          </div>

          {/* Localisation - Style affiche */}
          <div className="flex items-center text-xs text-gray-600 border-t border-gray-100 pt-2">
            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-gray-400" />
            <span className="truncate">{listing.locationCity}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}


