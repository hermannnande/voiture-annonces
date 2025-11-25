# Configuration ImageKit pour Annonces Auto CI

## 🎯 Variables d'environnement Railway

Ajoute ces variables dans **Railway → backend service → Variables** :

```
IMAGEKIT_PUBLIC_KEY=public_AHbR2lRr8ald67utAKnwyQbUIUs=
IMAGEKIT_PRIVATE_KEY=private_fyTIKpf99D0H4noR6qMM8I+BsZg=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/lk2o6kxne
```

## ✅ Avantages

- Images stockées de façon **permanente** (ne disparaissent plus)
- **CDN rapide** dans le monde entier
- **20 GB gratuit** de stockage
- **Optimisation automatique** des images

## 🔧 Fonctionnement

1. L'image est optimisée avec Sharp (1200x900, WebP, 85% qualité)
2. L'image est uploadée vers ImageKit
3. ImageKit retourne une URL permanente (ex: https://ik.imagekit.io/lk2o6kxne/voiture-annonces/listings/uuid.webp)
4. Cette URL est stockée dans la base de données

## 📝 Notes

- Si ImageKit n'est pas configuré, le système utilise le stockage local (fichiers éphémères)
- Le système détecte automatiquement la configuration et ajuste le comportement

