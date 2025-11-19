# 🆓 Guide de Déploiement GRATUIT - Railway + Vercel

## 🎯 Résultat Final

Après ce guide, vous aurez :
- ✅ **Frontend** en ligne sur Vercel (gratuit)
- ✅ **Backend** + **PostgreSQL** + **Redis** sur Railway (gratuit)
- ✅ **HTTPS** automatique
- ✅ **URL publique** pour tester

**Temps estimé** : 30-45 minutes

**Coût** : **GRATUIT** 🎉

---

## 📋 Prérequis

- [ ] Avoir un compte **GitHub** (gratuit)
- [ ] Votre code actuel sur votre PC
- [ ] Une connexion Internet

---

## 🚀 ÉTAPE 1 : Préparer le Code

### 1.1 - Créer un `.gitignore`

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"
```

**Créer le fichier `.gitignore`** :

```
node_modules/
.env
.env.local
.env.production
*.log
.DS_Store
dist/
build/
uploads/
.next/
backend/.env
frontend/.env.local
.vscode/
*.swp
*.swo
.idea/
```

### 1.2 - Créer un fichier `railway.json` pour le backend

```powershell
cd backend
```

**Créer `railway.json`** :

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.3 - Vérifier le `package.json` du backend

Assurez-vous que votre `backend/package.json` contient :

```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

---

## 🐙 ÉTAPE 2 : Push sur GitHub

### 2.1 - Créer un dépôt GitHub

1. Aller sur : **https://github.com/new**
2. **Nom du dépôt** : `voiture-marketplace`
3. **Visibilité** : **Public** (pour utiliser Railway gratuit)
4. **Ne pas** initialiser avec README
5. Cliquer sur **"Create repository"**

### 2.2 - Initialiser Git localement

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Marketplace Voiture CI"

# Renommer la branche en main
git branch -M main

# Ajouter l'origine (REMPLACER par votre URL)
git remote add origin https://github.com/VOTRE_USERNAME/voiture-marketplace.git

# Push
git push -u origin main
```

**⚠️ Remplacer `VOTRE_USERNAME` par votre nom d'utilisateur GitHub !**

### 2.3 - Vérifier

Aller sur votre dépôt GitHub : `https://github.com/VOTRE_USERNAME/voiture-marketplace`

Vous devez voir tous vos fichiers ! ✅

---

## 🚂 ÉTAPE 3 : Déployer le Backend sur Railway

### 3.1 - Créer un compte Railway

1. Aller sur : **https://railway.app**
2. Cliquer sur **"Login"**
3. Se connecter avec **GitHub**
4. Autoriser Railway

### 3.2 - Créer un nouveau projet

1. Cliquer sur **"New Project"**
2. Sélectionner **"Provision PostgreSQL"**
3. PostgreSQL sera créé automatiquement ✅

### 3.3 - Ajouter Redis

1. Dans votre projet, cliquer sur **"+ New"**
2. Sélectionner **"Database"**
3. Choisir **"Add Redis"**
4. Redis sera ajouté ✅

### 3.4 - Ajouter le Backend (depuis GitHub)

1. Cliquer sur **"+ New"**
2. Sélectionner **"GitHub Repo"**
3. Choisir votre dépôt : **`voiture-marketplace`**
4. Railway va détecter automatiquement le projet

### 3.5 - Configurer le Backend

#### Définir le Root Directory

1. Cliquer sur votre service **Backend**
2. Aller dans **"Settings"**
3. Trouver **"Root Directory"**
4. Entrer : **`backend`**
5. Sauvegarder

#### Configurer les Variables d'Environnement

1. Cliquer sur l'onglet **"Variables"**
2. Ajouter ces variables :

**⚠️ IMPORTANT : Cliquer sur "RAW Editor" pour copier-coller tout d'un coup !**

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
JWT_SECRET=votre_secret_jwt_fort_32_caracteres_minimum
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=autre_secret_jwt_different_32_caracteres
JWT_REFRESH_EXPIRATION=7d
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://votre-site.vercel.app
ADMIN_WHATSAPP=+2250778030075
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=noreply@example.com
MAIL_PASSWORD=votre_mot_de_passe_email
MAIL_FROM=noreply@example.com
```

**⚠️ Générer des secrets JWT forts** :

```powershell
# Sur votre PC
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**⚠️ Vous changerez `FRONTEND_URL` après avoir déployé sur Vercel !**

