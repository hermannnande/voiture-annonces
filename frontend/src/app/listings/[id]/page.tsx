'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingDetail from '@/components/listings/ListingDetail';
import api from '@/lib/api';

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${params.id}`);
        setListing(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'annonce:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {loading ? (
          <div className="container-custom py-8">
            <div className="skeleton h-96 mb-4"></div>
            <div className="skeleton h-64"></div>
          </div>
        ) : error || !listing ? (
          <div className="container-custom py-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Annonce introuvable
            </h1>
            <a href="/listings" className="btn-primary">
              Retour aux annonces
            </a>
          </div>
        ) : (
          <ListingDetail listing={listing} />
        )}
      </main>

      <Footer />
    </div>
  );
}





