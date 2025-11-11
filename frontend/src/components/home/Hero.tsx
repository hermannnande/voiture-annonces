'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/listings');
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800 text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative container-custom py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Trouvez le véhicule de vos rêves
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Des milliers d'annonces vérifiées en Côte d'Ivoire
          </p>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-lg shadow-xl p-2">
              <input
                type="text"
                placeholder="Rechercher une marque, modèle, catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
            </div>
          </form>

          {/* Filtres rapides */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <a
              href="/listings?state=NEUF"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors border border-white/20"
            >
              Véhicules Neufs
            </a>
            <a
              href="/listings?state=OCCASION"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors border border-white/20"
            >
              Occasions
            </a>
            <a
              href="/listings?category=suv"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors border border-white/20"
            >
              SUV
            </a>
            <a
              href="/listings?category=berlines"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors border border-white/20"
            >
              Berlines
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}