### 3.6 - Déployer

Railway va **automatiquement déployer** ! 🚀

**Attendre** que le déploiement se termine (2-5 minutes).

### 3.7 - Obtenir l'URL du Backend

1. Cliquer sur votre service **Backend**
2. Aller dans **"Settings"**
3. Trouver **"Domains"**
4. Cliquer sur **"Generate Domain"**
5. Vous obtiendrez une URL comme : `https://backend-production-xxxx.up.railway.app`

**⚠️ NOTER CETTE URL !** Vous en aurez besoin pour Vercel.

### 3.8 - Tester le Backend

```powershell
# Remplacer par votre URL
curl https://votre-backend.up.railway.app/api/health
```

**Résultat attendu** : `{"status":"ok"}`

Si ça fonctionne : ✅ Backend déployé avec succès !

---

## 🔺 ÉTAPE 4 : Déployer le Frontend sur Vercel

### 4.1 - Créer un compte Vercel

1. Aller sur : **https://vercel.com**
2. Cliquer sur **"Sign Up"**
3. Se connecter avec **GitHub**
4. Autoriser Vercel

### 4.2 - Importer le projet

1. Sur le dashboard Vercel, cliquer sur **"Add New..."**
2. Sélectionner **"Project"**
3. **Importer** votre dépôt GitHub : `voiture-marketplace`
4. Cliquer sur **"Import"**

### 4.3 - Configurer le projet

#### Framework Preset

Vercel devrait détecter automatiquement : **Next.js** ✅

#### Root Directory

1. Cliquer sur **"Edit"** à côté de "Root Directory"
2. Entrer : **`frontend`**
3. Confirmer

#### Build Settings

**Devrait être automatique** :
- **Build Command** : `npm run build` ou `next build`
- **Output Directory** : `.next`

#### Environment Variables

Cliquer sur **"Environment Variables"** :

**Ajouter cette variable** :

```
Name: NEXT_PUBLIC_API_URL
Value: https://votre-backend.up.railway.app/api
```

**⚠️ Remplacer par l'URL de votre backend Railway !**

### 4.4 - Déployer

1. Cliquer sur **"Deploy"**
2. Attendre (3-5 minutes)
3. ✅ Déploiement terminé !

### 4.5 - Obtenir l'URL du Frontend

Vercel vous donnera une URL comme : `https://voiture-marketplace-xxxx.vercel.app`

**⚠️ NOTER CETTE URL !**

---

## 🔄 ÉTAPE 5 : Mettre à Jour les URLs

### 5.1 - Mettre à jour `FRONTEND_URL` sur Railway

1. Retourner sur **Railway**
2. Aller dans votre service **Backend**
3. Onglet **"Variables"**
4. Modifier `FRONTEND_URL` avec votre URL Vercel :
   ```
   FRONTEND_URL=https://votre-site.vercel.app
   ```
5. Sauvegarder

Le backend va **redéployer automatiquement**.

### 5.2 - Vérifier

Attendre 2 minutes, puis tester votre site !

---

## 🎉 ÉTAPE 6 : Tester Votre Site

### URLs

- **🌐 Frontend** : `https://votre-site.vercel.app`
- **🔌 Backend API** : `https://votre-backend.up.railway.app/api`
- **📚 Swagger** : `https://votre-backend.up.railway.app/api/docs`

### Tests

1. **Accéder au site** : Ouvrir `https://votre-site.vercel.app`
2. **Créer un compte** vendeur
3. **Se connecter**
4. **Créer une annonce**
5. **Uploader une image**
6. **Tester le boost** (avec le wallet)

---

## 🐛 Dépannage

### Problème : Backend ne démarre pas

**Solution** :

1. Aller sur Railway → Service Backend → **"Deployments"**
2. Cliquer sur le dernier déploiement
3. Voir les **logs d'erreur**

**Erreurs courantes** :

- **Prisma migration** : Les migrations se lancent automatiquement
- **Variables manquantes** : Vérifier toutes les variables d'environnement
- **Port** : Railway utilise automatiquement la variable `PORT`

### Problème : Frontend ne se connecte pas au Backend

**Solution** :

