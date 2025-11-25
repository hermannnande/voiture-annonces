# 🚀 GUIDE : Utiliser GitHub Desktop (Plus simple que Git en ligne de commande)

GitHub Desktop est une interface graphique qui remplace Git en ligne de commande. C'est **beaucoup plus simple** !

## 📥 ÉTAPE 1 : INSTALLATION

### Télécharger GitHub Desktop
1. Allez sur : **https://desktop.github.com**
2. Cliquez sur "Download for Windows"
3. Installez le programme (suivez les instructions)
4. Lancez GitHub Desktop

### Se connecter à GitHub
1. Si vous n'avez pas de compte GitHub :
   - Allez sur https://github.com/signup
   - Créez un compte gratuit
2. Dans GitHub Desktop, cliquez sur "Sign in to GitHub.com"
3. Connectez-vous avec votre compte

## 📤 ÉTAPE 2 : PUBLIER VOTRE PROJET

### Ajouter votre projet local
1. Dans GitHub Desktop, cliquez sur **"File" → "Add Local Repository"**
2. Naviguez vers : `C:\Users\LENOVO\Desktop\voiture 5`
3. Cliquez sur "Add repository"

Si vous voyez une erreur "This directory does not appear to be a Git repository" :
1. Cliquez sur **"create a repository"**
2. Laissez le nom par défaut
3. Décochez "Initialize this repository with a README"
4. Cliquez "Create Repository"

### Faire le premier commit
1. Vous verrez tous vos fichiers dans la liste à gauche
2. En bas à gauche, dans "Summary", écrivez : `Initial commit - AnnonceAuto CI`
3. Cliquez sur le bouton bleu **"Commit to main"**

### Publier sur GitHub
1. En haut, cliquez sur **"Publish repository"**
2. Nom du repository : `annonceauto-ci`
3. Description : `Site d'annonces de véhicules en Côte d'Ivoire`
4. **Décochez** "Keep this code private" (ou laissez coché si vous voulez un repo privé)
5. Cliquez **"Publish repository"**

✅ **Votre code est maintenant sur GitHub !**

## 🚂 ÉTAPE 3 : DÉPLOYER SUR RAILWAY

### Créer un compte Railway
1. Allez sur : **https://railway.app**
2. Cliquez "Login" puis "Login with GitHub"
3. Autorisez Railway à accéder à votre compte GitHub

### Créer un nouveau projet
1. Sur Railway, cliquez **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Cherchez et sélectionnez votre repository `annonceauto-ci`
4. Railway va détecter automatiquement que c'est un projet Node.js
5. Attendez que le déploiement se termine

### Ajouter PostgreSQL
1. Dans votre projet Railway, cliquez **"+ New"**
2. Sélectionnez **"Database" → "PostgreSQL"**
3. Railway crée automatiquement la base de données
4. La variable `DATABASE_URL` est ajoutée automatiquement

### Configurer les variables d'environnement
1. Cliquez sur votre service backend (pas la base de données)
2. Allez dans l'onglet **"Variables"**
3. Ajoutez ces variables (cliquez "+ New Variable" pour chaque) :

```env
JWT_SECRET=annonceauto_jwt_secret_production_2024_super_secure
JWT_REFRESH_SECRET=annonceauto_refresh_jwt_secret_production_2024_ultra_secure
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=production
```

4. Railway va redéployer automatiquement

### Vérifier que ça fonctionne
1. Dans Railway, cliquez sur votre service backend
2. Allez dans l'onglet **"Deployments"**
3. Attendez que le statut soit ✅ "Success"
4. Cliquez sur **"View Logs"** pour voir les logs
5. Cherchez le message : "Application listening on port 3001"

✅ **Votre backend est en ligne !**

Notez l'URL de votre backend, quelque chose comme :
`https://votre-projet-production.up.railway.app`

## 🌐 ÉTAPE 4 : DÉPLOYER LE FRONTEND SUR VERCEL

### Créer un compte Vercel
1. Allez sur : **https://vercel.com**
2. Cliquez **"Sign Up"** puis **"Continue with GitHub"**
3. Autorisez Vercel à accéder à votre compte GitHub

