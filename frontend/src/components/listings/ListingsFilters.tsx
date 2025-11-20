'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

interface ListingsFiltersProps {
  onClose?: () => void;
}

export default function ListingsFilters({ onClose }: ListingsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    state: searchParams.get('state') || '',
    fuel: searchParams.get('fuel') || '',
    gearbox: searchParams.get('gearbox') || '',
    brandId: searchParams.get('brandId') || '',
    categoryId: searchParams.get('categoryId') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    yearMin: searchParams.get('yearMin') || '',
    yearMax: searchParams.get('yearMax') || '',
    mileageMax: searchParams.get('mileageMax') || '',
  });

  useEffect(() => {
    // Charger les marques et catégories
    Promise.all([
      api.get('/brands'),
      api.get('/categories'),
    ]).then(([brandsRes, categoriesRes]) => {
      setBrands(brandsRes.data);
      setCategories(categoriesRes.data);
    });
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    router.push(`/listings?${query.toString()}`);
    if (onClose) onClose();
  };

  const resetFilters = () => {
    setFilters({
      state: '',
      fuel: '',
      gearbox: '',
      brandId: '',
      categoryId: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      mileageMax: '',
    });
    router.push('/listings');
    if (onClose) onClose();
  };

  return (
    <div className="space-y-6">
      {/* État */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          État
        </label>
        <select
          value={filters.state}
          onChange={(e) => handleFilterChange('state', e.target.value)}
          className="input text-sm"
        >
          <option value="">Tous</option>
          <option value="NEUF">Neuf</option>
          <option value="OCCASION">Occasion</option>
        </select>
      </div>

      {/* Marque */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Marque
        </label>
        <select
          value={filters.brandId}
          onChange={(e) => handleFilterChange('brandId', e.target.value)}
          className="input text-sm"
        >
          <option value="">Toutes les marques</option>
          {brands.map((brand: any) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Catégorie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catégorie
        </label>
        <select
          value={filters.categoryId}
          onChange={(e) => handleFilterChange('categoryId', e.target.value)}
          className="input text-sm"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category: any) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Carburant */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Carburant
        </label>
        <select
          value={filters.fuel}
          onChange={(e) => handleFilterChange('fuel', e.target.value)}
          className="input text-sm"
        >
          <option value="">Tous</option>
          <option value="ESSENCE">Essence</option>
          <option value="DIESEL">Diesel</option>
          <option value="HYBRIDE">Hybride</option>
          <option value="ELECTRIQUE">Électrique</option>
        </select>
      </div>

      {/* Boîte de vitesses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Boîte de vitesses
        </label>
        <select
          value={filters.gearbox}
          onChange={(e) => handleFilterChange('gearbox', e.target.value)}
          className="input text-sm"
        >
          <option value="">Toutes</option>
          <option value="MANUELLE">Manuelle</option>
          <option value="AUTOMATIQUE">Automatique</option>
        </select>
      </div>

      {/* Prix */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prix (FCFA)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => handleFilterChange('priceMin', e.target.value)}
            className="input text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => handleFilterChange('priceMax', e.target.value)}
            className="input text-sm"
          />
        </div>
      </div>

      {/* Année */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Année
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.yearMin}
            onChange={(e) => handleFilterChange('yearMin', e.target.value)}
            className="input text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.yearMax}
            onChange={(e) => handleFilterChange('yearMax', e.target.value)}
            className="input text-sm"
          />
        </div>
      </div>

      {/* Kilométrage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kilométrage max (km)
        </label>
        <input
          type="number"
          placeholder="Ex: 100000"
          value={filters.mileageMax}
          onChange={(e) => handleFilterChange('mileageMax', e.target.value)}
          className="input text-sm"
        />
      </div>

      {/* Boutons */}
      <div className="space-y-2">
        <button onClick={applyFilters} className="btn-primary w-full">
          Appliquer les filtres
        </button>
        <button onClick={resetFilters} className="btn-secondary w-full">
          Réinitialiser
        </button>
      </div>
    </div>
  );
}





