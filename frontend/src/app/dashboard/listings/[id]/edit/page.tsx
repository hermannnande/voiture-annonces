'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { Upload, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const { isAuthenticated } = useAuthStore();

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceFcfa: '',
    state: 'OCCASION',
    fuel: 'ESSENCE',
    gearbox: 'MANUELLE',
    year: new Date().getFullYear(),
    mileageKm: '',
    color: '',
    doors: 4,
    powerCv: '',
    chassisNumber: '',
    brandId: '',
    modelId: '',
    categoryId: '',
    locationCity: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Charger les marques, catégories et l'annonce
    Promise.all([
      api.get('/brands'),
      api.get('/categories'),
      api.get(`/listings/${listingId}`),
    ]).then(([brandsRes, categoriesRes, listingRes]) => {
      setBrands(brandsRes.data);
      setCategories(categoriesRes.data);
      
      const listing = listingRes.data;
      
      // Pré-remplir le formulaire
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        priceFcfa: listing.priceFcfa || '',
        state: listing.state || 'OCCASION',
        fuel: listing.fuel || 'ESSENCE',
        gearbox: listing.gearbox || 'MANUELLE',
        year: listing.year || new Date().getFullYear(),
        mileageKm: listing.mileageKm || '',
        color: listing.color || '',
        doors: listing.doors || 4,
        powerCv: listing.powerCv || '',
        chassisNumber: listing.chassisNumber || '',
        brandId: listing.brandId || '',
        modelId: listing.modelId || '',
        categoryId: listing.categories?.[0]?.id || '',
        locationCity: listing.locationCity || '',
      });

      // Charger les images existantes
      if (listing.images && listing.images.length > 0) {
        setExistingImages(listing.images);
      }

      setLoadingData(false);
    }).catch(err => {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger l\'annonce');
      setLoadingData(false);
    });
  }, [isAuthenticated, router, listingId]);

  useEffect(() => {
    if (formData.brandId) {
      api.get(`/brands/${formData.brandId}/models`)
        .then(res => setModels(res.data))
        .catch(err => console.error('Erreur lors du chargement des modèles:', err));
    }
  }, [formData.brandId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length + existingImages.length > 20) {
      setError('Maximum 20 images autorisées');
      return;
    }

    setImages([...images, ...files]);

    // Créer les previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Pour la démo, on simule l'upload d'images
      // En production, il faudrait uploader les vraies images
      const newImageUrls = images.map((_, index) => `/uploads/demo/listing-${Date.now()}-${index}.jpg`);
      const existingImageUrls = existingImages.map(img => img.url);
      const allImageUrls = [...existingImageUrls, ...newImageUrls];

      const listingData = {
        ...formData,
        priceFcfa: parseInt(formData.priceFcfa),
        mileageKm: parseInt(formData.mileageKm),
        year: parseInt(formData.year.toString()),
        doors: parseInt(formData.doors.toString()),
        powerCv: formData.powerCv ? parseInt(formData.powerCv) : undefined,
        brandId: parseInt(formData.brandId),
        modelId: formData.modelId ? parseInt(formData.modelId) : undefined,
        categoryId: parseInt(formData.categoryId),
        images: allImageUrls,
      };

      await api.patch(`/listings/${listingId}`, listingData);
      
      alert('✅ Annonce modifiée avec succès !');
      router.push('/dashboard/listings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la modification de l\'annonce');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href="/dashboard/listings"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à mes annonces
              </Link>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Modifier l'annonce
              </h1>
              <p className="text-gray-600">
                Modifiez les informations de votre véhicule
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations générales */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informations générales</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'annonce *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input"
                      placeholder="Ex: Toyota Corolla 2018 - Très propre"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input"
                      placeholder="Décrivez votre véhicule en détail..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.priceFcfa}
                      onChange={(e) => setFormData({ ...formData, priceFcfa: e.target.value })}
                      className="input"
                      placeholder="6900000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      État *
                    </label>
                    <select
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="input"
                    >
                      <option value="NEUF">Neuf</option>
                      <option value="OCCASION">Occasion</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Caractéristiques */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Caractéristiques du véhicule</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marque *
                    </label>
                    <select
                      required
                      value={formData.brandId}
                      onChange={(e) => setFormData({ ...formData, brandId: e.target.value, modelId: '' })}
                      className="input"
                    >
                      <option value="">Sélectionnez une marque</option>
                      {brands.map((brand: any) => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modèle
                    </label>
                    <select
                      value={formData.modelId}
                      onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                      className="input"
                      disabled={!formData.brandId}
                    >
                      <option value="">Sélectionnez un modèle</option>
                      {models.map((model: any) => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="input"
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="input"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kilométrage (km) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.mileageKm}
                      onChange={(e) => setFormData({ ...formData, mileageKm: e.target.value })}
                      className="input"
                      placeholder="68000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carburant *
                    </label>
                    <select
                      required
                      value={formData.fuel}
                      onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                      className="input"
                    >
                      <option value="ESSENCE">Essence</option>
                      <option value="DIESEL">Diesel</option>
                      <option value="HYBRIDE">Hybride</option>
                      <option value="ELECTRIQUE">Électrique</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boîte de vitesses *
                    </label>
                    <select
                      required
                      value={formData.gearbox}
                      onChange={(e) => setFormData({ ...formData, gearbox: e.target.value })}
                      className="input"
                    >
                      <option value="MANUELLE">Manuelle</option>
                      <option value="AUTOMATIQUE">Automatique</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="input"
                      placeholder="Blanc"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de portes
                    </label>
                    <input
                      type="number"
                      value={formData.doors}
                      onChange={(e) => setFormData({ ...formData, doors: parseInt(e.target.value) })}
                      className="input"
                      min="2"
                      max="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puissance (CV)
                    </label>
                    <input
                      type="number"
                      value={formData.powerCv}
                      onChange={(e) => setFormData({ ...formData, powerCv: e.target.value })}
                      className="input"
                      placeholder="132"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.locationCity}
                      onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                      className="input"
                      placeholder="Abidjan / Marcory"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de châssis (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.chassisNumber}
                      onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                      className="input"
                      placeholder="VIN..."
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Photos du véhicule</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Ajoutez jusqu'à 20 photos de qualité. La première photo sera l'image principale.
                </p>

                <div className="mb-4">
                  <label className="btn-primary cursor-pointer inline-flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Ajouter des photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    {existingImages.length + images.length} / 20 photos
                  </p>
                </div>

                {(existingImages.length > 0 || imagePreviews.length > 0) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Images existantes */}
                    {existingImages.map((img, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={img.url}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                            Principale
                          </span>
                        )}
                      </div>
                    ))}
                    
                    {/* Nouvelles images */}
                    {imagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          Nouvelle
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/dashboard/listings"
                  className="btn-secondary"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Modification...' : 'Enregistrer les modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}





