# 🚀 DÉPLOIEMENT SUR RAILWAY - Solution Complète Gratuite

Railway offre **500 heures gratuites par mois** et peut héberger votre backend + frontend + base de données sur une seule plateforme.

## 📋 PRÉREQUIS

- Compte GitHub (gratuit)
- Compte Railway (gratuit) : https://railway.app
- Git installé localement

## 🎯 ÉTAPE 1 : PRÉPARATION DU PROJET

### 1.1 Créer un fichier .gitignore à la racine

```gitignore
# Node modules
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.production

# Database
*.db
*.db-journal
dev.db
prisma/dev.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Temp
tmp/
temp/
```

### 1.2 Créer les fichiers de configuration Railway

#### `railway.json` (à la racine)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.3 Modifier le fichier backend/package.json

Ajouter les scripts de production :

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "cd backend && npm install && npx prisma generate && npx prisma migrate deploy && node dist/main",
    "prisma:generate": "npx prisma generate",
    "prisma:migrate": "npx prisma migrate deploy"
  }
}
```

## 🎯 ÉTAPE 2 : DÉPLOIEMENT SUR RAILWAY

### 2.1 Créer un repository GitHub

```bash
# Dans le dossier racine du projet
cd "C:\Users\LENOVO\Desktop\voiture 5"

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - AnnonceAuto CI"

# Créer un nouveau repository sur GitHub (via l'interface web)
# Puis lier votre repo local :
git remote add origin https://github.com/VOTRE_USERNAME/annonceauto-ci.git
git branch -M main
git push -u origin main
```

### 2.2 Déployer le Backend sur Railway

1. **Allez sur** : https://railway.app
2. **Connectez-vous** avec votre compte GitHub
3. **Cliquez sur** "New Project"
4. **Sélectionnez** "Deploy from GitHub repo"
5. **Choisissez** votre repository `annonceauto-ci`
6. **Railway détectera automatiquement** que c'est un projet Node.js

### 2.3 Configurer les variables d'environnement

Dans Railway, allez dans **Variables** et ajoutez :

```env
# Base de données (Railway fournit PostgreSQL gratuit)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_production_2024
JWT_REFRESH_SECRET=votre_refresh_secret_ultra_securise_production_2024
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Application
NODE_ENV=production
PORT=3001
```

### 2.4 Ajouter une base de données PostgreSQL

1. Dans votre projet Railway, cliquez sur **"+ New"**
2. Sélectionnez **"Database" → "PostgreSQL"**
3. Railway créera automatiquement la base de données
4. La variable `DATABASE_URL` sera automatiquement ajoutée
5. **Copiez** la valeur de `DATABASE_URL` et mettez-la dans les variables du backend

### 2.5 Configurer Prisma pour PostgreSQL

Modifiez `backend/prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Puis remettre les `@db.Text` sur les champs String longs :

```prisma
model Listing {
  // ...
  description String @db.Text
  rejectionReason String? @db.Text
  // ...
}
```

### 2.6 Déploiement automatique

Railway déploiera automatiquement :
- ✅ À chaque push sur GitHub
- ✅ Migration de la base de données automatique
- ✅ Génération des clients Prisma
- ✅ Build et démarrage du serveur

**Votre backend sera disponible sur** : `https://votre-projet.railway.app`

## 🎯 ÉTAPE 3 : DÉPLOYER LE FRONTEND SUR VERCEL

Vercel est **gratuit et illimité** pour les projets Next.js.

### 3.1 Préparer le frontend

Créer `frontend/.env.production` :

```env
NEXT_PUBLIC_API_URL=https://votre-projet.railway.app/api
NEXT_PUBLIC_SITE_URL=https://votre-site.vercel.app
```

### 3.2 Déployer sur Vercel

1. **Allez sur** : https://vercel.com
2. **Connectez-vous** avec votre compte GitHub
3. **Cliquez sur** "Add New... → Project"
4. **Sélectionnez** votre repository `annonceauto-ci`
5. **Configurez** :
   - **Framework Preset** : Next.js
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`

6. **Variables d'environnement** :
   ```
   NEXT_PUBLIC_API_URL=https://votre-projet.railway.app/api
   NEXT_PUBLIC_SITE_URL=https://votre-site.vercel.app
   ```

7. **Cliquez sur** "Deploy"

### 3.3 Configurer le CORS dans le backend

Modifiez `backend/src/main.ts` pour autoriser votre domaine Vercel :

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://votre-site.vercel.app',
    'https://*.vercel.app',
  ],
  credentials: true,
});
```

Push les modifications :

```bash
git add .
git commit -m "Configure CORS for Vercel"
git push
```

Railway redéploiera automatiquement le backend.

## ✅ RÉSULTAT FINAL

Votre site sera accessible sur :
- 🌐 **Frontend** : `https://votre-site.vercel.app`
- 🔌 **Backend** : `https://votre-projet.railway.app`
- 💾 **Base de données** : PostgreSQL sur Railway

## 💰 COÛTS

- **Railway** : 500h/mois gratuites (≈ 20 jours)
- **Vercel** : Illimité et gratuit
- **Total** : **100% GRATUIT** pour un site de trafic moyen

## 🔄 DÉPLOIEMENT CONTINU

À chaque `git push` :
1. ✅ Railway redéploie le backend automatiquement
2. ✅ Vercel redéploie le frontend automatiquement
3. ✅ Les migrations de base de données s'exécutent automatiquement

## 🆘 DÉPANNAGE

### Backend ne démarre pas
```bash
# Vérifier les logs dans Railway
railway logs
```

### Erreurs de base de données
```bash
# Réexécuter les migrations
railway run npx prisma migrate deploy
```

### CORS errors
- Vérifiez que votre domaine Vercel est dans la liste CORS du backend
- Vérifiez les variables d'environnement

## 📝 COMMANDES UTILES

```bash
# Voir les logs du backend
railway logs

# Ouvrir le backend dans le navigateur
railway open

# Exécuter une commande dans Railway
railway run npm run prisma:migrate
```

---

**🎉 Votre site sera en ligne et accessible 24/7 gratuitement !**


