/**
 * Convertit une URL d'image relative en URL complète
 * @param url - URL relative (ex: /uploads/listings/xxx.webp) ou complète
 * @returns URL complète pointant vers le backend
 */
export function getImageUrl(url: string | null | undefined): string {
  // Si pas d'URL, retourner le placeholder
  if (!url) {
    return '/images/placeholder-car.jpg';
  }

  // Si l'URL est déjà complète (commence par http), la retourner telle quelle
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Si c'est un placeholder local, le retourner tel quel
  if (url.startsWith('/images/')) {
    return url;
  }

  // Sinon, préfixer avec l'URL du backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const BACKEND_URL = API_URL.replace('/api', '');
  
  // Supprimer le slash initial si présent
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  
  return `${BACKEND_URL}/${cleanUrl}`;
}

