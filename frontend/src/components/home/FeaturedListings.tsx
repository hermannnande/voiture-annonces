'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ListingCard from '@/components/listings/ListingCard';

export default function FeaturedListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/listings', {
          params: {
            limit: 6,
            sortBy: 'createdAt',
            sortOrder: 'desc',
          },
        });
        
        // Filtrer les annonces sponsorisées
        const featured = response.data.listings.filter((l: any) => l.isSponsored);
        setListings(featured.slice(0, 4));
      } catch (error) {
        console.error('Erreur lors du chargement des annonces premium:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-4 skeleton h-80"></div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>Aucune annonce premium pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {listings.map((listing: any) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}





