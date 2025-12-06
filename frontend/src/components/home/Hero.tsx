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
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      {/* Effet de grille futuriste en arrière-plan */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-800/30 to-blue-900/50"></div>
      
      <div className="relative container-custom py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Titre principal - Style affiche */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 md:mb-4 leading-tight px-2">
            Vends ta voiture<br />
            <span className="text-accent-400">en quelques clics !</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg mb-6 md:mb-8 text-gray-200 max-w-2xl mx-auto px-4">
            La plateforme auto des particuliers & car dealers en Côte d'Ivoire
          </p>

          {/* Barre de recherche - Style moderne */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6 md:mb-8 px-2">
            <div className="flex items-center bg-white rounded-xl shadow-2xl p-1.5 md:p-2 hover:shadow-accent-500/20 transition-shadow">
              <input
                type="text"
                placeholder="Rechercher annonce/marque/modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 focus:outline-none rounded-lg"
              />
              <button
                type="submit"
                className="bg-accent-500 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-accent-600 transition-all flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl flex-shrink-0"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline text-sm md:text-base">Rechercher</span>
              </button>
            </div>
          </form>

          {/* Points clés - Style affiche */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5 mb-6 md:mb-8 text-xs sm:text-sm md:text-base px-4">
            <div className="flex items-center space-x-1.5">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-accent-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Particuliers & professionnels</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-accent-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Publie ton annonce en 2 minutes</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-accent-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Des milliers d'acheteurs en CI</span>
            </div>
          </div>

          {/* CTA Principal - Style affiche */}
          <a
            href="/auth/register"
            className="inline-block bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white text-sm sm:text-base md:text-lg font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-2xl hover:shadow-accent-500/50 transition-all transform hover:scale-105 mx-2"
          >
            📱 Déposer mon annonce maintenant
          </a>
        </div>
      </div>
    </div>
  );
}





