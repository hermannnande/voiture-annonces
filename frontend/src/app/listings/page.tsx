'use client';

import { Suspense, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingsGrid from '@/components/listings/ListingsGrid';
import ListingsFilters from '@/components/listings/ListingsFilters';

export default function ListingsPage() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-4 md:py-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Toutes les Annonces
            </h1>
            
            {/* Bouton Filtrer - Mobile uniquement */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden btn-primary flex items-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtrer
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filtres - Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
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

      {/* Drawer Filtres - Mobile */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowFilters(false)}
          ></div>
          
          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-sm">
              <div className="h-full flex flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="px-4 py-4 bg-primary-600 text-white flex items-center justify-between">
                  <h2 className="text-lg font-bold">Filtrer les annonces</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-white hover:text-primary-100"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                  <Suspense fallback={<div>Chargement...</div>}>
                    <ListingsFilters onClose={() => setShowFilters(false)} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}