1. Vérifier que `NEXT_PUBLIC_API_URL` est correct dans Vercel
2. Vérifier que `FRONTEND_URL` est correct dans Railway
3. Vérifier les **CORS** dans le backend

### Problème : Images ne s'affichent pas

**Solution** :

Les images sont uploadées sur Railway. Vérifier :

1. Le dossier `uploads/` est bien dans le backend
2. Les permissions d'écriture sont OK sur Railway

---

## 💰 Limites Gratuites

### Railway

- **$5 de crédit/mois** offerts
- **500 heures d'exécution/mois**
- Suffisant pour tester et petits projets

**Quand vous dépassez** : ~$10-20/mois

### Vercel

- **100 GB de bande passante/mois**
- **Builds illimités**
- **Domaines illimités**

**Largement suffisant** pour la plupart des sites !

---

## 🔄 Mises à Jour (CI/CD Automatique)

### Comment mettre à jour votre site

**C'est automatique !** 🚀

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"

# Faire vos modifications
# ...

# Commit
git add .
git commit -m "Mise à jour: description"

# Push
git push
```

**Railway et Vercel vont automatiquement redéployer !** ✅

---

## 🌐 Ajouter un Nom de Domaine Personnalisé (Optionnel)

### Sur Vercel (Frontend)

1. Aller dans votre projet Vercel
2. **"Settings"** → **"Domains"**
3. Ajouter votre domaine : `www.votre-domaine.com`
4. Suivre les instructions pour configurer le DNS

### Sur Railway (Backend)

1. Aller dans votre service Backend
2. **"Settings"** → **"Domains"**
3. Ajouter : `api.votre-domaine.com`
4. Configurer le DNS (CNAME)

---

## 📊 Monitoring

### Railway

- **Dashboard** : https://railway.app
- **Logs** : Cliquer sur un service → onglet "Deployments" → logs
- **Métriques** : CPU, RAM, réseau

### Vercel

- **Dashboard** : https://vercel.com/dashboard
- **Analytics** : Voir les visites, performance
- **Logs** : Voir les erreurs frontend

---

## 🎯 Checklist Complète

- [ ] Code prêt sur GitHub
- [ ] Compte Railway créé
- [ ] PostgreSQL ajouté sur Railway
- [ ] Redis ajouté sur Railway
- [ ] Backend déployé sur Railway
- [ ] URL du backend notée
- [ ] Compte Vercel créé
- [ ] Frontend déployé sur Vercel
- [ ] URL du frontend notée
- [ ] Variables `FRONTEND_URL` et `NEXT_PUBLIC_API_URL` configurées
- [ ] Site testé et fonctionnel
- [ ] ✅ **Site en ligne !**

---

## 💡 Conseils

### Sécurité

- ✅ Changez les secrets JWT (ne gardez pas les valeurs par défaut)
- ✅ Ne commitez jamais les fichiers `.env` sur GitHub
- ✅ Utilisez des mots de passe forts

### Performance

- Les deux services sont **rapides** par défaut
- Railway et Vercel ont des **CDN intégrés**

### Coûts

- **Gratuit** pour commencer
- **Surveiller** votre usage sur Railway
- **Passer à un VPS** quand vous avez beaucoup de trafic

---

## 🚀 Prochaines Étapes

### Maintenant

- ✅ Votre site est en ligne gratuitement !
- ✅ Testez toutes les fonctionnalités
- ✅ Partagez le lien avec vos amis

### Plus Tard (Production)

Quand vous aurez plus de trafic :
- 👉 Migrer vers un **VPS LWS** (15€/mois)
- 👉 Utiliser le guide : `GUIDE_RAPIDE_DEPLOIEMENT_LWS.md`

---

## 🆘 Support

### Documentation

- **Railway** : https://docs.railway.app
- **Vercel** : https://vercel.com/docs
- **Next.js** : https://nextjs.org/docs
- **NestJS** : https://docs.nestjs.com

### Communautés

- **Railway Discord** : https://discord.gg/railway
- **Vercel Discord** : https://vercel.com/discord

---

## 🎉 Félicitations !

**Votre site est maintenant en ligne GRATUITEMENT !** 🚀

**Profitez-en pour tester et améliorer votre application !**

---

**Bon déploiement ! 🎊**


