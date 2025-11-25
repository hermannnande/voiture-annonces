'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Plus, Package, MessageSquare, TrendingUp, Eye, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const isAdmin = user.role === 'SUPER_ADMIN';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de bord
            </h1>
            <p className="text-gray-600">
              Bienvenue, {user.name} !
            </p>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link
              href="/dashboard/listings/create"
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <Plus className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Nouvelle annonce</h3>
                  <p className="text-sm text-gray-600">Publier une annonce</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/listings"
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mes annonces</h3>
                  <p className="text-sm text-gray-600">Gérer mes annonces</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/messages"
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-600">Voir mes conversations</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/boosts"
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Booster</h3>
                  <p className="text-sm text-gray-600">Augmenter la visibilité</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/wallet"
              className="card p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <Wallet className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mon Wallet</h3>
                  <p className="text-sm text-gray-600">Crédits de boost</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Accès Admin */}
          {isAdmin && (
            <div className="card p-6 mb-8 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    👑 Espace Administrateur
                  </h3>
                  <p className="text-gray-600">
                    Accédez à la modération, gestion des utilisateurs, statistiques et plus
                  </p>
                </div>
                <Link
                  href="/admin"
                  className="btn-primary whitespace-nowrap"
                >
                  Accéder au panel admin
                </Link>
              </div>
            </div>
          )}

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total d'annonces</h3>
                <Package className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 mt-1">Dont 0 en ligne</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total de vues</h3>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 mt-1">Ce mois-ci</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Messages reçus</h3>
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600 mt-1">0 non lus</p>
            </div>
          </div>

          {/* Guide de démarrage */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🚀 Commencer à vendre
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Créez votre annonce
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ajoutez des photos, décrivez votre véhicule et fixez votre prix
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Modération rapide
                  </h3>
                  <p className="text-sm text-gray-600">
                    Votre annonce sera vérifiée et approuvée sous 24h
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Vendez rapidement
                  </h3>
                  <p className="text-sm text-gray-600">
                    Recevez des messages d'acheteurs intéressés et vendez votre véhicule
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Link href="/dashboard/listings/create" className="btn-primary btn-lg">
                Publier ma première annonce
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