### Importer votre projet
1. Sur Vercel, cliquez **"Add New..." → "Project"**
2. Cherchez et sélectionnez `annonceauto-ci`
3. Cliquez **"Import"**

### Configurer le projet
1. **Framework Preset** : Next.js (détecté automatiquement)
2. **Root Directory** : Cliquez "Edit" et mettez `frontend`
3. **Build Command** : `npm run build` (laissez par défaut)
4. **Output Directory** : `.next` (laissez par défaut)

### Ajouter les variables d'environnement
Cliquez sur **"Environment Variables"** et ajoutez :

**Variable 1** :
- Key : `NEXT_PUBLIC_API_URL`
- Value : `https://votre-projet-production.up.railway.app/api`
  (Remplacez par l'URL de votre backend Railway)

**Variable 2** :
- Key : `NEXT_PUBLIC_SITE_URL`
- Value : (laissez vide pour l'instant, vous le mettrez après)

### Déployer
1. Cliquez **"Deploy"**
2. Attendez 2-3 minutes
3. Une fois terminé, vous verrez ✅ "Deployment Ready"
4. Cliquez sur **"Visit"** pour voir votre site !

Notez l'URL de votre frontend, quelque chose comme :
`https://annonceauto-ci.vercel.app`

### Mettre à jour NEXT_PUBLIC_SITE_URL
1. Retournez dans Vercel
2. Allez dans **"Settings" → "Environment Variables"**
3. Modifiez `NEXT_PUBLIC_SITE_URL` avec votre vraie URL Vercel
4. Allez dans **"Deployments"** et cliquez **"Redeploy"**

## 🔧 ÉTAPE 5 : CONFIGURER LE CORS

Votre frontend ne pourra pas encore communiquer avec le backend à cause du CORS.

### Mettre à jour le backend
1. Ouvrez le fichier `backend/src/main.ts` dans votre éditeur
2. Modifiez la configuration CORS pour ajouter votre domaine Vercel :

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://annonceauto-ci.vercel.app', // Remplacez par votre vraie URL
    'https://*.vercel.app',
  ],
  credentials: true,
});
```

3. Enregistrez le fichier

### Pousser les modifications
1. Ouvrez GitHub Desktop
2. Vous verrez les fichiers modifiés dans la liste
3. En bas, dans "Summary", écrivez : `Configure CORS for production`
4. Cliquez **"Commit to main"**
5. Cliquez **"Push origin"** en haut

Railway va automatiquement redéployer le backend avec la nouvelle configuration !

## ✅ C'EST FINI !

Votre site est maintenant en ligne :

- 🌐 **Frontend** : `https://annonceauto-ci.vercel.app`
- 🔌 **Backend** : `https://votre-projet-production.up.railway.app`
- 💾 **Base de données** : PostgreSQL sur Railway

### Tester votre site
1. Ouvrez votre site Vercel
2. Essayez de vous inscrire
3. Essayez de créer une annonce
4. Tout devrait fonctionner !

## 🔄 DÉPLOIEMENT CONTINU

Maintenant, à chaque fois que vous modifiez votre code :

1. **GitHub Desktop** :
   - Voyez les modifications
   - Faites un commit
   - Cliquez "Push origin"

2. **Railway** redéploie automatiquement le backend
3. **Vercel** redéploie automatiquement le frontend

## 💰 COÛTS

- ✅ GitHub : Gratuit
- ✅ Railway : 500h/mois gratuites (≈20 jours)
- ✅ Vercel : Illimité et gratuit

## 🆘 DÉPANNAGE

### Le backend ne démarre pas
- Dans Railway, allez dans "Logs" et cherchez les erreurs
- Vérifiez que toutes les variables d'environnement sont bien définies

### Le frontend affiche "Network Error"
- Vérifiez que `NEXT_PUBLIC_API_URL` pointe vers votre backend Railway
- Vérifiez que le CORS est bien configuré dans `backend/src/main.ts`

### Les migrations ne fonctionnent pas
- Dans Railway, allez dans votre service backend
- Cliquez "Deployments" → dernier déploiement → "View Logs"
- Cherchez les erreurs Prisma

---

**🎉 Félicitations ! Votre site est en ligne et accessible par tous !**



