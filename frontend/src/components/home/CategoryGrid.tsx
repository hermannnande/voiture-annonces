'use client';

import Link from 'next/link';
import { Car, Truck, Package, Sparkles } from 'lucide-react';

const categories = [
  {
    name: 'Véhicules Personnels',
    slug: 'vehicules-personnels',
    icon: Car,
    count: '2,450+',
    color: 'bg-blue-500',
  },
  {
    name: 'SUV',
    slug: 'suv',
    icon: Truck,
    count: '1,280+',
    color: 'bg-green-500',
  },
  {
    name: 'Véhicules de Transport',
    slug: 'vehicules-transport',
    icon: Package,
    count: '680+',
    color: 'bg-orange-500',
  },
  {
    name: 'Véhicules de Luxe',
    slug: 'vehicules-luxe',
    icon: Sparkles,
    count: '350+',
    color: 'bg-purple-500',
  },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Link
            key={category.slug}
            href={`/listings?category=${category.slug}`}
            className="group"
          >
            <div className="card-hover p-6 text-center">
              <div
                className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} annonces</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}





