'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ListingCard from './ListingCard';

export default function ListingsGrid() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params: any = {};
        
        // Extraire tous les paramètres de recherche
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        const response = await api.get('/listings', { params });
        setListings(response.data.listings);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Erreur lors du chargement des annonces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card p-4 skeleton h-80"></div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-gray-600 mb-4">
          Aucune annonce ne correspond à vos critères
        </p>
        <a href="/listings" className="btn-primary">
          Voir toutes les annonces
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Résultats */}
      <div className="mb-4 text-sm text-gray-600">
        {pagination && (
          <p>
            {pagination.total} annonce{pagination.total > 1 ? 's' : ''} trouvée{pagination.total > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing: any) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <a
              key={page}
              href={`?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: page.toString() })}`}
              className={`px-4 py-2 rounded-lg ${
                page === pagination.page
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </a>
          ))}
        </div>
      )}
    </>
  );
}





