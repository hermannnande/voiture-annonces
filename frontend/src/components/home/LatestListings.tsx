'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ListingCard from '@/components/listings/ListingCard';

export default function LatestListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await api.get('/listings', {
          params: {
            limit: 8,
            sortBy: 'createdAt',
            sortOrder: 'desc',
          },
        });
        setListings(response.data.listings);
      } catch (error) {
        console.error('Erreur lors du chargement des dernières annonces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 skeleton h-64 sm:h-72"></div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <p>Aucune annonce disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
      {listings.map((listing: any) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}





