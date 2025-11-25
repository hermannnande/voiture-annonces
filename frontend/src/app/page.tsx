import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedListings from '@/components/home/FeaturedListings';
import LatestListings from '@/components/home/LatestListings';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <section className="py-12 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-8">
              Parcourir par Catégorie
            </h2>
            <Suspense fallback={<div>Chargement...</div>}>
              <CategoryGrid />
            </Suspense>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-br from-primary-50 to-blue-50">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">
                ⭐ Annonces Premium
              </h2>
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
              <FeaturedListings />
            </Suspense>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Dernières Annonces</h2>
              <a href="/listings" className="btn-outline btn-sm">
                Voir toutes les annonces →
              </a>
            </div>
            <Suspense fallback={<div>Chargement...</div>}>
              <LatestListings />
            </Suspense>
          </div>
        </section>

        <section className="py-16 bg-primary-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à vendre votre véhicule ?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Créez votre annonce en quelques minutes et touchez des milliers d'acheteurs potentiels
            </p>
            <a
              href="/auth/register"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors"
            >
              Publier une annonce gratuitement
            </a>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Modération Stricte</h3>
                <p className="text-gray-600">
                  Toutes les annonces sont vérifiées par notre équipe avant publication
                </p>
              </div>

              <div className="p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Contact Direct</h3>
                <p className="text-gray-600">
                  Messagerie interne, WhatsApp et appel téléphonique disponibles
                </p>
              </div>

              <div className="p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Visibilité Maximale</h3>
                <p className="text-gray-600">
                  Options de boost pour mettre en avant votre annonce
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





