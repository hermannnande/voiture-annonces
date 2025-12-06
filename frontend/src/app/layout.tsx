import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AnnonceAuto.ci - Achetez et Vendez des Véhicules en Côte d\'Ivoire',
  description: 'La plateforme auto des particuliers & car dealers en Côte d\'Ivoire. Trouvez votre voiture en quelques clics !',
  keywords: 'voiture, véhicule, occasion, neuf, Côte d\'Ivoire, Abidjan, achat, vente, auto, annonce',
  applicationName: 'AnnonceAuto.ci',
  authors: [{ name: 'AnnonceAuto.ci' }],
  openGraph: {
    title: 'AnnonceAuto.ci',
    description: 'La plateforme auto des particuliers & car dealers en Côte d\'Ivoire',
    type: 'website',
    siteName: 'AnnonceAuto.ci',
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}





