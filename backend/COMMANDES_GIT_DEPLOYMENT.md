# 🚀 Commandes Git pour le déploiement

## ✅ Vérification préalable

Testez d'abord si Git est installé :
```bash
git --version
```

Si vous voyez "git version 2.x.x", c'est bon ! Sinon, installez Git d'abord.

## 📤 ÉTAPE 1 : Pousser le code sur GitHub

### 1.1 Configurer Git (première fois seulement)
```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

### 1.2 Aller dans le dossier du projet
```bash
cd "C:\Users\LENOVO\Desktop\voiture 5"
```

### 1.3 Initialiser Git
```bash
git init
```

### 1.4 Ajouter tous les fichiers
```bash
git add .
```

### 1.5 Créer le premier commit
```bash
git commit -m "Initial commit - AnnonceAuto CI"
```

### 1.6 Créer le repository sur GitHub
1. Allez sur https://github.com/new
2. Nom du repository : `annonceauto-ci`
3. Description : `Site d'annonces de véhicules en Côte d'Ivoire`
4. **Public** ou **Private** (votre choix)
5. **NE COCHEZ RIEN** (pas de README, pas de .gitignore, rien)
6. Cliquez "Create repository"

### 1.7 Lier votre projet local au repository GitHub
```bash
git remote add origin https://github.com/VOTRE_USERNAME/annonceauto-ci.git
git branch -M main
git push -u origin main
```

⚠️ **Remplacez `VOTRE_USERNAME` par votre vrai nom d'utilisateur GitHub !**

Si on vous demande de vous connecter, entrez vos identifiants GitHub.

✅ **Votre code est maintenant sur GitHub !**

## 🚂 ÉTAPE 2 : Déployer sur Railway

### 2.1 Créer un compte Railway
1. Allez sur https://railway.app
2. Cliquez "Login"
3. "Login with GitHub"
4. Autorisez Railway

### 2.2 Créer un nouveau projet
1. Cliquez "New Project"
2. "Deploy from GitHub repo"
3. Sélectionnez `annonceauto-ci`
4. Railway détecte automatiquement Node.js et commence le déploiement

### 2.3 Ajouter PostgreSQL
1. Dans votre projet Railway, cliquez "+ New"
2. "Database" → "PostgreSQL"
3. Railway crée la base automatiquement
4. La variable `DATABASE_URL` est ajoutée automatiquement

### 2.4 Configurer les variables d'environnement
1. Cliquez sur votre service backend (pas la DB)
2. Onglet "Variables"
3. Cliquez "+ New Variable" et ajoutez :

```
JWT_SECRET=annonceauto_jwt_secret_production_2024_super_secure
JWT_REFRESH_SECRET=annonceauto_refresh_jwt_secret_production_2024_ultra_secure
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=production
```

4. Railway redéploie automatiquement

### 2.5 Vérifier le déploiement
1. Onglet "Deployments"
2. Attendez le statut ✅ "Success"
3. Cliquez sur "View Logs"
4. Cherchez : "Application listening on port 3001"

✅ **Notez l'URL du backend** : `https://XXXX.up.railway.app`

## 🌐 ÉTAPE 3 : Déployer le frontend sur Vercel

### 3.1 Créer un compte Vercel
1. Allez sur https://vercel.com
2. "Sign Up" → "Continue with GitHub"
3. Autorisez Vercel

### 3.2 Importer le projet
1. "Add New..." → "Project"
2. Cherchez `annonceauto-ci`
3. Cliquez "Import"

### 3.3 Configuration
- **Framework Preset** : Next.js ✅
- **Root Directory** : `frontend` ← IMPORTANT !
- **Build Command** : `npm run build`
- **Output Directory** : `.next`

### 3.4 Variables d'environnement
Ajoutez ces 2 variables :

**Variable 1** :
```
Key: NEXT_PUBLIC_API_URL
Value: https://VOTRE-BACKEND.up.railway.app/api
```
(Remplacez par votre vraie URL Railway)

**Variable 2** :
```
Key: NEXT_PUBLIC_SITE_URL
Value: (laissez vide pour l'instant)
```

### 3.5 Déployer
1. Cliquez "Deploy"
2. Attendez 2-3 minutes
3. ✅ "Deployment Ready"
4. Notez l'URL : `https://XXXX.vercel.app`

### 3.6 Mettre à jour NEXT_PUBLIC_SITE_URL
1. Settings → Environment Variables
2. Modifiez `NEXT_PUBLIC_SITE_URL` avec votre URL Vercel
3. Deployments → Redeploy

## 🔧 ÉTAPE 4 : Configurer le CORS

### 4.1 Modifier le fichier backend/src/main.ts
Changez la partie CORS pour :

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://votre-site.vercel.app', // Votre vraie URL
    'https://*.vercel.app',
  ],
  credentials: true,
});
```

### 4.2 Pousser les modifications
```bash
cd "C:\Users\LENOVO\Desktop\voiture 5"
git add backend/src/main.ts
git commit -m "Configure CORS for production"
git push
```

Railway redéploie automatiquement !

## ✅ C'EST TERMINÉ !

Votre site est en ligne :
- 🌐 Frontend : `https://votre-site.vercel.app`
- 🔌 Backend : `https://votre-backend.up.railway.app`

## 🔄 Pour les prochaines modifications

À chaque fois que vous modifiez le code :

```bash
cd "C:\Users\LENOVO\Desktop\voiture 5"
git add .
git commit -m "Description de vos modifications"
git push
```

Railway et Vercel redéploient automatiquement !

## 🆘 Commandes utiles

### Voir l'état de Git
```bash
git status
```

### Voir l'historique des commits
```bash
git log --oneline
```

### Annuler des modifications non commitées
```bash
git checkout .
```

### Créer une nouvelle branche
```bash
git checkout -b nouvelle-fonctionnalite
```



