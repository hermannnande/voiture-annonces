import Link from 'next/link';
import { Facebook, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Annonces Auto CI</h3>
            <p className="text-sm mb-4">
              La plateforme n°1 pour acheter et vendre des véhicules en Côte d'Ivoire.
              Trouvez la voiture de vos rêves en quelques clics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/listings" className="hover:text-primary-400 transition-colors">
                  Toutes les annonces
                </Link>
              </li>
              <li>
                <Link href="/listings?state=NEUF" className="hover:text-primary-400 transition-colors">
                  Véhicules neufs
                </Link>
              </li>
              <li>
                <Link href="/listings?state=OCCASION" className="hover:text-primary-400 transition-colors">
                  Véhicules d'occasion
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-primary-400 transition-colors">
                  Publier une annonce
                </Link>
              </li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/listings?category=berlines" className="hover:text-primary-400 transition-colors">
                  Berlines
                </Link>
              </li>
              <li>
                <Link href="/listings?category=suv" className="hover:text-primary-400 transition-colors">
                  SUV
                </Link>
              </li>
              <li>
                <Link href="/listings?category=pickup" className="hover:text-primary-400 transition-colors">
                  Pick-up
                </Link>
              </li>
              <li>
                <Link href="/listings?category=vehicules-transport" className="hover:text-primary-400 transition-colors">
                  Transport
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:annonceautoci@gmail.com" className="hover:text-primary-400 transition-colors">
                  annonceautoci@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+2250778030075" className="hover:text-primary-400 transition-colors">
                  +225 07 78 03 00 75
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2250778030075"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p>&copy; 2025 Annonces Auto CI. Tous droits réservés.</p>
            <div className="flex space-x-6">
              <Link href="/legal/terms" className="hover:text-primary-400 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/legal/privacy" className="hover:text-primary-400 transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}





