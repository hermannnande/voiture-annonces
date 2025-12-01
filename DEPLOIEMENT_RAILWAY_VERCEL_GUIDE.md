# 🚀 Guide de Déploiement Railway + Vercel

## Étape 1 : Préparer et Pousser sur GitHub

### 1.1 Commiter les changements

```powershell
git add .
git commit -m "Fix: Correction connexion BDD et vérification emails - Prêt pour déploiement"
git push origin main
```

---

## Étape 2 : Déployer la Base de Données et le Backend sur Railway

### 2.1 Créer un nouveau projet Railway

1. Allez sur https://railway.app
2. Cliquez sur **"New Project"**
3. Sélectionnez **"Deploy from GitHub repo"**
4. Choisissez le repo **voiture-annonces**

### 2.2 Ajouter PostgreSQL

1. Dans votre projet Railway, cliquez sur **"+ New"**
2. Sélectionnez **"Database" → "Add PostgreSQL"**
3. Railway va créer automatiquement la base de données
4. Une variable `DATABASE_URL` sera automatiquement créée

### 2.3 Configurer le Backend

1. Cliquez sur **"+ New" → "GitHub Repo"** (si pas déjà fait)
2. Sélectionnez votre repo
3. Dans **Settings → Root Directory**, mettez : `backend`
4. Dans **Settings → Build Command**, mettez : `npm install && npx prisma generate`
5. Dans **Settings → Start Command**, mettez : `npm run deploy:prod`

### 2.4 Variables d'Environnement Railway (Backend)

Allez dans **Variables** et ajoutez :

```env
# Database (sera automatiquement rempli par Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Secrets (GÉNÉREZ DE NOUVEAUX SECRETS SÉCURISÉS !)
JWT_SECRET=VotreSuperSecretJWT2024RandomString64Caracteres
JWT_REFRESH_SECRET=VotreSuperRefreshSecretJWT2024RandomString64Caracteres
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Admin Principal (VOS INFOS)
ADMIN_EMAIL=hermannnande@gmail.com
ADMIN_NAME=Hermann Nande
ADMIN_PHONE=+2250778030075
ADMIN_DEFAULT_PASSWORD=VotreMotDePasseSecurise123!

# Application
NODE_ENV=production
PORT=3001

# Frontend URL (sera votre domaine Vercel)
FRONTEND_URL=https://annonceauto.ci

# Email (À CONFIGURER PLUS TARD avec un vrai SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
EMAIL_FROM=noreply@annonceauto.ci

# ImageKit (Optionnel - pour hébergement images)
# IMAGEKIT_PUBLIC_KEY=
# IMAGEKIT_PRIVATE_KEY=
# IMAGEKIT_URL_ENDPOINT=

# Google OAuth (Optionnel)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GOOGLE_CALLBACK_URL=https://votre-backend-url/api/auth/google/callback
```

### 2.5 Déployer

1. Railway va automatiquement déployer après avoir configuré les variables
2. Notez l'URL de votre backend Railway (ex: `voiture-annonces-production.up.railway.app`)

---

## Étape 3 : Déployer le Frontend sur Vercel

### 3.1 Configuration Vercel

1. Allez sur https://vercel.com
2. Votre projet est déjà là : **voiture-annonces**
3. Allez dans **Settings → Environment Variables**

### 3.2 Variables d'Environnement Vercel (Frontend)

```env
# URL de votre backend Railway
NEXT_PUBLIC_API_URL=https://votre-backend-railway.up.railway.app/api

# URL WebSocket (même que le backend)
NEXT_PUBLIC_WS_URL=wss://votre-backend-railway.up.railway.app

# Environment
NODE_ENV=production
```

### 3.3 Configurer le Domaine

1. Dans Vercel, allez dans **Settings → Domains**
2. Ajoutez votre domaine : **annonceauto.ci**
3. Suivez les instructions pour configurer les DNS

**Configuration DNS requise :**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.19.19 |
| CNAME | www | cname.vercel-dns.com |

### 3.4 Redéployer

1. Allez dans **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Cliquez sur **"Redeploy"**

---

## Étape 4 : Initialiser la Base de Données Production

Une fois le backend déployé sur Railway :

### Option 1 : Via Railway CLI

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Lier au projet
railway link

