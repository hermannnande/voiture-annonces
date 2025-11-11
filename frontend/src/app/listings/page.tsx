'use client';

import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingsGrid from '@/components/listings/ListingsGrid';
import ListingsFilters from '@/components/listings/ListingsFilters';

export default function ListingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Toutes les Annonces
          </h1>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filtres */}
            <aside className="lg:col-span-1">
              <div className="card p-6 sticky top-20">
                <h2 className="font-bold text-lg mb-4">Filtrer</h2>
                <Suspense fallback={<div>Chargement...</div>}>
                  <ListingsFilters />
                </Suspense>
              </div>
            </aside>

            {/* Grille d'annonces */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div>Chargement...</div>}>
                <ListingsGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}





