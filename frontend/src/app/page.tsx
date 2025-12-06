import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedListings from '@/components/home/FeaturedListings';
import LatestListings from '@/components/home/LatestListings';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-950">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        {/* Section Dernières Annonces */}
        <section className="py-12 bg-navy-950">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Dernières Annonces</h2>
              <a href="/listings" className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                Voir tout →
              </a>
            </div>
            <Suspense fallback={<div className="text-white">Chargement...</div>}>
              <LatestListings />
            </Suspense>
          </div>
        </section>

        {/* Section Annonces Premium */}
        <section className="py-12 bg-gradient-to-br from-navy-900 to-navy-800">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
                <span>⭐</span>
                <span>Annonces Premium</span>
              </h2>
            </div>
            <Suspense fallback={<div className="text-white">Chargement...</div>}>
              <FeaturedListings />
            </Suspense>
          </div>
        </section>

        {/* CTA Section - Style affiche */}
        <section className="py-16 bg-gradient-to-r from-accent-600 via-accent-500 to-accent-600 text-white relative overflow-hidden">
          {/* Effet de fond */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-pulse"></div>
          
          <div className="container-custom text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à vendre votre véhicule ?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Créez votre annonce en 2 minutes et touchez des milliers d'acheteurs potentiels partout en Côte d'Ivoire
            </p>
            <a
              href="/auth/register"
              className="inline-block bg-navy-900 hover:bg-navy-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-navy-900/50 transition-all transform hover:scale-105"
            >
              📱 Publier une annonce maintenant
            </a>
          </div>
        </section>

        {/* Section Avantages - Style moderne */}
        <section className="py-12 bg-navy-900">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-navy-800 rounded-2xl border border-navy-700 hover:border-accent-500 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Particuliers & professionnels</h3>
                <p className="text-gray-400">
                  Plateforme ouverte aux vendeurs particuliers et aux professionnels de l'automobile
                </p>
              </div>

              <div className="p-6 bg-navy-800 rounded-2xl border border-navy-700 hover:border-accent-500 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Publie ton annonce en 2 minutes</h3>
                <p className="text-gray-400">
                  Interface simple et rapide pour créer votre annonce automobile
                </p>
              </div>

              <div className="p-6 bg-navy-800 rounded-2xl border border-navy-700 hover:border-accent-500 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Des milliers d'acheteurs</h3>
                <p className="text-gray-400">
                  Touchez un large public d'acheteurs partout en Côte d'Ivoire
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}