# Exécuter le seed
railway run npm run prisma:seed --dir backend
```

### Option 2 : Seed automatique

Le backend va automatiquement :
1. Créer les tables (migration)
2. Créer votre compte admin au démarrage
3. Vérifier les emails des vendeurs

Pour ajouter les données de démo (marques, modèles, etc.), connectez-vous via Railway Shell :

1. Dans Railway, cliquez sur votre service backend
2. Allez dans **Settings → Shell**
3. Exécutez : `npm run prisma:seed`

---

## Étape 5 : Vérification Post-Déploiement

### 5.1 Tester le Backend

```bash
# Santé du serveur
curl https://votre-backend-railway.up.railway.app/api

# Tester login
curl -X POST https://votre-backend-railway.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hermannnande@gmail.com","password":"VotreMotDePasse"}'
```

### 5.2 Tester le Frontend

1. Allez sur https://annonceauto.ci
2. Essayez de vous connecter avec votre compte admin
3. Vérifiez que les annonces s'affichent

### 5.3 Vérifier la Base de Données

Dans Railway :
1. Cliquez sur votre base PostgreSQL
2. Allez dans **Data** pour voir les tables
3. Vérifiez que les utilisateurs existent

---

## Étape 6 : Configuration CORS (Important !)

Vérifiez que le backend accepte les requêtes depuis votre domaine.

Dans `backend/src/main.ts`, assurez-vous d'avoir :

```typescript
app.enableCors({
  origin: [
    'https://annonceauto.ci',
    'https://www.annonceauto.ci',
    'http://localhost:3000', // Pour développement
  ],
  credentials: true,
});
```

---

## 🔧 Résolution des Problèmes Courants

### Problème : "Can't reach database server"

**Solution :**
- Vérifiez que la variable `DATABASE_URL` est bien configurée dans Railway
- Format : `postgresql://user:password@host:port/database`

### Problème : "Email not verified"

**Solution :**
```sql
-- Dans Railway PostgreSQL Data
UPDATE users SET is_email_verified = true WHERE email = 'votre-email@example.com';
```

### Problème : "CORS error"

**Solution :**
- Ajoutez votre domaine dans la configuration CORS du backend
- Redéployez le backend

### Problème : "Module not found"

**Solution :**
- Vérifiez que `node_modules` n'est pas commité
- Vérifiez que `.gitignore` contient `node_modules`
- Redéployez

---

## 📊 Checklist de Déploiement

### Backend (Railway)

- [ ] PostgreSQL créé
- [ ] Variables d'environnement configurées
- [ ] Build command configuré
- [ ] Start command configuré
- [ ] Déploiement réussi (vert)
- [ ] URL backend accessible
- [ ] Migrations exécutées
- [ ] Compte admin créé

### Frontend (Vercel)

- [ ] Variables d'environnement configurées
- [ ] Domaine annonceauto.ci configuré
- [ ] DNS configurés correctement
- [ ] Déploiement réussi
- [ ] Site accessible sur le domaine
- [ ] Connexion backend fonctionnelle

### Base de Données

- [ ] Tables créées
- [ ] Compte admin créé
- [ ] Emails vérifiés
- [ ] Marques et modèles insérés (optionnel)
- [ ] Catégories créées (optionnel)

---

## 🎯 Comptes par Défaut après Déploiement

Après le premier démarrage du backend :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| hermannnande@gmail.com | (celui configuré dans ADMIN_DEFAULT_PASSWORD) | Super Admin |

Pour créer les comptes vendeurs de démo, exécutez le seed :
```bash
npm run prisma:seed
```

---

## 🔐 Sécurité - IMPORTANT

### Avant de Commiter sur GitHub

1. ✅ Ne JAMAIS commiter les fichiers `.env`
2. ✅ Vérifier que `.gitignore` contient `.env`
3. ✅ Changer tous les secrets en production
4. ✅ Utiliser des mots de passe forts

### Générer des Secrets Sécurisés

```powershell
# Dans PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

---

## 📝 Notes Finales

- Le fichier `.env` ne doit JAMAIS être commité
- Tous les secrets doivent être différents en production
- Utilisez Railway Secrets pour les données sensibles
- Activez l'authentification 2FA sur Railway et Vercel
- Configurez les backups automatiques de la BDD sur Railway

---

**Bon déploiement ! 🚀**



