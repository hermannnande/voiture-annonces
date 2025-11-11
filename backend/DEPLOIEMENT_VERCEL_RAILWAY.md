# 🚀 DÉPLOIEMENT VERCEL + RAILWAY - GUIDE COMPLET

## ✨ Pourquoi cette solution ?

- ✅ **100% automatique** - Pas de configuration serveur
- ✅ **Gratuit** - Railway offre 5$/mois de crédit gratuit
- ✅ **Simple** - Interface graphique, pas de ligne de commande
- ✅ **Rapide** - Déploiement en 15-20 minutes
- ✅ **Professionnel** - HTTPS automatique, certificats SSL inclus

---

## 📋 CE QUE VOUS AUREZ À LA FIN

- ✅ Frontend sur Vercel : `https://votre-site.vercel.app`
- ✅ Backend + Base de données PostgreSQL sur Railway
- ✅ Site complet fonctionnel avec toutes les annonces
- ✅ Mises à jour automatiques depuis GitHub

---

# 🎯 ÉTAPE 1 : PRÉPARER LE PROJET (5 minutes)

## 1.1 - Créer les fichiers de configuration

### A) Créer `.gitignore` (si pas encore fait)

Le fichier `.gitignore` existe déjà à la racine de votre projet.

### B) Vérifier les fichiers backend

Votre `backend/package.json` doit contenir ces scripts :

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "npx prisma generate && npx prisma migrate deploy && node dist/main",
    "prisma:generate": "prisma generate",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

✅ **Ces scripts sont déjà configurés dans votre projet !**

### C) Vérifier frontend/next.config.js

Assurez-vous que `output: 'export'` est **SUPPRIMÉ** :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
```

✅ **Déjà configuré !**

---

# 🎯 ÉTAPE 2 : POUSSER SUR GITHUB (10 minutes)

## Option A : Avec GitHub Desktop (RECOMMANDÉ - Plus simple)

### 1. Télécharger GitHub Desktop

🌐 **Lien :** https://desktop.github.com/

### 2. Installer et se connecter

- Installez GitHub Desktop
- Cliquez sur "Sign in to GitHub.com"
- Connectez-vous avec votre compte GitHub (ou créez-en un)

### 3. Ajouter votre projet

1. Cliquez sur **"File"** → **"Add Local Repository"**
2. Cliquez sur **"Choose..."**
3. Sélectionnez le dossier : `C:\Users\LENOVO\Desktop\voiture 5`
4. Si un message dit "This directory does not appear to be a Git repository", cliquez sur **"Create a repository"**

### 4. Créer le repository

1. Dans la fenêtre qui s'ouvre :
   - **Name:** `voiture-annonces` (ou le nom de votre choix)
   - **Description:** `Plateforme d'annonces automobiles`
   - Cochez ✅ **"Initialize this repository with a README"**
   - Git ignore: **None** (on a déjà notre .gitignore)
   - License: **None**

2. Cliquez sur **"Create Repository"**

### 5. Faire le premier commit

1. Dans GitHub Desktop, vous verrez tous vos fichiers listés
2. En bas à gauche, dans **"Summary"**, tapez : `Initial commit - Site complet`
3. Dans **"Description"**, tapez : `Frontend Next.js + Backend NestJS + Prisma`
4. Cliquez sur **"Commit to main"**

### 6. Publier sur GitHub

1. Cliquez sur **"Publish repository"** (en haut)
2. Dans la fenêtre qui s'ouvre :
   - **Name:** `voiture-annonces`
   - **Description:** `Plateforme d'annonces automobiles`
   - ⚠️ **DÉCOCHEZ** "Keep this code private" (pour que Railway puisse y accéder)
3. Cliquez sur **"Publish Repository"**

✅ **Votre code est maintenant sur GitHub !**

---

## Option B : Avec les commandes Git (Alternative)

Si vous préférez les commandes :

```powershell
# Naviguer vers le projet
cd "C:\Users\LENOVO\Desktop\voiture 5"

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit - Site complet"

# Créer le repository sur GitHub
# Allez sur https://github.com/new
# Créez un nouveau repository appelé "voiture-annonces"
# PUBLIC (important pour Railway gratuit)

# Lier votre projet local au repository GitHub
git remote add origin https://github.com/VOTRE-USERNAME/voiture-annonces.git

# Pousser le code
git branch -M main
git push -u origin main
```

---

