# Dossier Images

Ce dossier contient les images statiques du site.

## Fichiers recommandés à ajouter :

- **logo.png** - Logo du site (format PNG transparent, 200x200px)
- **logo-white.png** - Logo en blanc pour fond sombre
- **og-image.png** - Image de partage social (1200x630px)
- **hero-banner.jpg** - Image de bannière d'accueil
- **no-image.png** - Image par défaut pour les annonces sans photo

## Utilisation dans le code

```jsx
import Image from 'next/image';

<Image 
  src="/images/logo.png" 
  alt="AnnonceAuto" 
  width={200} 
  height={200} 
/>
```

## Optimisation

Next.js optimise automatiquement les images avec le composant `<Image>`.
Utilisez toujours le composant Next.js Image pour de meilleures performances.



