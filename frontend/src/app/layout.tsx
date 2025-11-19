import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Annonces Auto CI - Achetez et Vendez des Véhicules en Côte d\'Ivoire',
  description: 'Plateforme d\'annonces de vente de véhicules en Côte d\'Ivoire. Trouvez votre voiture d\'occasion ou neuve, berlines, SUV, véhicules de transport et plus encore.',
  keywords: 'voiture, véhicule, occasion, neuf, Côte d\'Ivoire, Abidjan, achat, vente, auto',
  openGraph: {
    title: 'Annonces Auto CI',
    description: 'Achetez et vendez des véhicules en Côte d\'Ivoire',
    type: 'website',
  },
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