# 🎯 ÉTAPE 3 : DÉPLOYER LE BACKEND SUR RAILWAY (5 minutes)

## 3.1 - Créer un compte Railway

1. 🌐 Allez sur : **https://railway.app**
2. Cliquez sur **"Start a New Project"** ou **"Sign Up"**
3. Connectez-vous avec **GitHub** (recommandé)
4. Autorisez Railway à accéder à vos repositories

## 3.2 - Créer un nouveau projet

1. Cliquez sur **"New Project"**
2. Choisissez **"Deploy from GitHub repo"**
3. Sélectionnez votre repository **"voiture-annonces"**
4. Railway va détecter automatiquement que c'est un monorepo

## 3.3 - Configurer le backend

### A) Définir le répertoire racine

1. Dans Railway, cliquez sur votre service (il s'appelle probablement "voiture-annonces")
2. Allez dans l'onglet **"Settings"**
3. Trouvez **"Root Directory"**
4. Changez-le en : `backend`
5. Cliquez sur **"Update"**

### B) Configurer les variables d'environnement

1. Allez dans l'onglet **"Variables"**
2. Cliquez sur **"New Variable"**
3. Ajoutez ces variables **UNE PAR UNE** :

```env
PORT=3001

JWT_SECRET=votre_secret_jwt_super_securise_changez_moi_en_production_12345
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=votre_refresh_secret_super_securise_changez_moi_aussi_67890
JWT_REFRESH_EXPIRATION=7d

NODE_ENV=production
```

⚠️ **NE PAS AJOUTER** `DATABASE_URL` maintenant !

### C) Ajouter une base de données PostgreSQL

1. Dans Railway, cliquez sur **"New"** en haut à droite
2. Choisissez **"Database"**
3. Sélectionnez **"Add PostgreSQL"**
4. Railway crée automatiquement la base de données

### D) Lier la base de données au backend

1. Cliquez sur votre service backend
2. Allez dans **"Variables"**
3. Railway devrait automatiquement avoir ajouté une variable `DATABASE_URL`
4. Si ce n'est pas le cas :
   - Cliquez sur **"New Variable"**
   - Cliquez sur **"Add Reference"**
   - Sélectionnez **"DATABASE_URL"** de votre service PostgreSQL

### E) Modifier le schema Prisma pour PostgreSQL

**Important :** Votre `backend/prisma/schema.prisma` doit utiliser PostgreSQL :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

✅ **C'est déjà configuré dans votre projet !**

### F) Configurer la commande de build

1. Allez dans **"Settings"**
2. Trouvez **"Build Command"**
3. Définissez : `npm install && npx prisma generate && npm run build`
4. Trouvez **"Start Command"**
5. Définissez : `npm run start:prod`

### G) Déployer

1. Railway va automatiquement démarrer le déploiement
2. Vous pouvez suivre les logs dans l'onglet **"Deployments"**
3. Attendez que le déploiement soit **"SUCCESS"** ✅

### H) Obtenir l'URL du backend

1. Dans votre service backend, allez dans **"Settings"**
2. Trouvez **"Domains"**
3. Cliquez sur **"Generate Domain"**
4. Railway génère une URL comme : `https://votre-backend.up.railway.app`

📝 **COPIEZ CETTE URL**, vous en aurez besoin pour le frontend !

### I) Initialiser la base de données (seed)

1. Dans Railway, allez dans l'onglet **"Settings"** de votre backend
2. Trouvez **"Deployments"**
3. Cliquez sur le dernier déploiement réussi
4. Cliquez sur **"View Logs"**
5. Les migrations Prisma devraient s'être exécutées automatiquement

**Pour ajouter les données initiales (seed) :**

Option 1 : Via l'interface Railway
- Railway n'a pas de terminal interactif dans la version gratuite
- On va utiliser un script de démarrage

Option 2 : Modifier `package.json` pour seed automatique (RECOMMANDÉ)

Ajoutez dans `backend/package.json` :

```json
{
  "scripts": {
    "start:prod": "npx prisma generate && npx prisma migrate deploy && npx ts-node prisma/seed.ts && node dist/main"
  }
}
```

Puis commit et push :

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"
git add backend/package.json
git commit -m "Ajout seed automatique au déploiement"
git push
```

Railway va automatiquement redéployer et exécuter le seed !

---

# 🎯 ÉTAPE 4 : DÉPLOYER LE FRONTEND SUR VERCEL (5 minutes)

## 4.1 - Créer un compte Vercel

1. 🌐 Allez sur : **https://vercel.com**
2. Cliquez sur **"Sign Up"**
3. Connectez-vous avec **GitHub** (recommandé)
4. Autorisez Vercel à accéder à vos repositories

## 4.2 - Importer votre projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Trouvez votre repository **"voiture-annonces"**
3. Cliquez sur **"Import"**

## 4.3 - Configurer le projet

### A) Paramètres de base

1. **Project Name :** `voiture-annonces` (ou votre choix)
2. **Framework Preset :** Next.js (détecté automatiquement)
3. **Root Directory :** Cliquez sur **"Edit"** → Sélectionnez `frontend`

### B) Build Settings

Vercel détecte automatiquement :
- **Build Command :** `npm run build`
- **Output Directory :** `.next`
- **Install Command :** `npm install`

✅ Ne changez rien ici !

### C) Variables d'environnement

Cliquez sur **"Environment Variables"** et ajoutez :

```env
NEXT_PUBLIC_API_URL=https://votre-backend.up.railway.app
```

⚠️ **Remplacez** `https://votre-backend.up.railway.app` par **l'URL Railway** que vous avez copiée à l'étape 3.3.H !

**Exemple :**
```env
NEXT_PUBLIC_API_URL=https://voiture-backend-production-a1b2.up.railway.app
```

⚠️ **PAS DE SLASH** à la fin de l'URL !

## 4.4 - Déployer

1. Cliquez sur **"Deploy"**
2. Vercel va :
   - Installer les dépendances
   - Builder votre application Next.js
   - Déployer sur leur CDN global
3. Attendez que le déploiement soit **"Ready"** ✅ (2-3 minutes)

## 4.5 - Obtenir l'URL du site

Une fois le déploiement terminé :

1. Vercel affiche l'URL : `https://votre-annonces.vercel.app`
2. Cliquez sur **"Visit"** pour voir votre site en ligne !

🎉 **VOTRE SITE EST EN LIGNE !**

---

# 🎯 ÉTAPE 5 : CONFIGURATION FINALE (2 minutes)

## 5.1 - Configurer CORS sur le backend

Il faut autoriser le frontend Vercel à communiquer avec le backend Railway.

### Modifier `backend/src/main.ts`

Assurez-vous que votre fichier contient :

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS Configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://votre-annonces.vercel.app', // ⚠️ Remplacez par votre URL Vercel
    ],
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Préfixe API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend démarré sur le port ${port}`);
}
bootstrap();
```

