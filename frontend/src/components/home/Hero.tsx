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
    <div className="relative bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white overflow-hidden">
      {/* Effet de grille futuriste en arrière-plan */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a5f_1px,transparent_1px),linear-gradient(to_bottom,#1e3a5f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/50 to-navy-950"></div>
      
      <div className="relative container-custom py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Titre principal - Style affiche */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-balance leading-tight">
            Vends ta voiture<br />
            <span className="text-accent-400">en quelques clics !</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            La plateforme auto des particuliers & car dealers en Côte d'Ivoire
          </p>

          {/* Barre de recherche - Style moderne */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-white rounded-xl shadow-2xl p-2 hover:shadow-accent-500/20 transition-shadow">
              <input
                type="text"
                placeholder="Rechercher annonce/marque/modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-900 focus:outline-none rounded-lg"
              />
              <button
                type="submit"
                className="bg-accent-500 text-white px-6 py-3 rounded-lg hover:bg-accent-600 transition-all flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
            </div>
          </form>

          {/* Points clés - Style affiche */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-8 text-sm md:text-base">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Particuliers & professionnels</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Publie ton annonce en 2 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Des milliers d'acheteurs partout en Côte d'Ivoire</span>
            </div>
          </div>

          {/* CTA Principal - Style affiche */}
          <a
            href="/auth/register"
            className="inline-block bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-accent-500/50 transition-all transform hover:scale-105"
          >
            📱 Déposer mon annonce maintenant
          </a>

          <p className="mt-4 text-sm text-gray-400">
            📱 Rendez-vous sur : <span className="text-accent-400 font-semibold">www.annonceauto.ci</span>
          </p>
        </div>
      </div>
    </div>
  );
}





