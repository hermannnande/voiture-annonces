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
    <header className="bg-navy-900 shadow-lg sticky top-0 z-50 border-b border-navy-800">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo variant="light" showText={true} size="md" />

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/listings"
              className="text-white hover:text-accent-400 font-medium transition-colors"
            >
              Annonces
            </Link>
            <Link
              href="/listings?state=NEUF"
              className="text-white hover:text-accent-400 font-medium transition-colors"
            >
              Véhicules Neufs
            </Link>
            <Link
              href="/listings?state=OCCASION"
              className="text-white hover:text-accent-400 font-medium transition-colors"
            >
              Occasions
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard/listings/create" className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors hidden sm:flex items-center space-x-2 shadow-lg">
                  <Plus className="w-4 h-4" />
                  <span>Publier</span>
                </Link>

                <Link href="/dashboard/messages" className="p-2 text-white hover:text-accent-400 transition-colors relative">
                  <MessageSquare className="w-5 h-5" />
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-navy-800 transition-colors text-white">
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-navy-800 rounded-lg shadow-xl border border-navy-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-white hover:bg-navy-700"
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      href="/dashboard/listings"
                      className="block px-4 py-2 text-sm text-white hover:bg-navy-700"
                    >
                      Mes annonces
                    </Link>
                    <Link
                      href="/dashboard/messages"
                      className="block px-4 py-2 text-sm text-white hover:bg-navy-700"
                    >
                      Messages
                    </Link>
                    {user?.role === 'SUPER_ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-accent-400 hover:bg-navy-700 font-medium"
                      >
                        Administration
                      </Link>
                    )}
                    <hr className="my-2 border-navy-700" />
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-navy-700 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-white hover:text-accent-400 font-medium">
                  Connexion
                </Link>
                <Link href="/auth/register" className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg">
                  Inscription
                </Link>
              </>
            )}

            {/* Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-navy-800 animate-slide-in-up bg-navy-900">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/listings"
                className="text-white hover:text-accent-400 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Toutes les annonces
              </Link>
              <Link
                href="/listings?state=NEUF"
                className="text-white hover:text-accent-400 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Véhicules Neufs
              </Link>
              <Link
                href="/listings?state=OCCASION"
                className="text-white hover:text-accent-400 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Occasions
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard/listings/create"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-center"
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