⚠️ **Remplacez** `https://votre-annonces.vercel.app` par **votre vraie URL Vercel** !

### Commit et push

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"
git add backend/src/main.ts
git commit -m "Configuration CORS pour Vercel"
git push
```

Railway va automatiquement redéployer le backend ! ✅

## 5.2 - Vérifier que tout fonctionne

1. **Tester le backend :**
   - Allez sur : `https://votre-backend.up.railway.app/api`
   - Vous devriez voir : `{"message":"API fonctionnelle"}`

2. **Tester le frontend :**
   - Allez sur : `https://votre-annonces.vercel.app`
   - Vous devriez voir votre site avec toutes les annonces !

3. **Tester une inscription :**
   - Créez un compte utilisateur
   - Connectez-vous
   - Publiez une annonce test

---

# 🎯 ÉTAPE 6 : PERSONNALISER LE DOMAINE (Optionnel)

## Option A : Domaine personnalisé sur Vercel

Si vous avez un nom de domaine (ex: `annonceauto.ci`) :

1. Dans Vercel, allez dans **"Settings"** → **"Domains"**
2. Cliquez sur **"Add"**
3. Entrez votre domaine : `annonceauto.ci`
4. Suivez les instructions pour configurer les DNS
5. Vercel configure automatiquement HTTPS !

## Option B : Sous-domaine gratuit Vercel

Vous pouvez changer le nom par défaut :

1. Dans Vercel, allez dans **"Settings"** → **"Domains"**
2. Cliquez sur **"Edit"**
3. Changez : `votre-annonces` → `annonceauto`
4. Votre site sera : `https://annonceauto.vercel.app`

---

# 📊 SURVEILLANCE ET MAINTENANCE

## Voir les logs

### Backend (Railway)
1. Allez sur Railway
2. Cliquez sur votre service backend
3. Onglet **"Deployments"**
4. Cliquez sur un déploiement pour voir les logs

