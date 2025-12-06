'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Menu, X, Search, User, LogOut, MessageSquare, Plus } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container-custom px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Logo variant="dark" showText={true} size="sm" />

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/listings"
              className="text-gray-700 hover:text-accent-500 font-medium transition-colors"
            >
              Annonces
            </Link>
            <Link
              href="/listings?state=NEUF"
              className="text-gray-700 hover:text-accent-500 font-medium transition-colors"
            >
              Véhicules Neufs
            </Link>
            <Link
              href="/listings?state=OCCASION"
              className="text-gray-700 hover:text-accent-500 font-medium transition-colors"
            >
              Occasions
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard/listings/create" className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors hidden sm:flex items-center space-x-2 shadow-md">
                  <Plus className="w-4 h-4" />
                  <span>Publier</span>
                </Link>

                <Link href="/dashboard/messages" className="p-2 text-gray-700 hover:text-accent-500 transition-colors relative">
                  <MessageSquare className="w-5 h-5" />
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      href="/dashboard/listings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Mes annonces
                    </Link>
                    <Link
                      href="/dashboard/messages"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Messages
                    </Link>
                    {user?.role === 'SUPER_ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-accent-500 hover:bg-gray-50 font-medium"
                      >
                        Administration
                      </Link>
                    )}
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-accent-500 font-medium text-sm sm:text-base">
                  Connexion
                </Link>
                <Link href="/auth/register" className="bg-accent-500 hover:bg-accent-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors shadow-md text-sm sm:text-base">
                  Inscription
                </Link>
              </>
            )}

            {/* Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-in-up bg-white">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/listings"
                className="text-gray-700 hover:text-accent-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Toutes les annonces
              </Link>
              <Link
                href="/listings?state=NEUF"
                className="text-gray-700 hover:text-accent-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Véhicules Neufs
              </Link>
              <Link
                href="/listings?state=OCCASION"
                className="text-gray-700 hover:text-accent-500 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Occasions
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard/listings/create"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Publier une annonce
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}