### Frontend (Vercel)
1. Allez sur Vercel
2. Cliquez sur votre projet
3. Onglet **"Logs"**

## Mises à jour automatiques

Chaque fois que vous faites un `git push` :
- ✅ Railway redéploie automatiquement le backend
- ✅ Vercel redéploie automatiquement le frontend

**C'est magique !** 🪄

---

# 🆘 DÉPANNAGE

## Problème 1 : "Application failed to respond"

**Cause :** Le backend ne démarre pas sur Railway

**Solution :**
1. Vérifiez les logs Railway
2. Assurez-vous que `PORT` est défini dans les variables
3. Vérifiez que `start:prod` est correct dans `package.json`

## Problème 2 : "Network Error" sur le frontend

**Cause :** CORS non configuré

**Solution :**
1. Vérifiez que `NEXT_PUBLIC_API_URL` est correct dans Vercel
2. Vérifiez le CORS dans `backend/src/main.ts`
3. Redéployez le backend après modification

## Problème 3 : Base de données vide

**Cause :** Le seed ne s'est pas exécuté

**Solution :**

Créez un fichier `backend/seed-production.js` :

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Copiez le contenu de votre seed.ts ici en JavaScript
async function main() {
  console.log('🌱 Seed en cours...');
  
  // Votre logique de seed...
  
  console.log('✅ Seed terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Puis modifiez `package.json` :

```json
{
  "scripts": {
    "start:prod": "npx prisma generate && npx prisma migrate deploy && node seed-production.js && node dist/main"
  }
}
```

## Problème 4 : Images ne s'affichent pas

**Cause :** Les images doivent être uploadées quelque part

**Solution temporaire :**
- Les images doivent être hébergées sur un service externe
- Utilisez Cloudinary (gratuit) : https://cloudinary.com
- Ou utilisez le stockage Railway (payant)

**Solution long terme :**
- Intégrez un service de stockage cloud dans votre code

---

# 💰 COÛTS ET LIMITES

## Vercel (Frontend) - GRATUIT

- ✅ Bande passante : 100 GB/mois
- ✅ Déploiements : Illimités
- ✅ Domaine personnalisé : Oui
- ✅ HTTPS : Automatique
- ✅ CDN global : Inclus

**Largement suffisant pour un site d'annonces !**

## Railway (Backend + BDD) - 5$/MOIS GRATUIT

- ✅ 5$ de crédit gratuit chaque mois
- ✅ Base de données PostgreSQL : 500 MB
- ✅ RAM : 512 MB
- ✅ Temps de calcul : ~500 heures/mois

**Parfait pour démarrer, peut-être insuffisant si BEAUCOUP de trafic**

### Si vous dépassez le quota gratuit :

Vous devrez ajouter une carte bancaire et payer l'excédent (quelques dollars/mois).

---

# ✅ CHECKLIST FINALE

Avant de dire que c'est terminé, vérifiez :

- [ ] ✅ Code poussé sur GitHub
- [ ] ✅ Backend déployé sur Railway
- [ ] ✅ Base de données PostgreSQL créée
- [ ] ✅ Variables d'environnement configurées
- [ ] ✅ Seed exécuté (données initiales)
- [ ] ✅ Frontend déployé sur Vercel
- [ ] ✅ `NEXT_PUBLIC_API_URL` configuré
- [ ] ✅ CORS configuré dans `main.ts`
- [ ] ✅ Site accessible publiquement
- [ ] ✅ Inscription fonctionne
- [ ] ✅ Connexion fonctionne
- [ ] ✅ Annonces visibles
- [ ] ✅ Publication d'annonce fonctionne

---

# 🎓 PROCHAINES ÉTAPES

Une fois votre site en ligne :

1. **Testez tout** : Inscriptions, connexions, annonces, boost
2. **Partagez** : Envoyez le lien à vos amis pour tester
3. **Monitorez** : Surveillez les logs pour les erreurs
4. **Améliorez** : Ajoutez de nouvelles fonctionnalités

---

# 🆘 BESOIN D'AIDE ?

Si vous bloquez à une étape, dites-moi :
- À quelle étape êtes-vous ?
- Quel message d'erreur voyez-vous ?
- Capture d'écran si possible

Je vous aiderai ! 💪

---

**Bon courage ! Vous allez y arriver ! 🚀**

