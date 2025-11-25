# 🚀 Démarrage Rapide - Nouvel Ordinateur

## 📝 Contexte
Vous avez changé d'ordinateur et récupéré le projet depuis GitHub. Ce guide vous aide à reprendre le développement rapidement.

---

## ✅ Ce que Vous AVEZ Déjà

D'après vos captures d'écran :

1. ✅ **Code source** : Récupéré depuis GitHub
2. ✅ **Déploiement Railway** : Application backend en ligne
3. ✅ **Déploiement Vercel** : Application frontend en ligne
4. ✅ **Base de données** : Connectée et fonctionnelle
5. ✅ **Variables d'environnement** : La plupart sont configurées

---

## ❌ Ce qui Manque

1. ❌ **Configuration Google OAuth** (c'est l'erreur actuelle)
2. ❌ **Environnement de développement local** (optionnel)

---

## 🎯 Plan d'Action

### Option A : Réparer Google OAuth (PRIORITAIRE)

**Durée estimée** : 15-30 minutes

**Étapes** :
1. Suivez le guide : **`GUIDE_CONFIGURATION_GOOGLE_OAUTH.md`**
2. Créez un projet OAuth sur Google Cloud Console
3. Ajoutez les 3 variables dans Railway :
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL`
4. Attendez le redéploiement automatique
5. Testez la connexion

**Fichiers utiles** :
- 📖 `GUIDE_CONFIGURATION_GOOGLE_OAUTH.md` - Guide complet
- 📋 `VARIABLES_GOOGLE_OAUTH.txt` - Variables à copier
- 📊 `RESUME_SITUATION.md` - Vue d'ensemble

### Option B : Développer en Local (OPTIONNEL)

**Si vous voulez développer des fonctionnalités sur votre nouvel ordinateur.**

#### 1️⃣ Installer les Dépendances

**Logiciels nécessaires** :
- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- Un éditeur (VS Code recommandé)

#### 2️⃣ Installer les Packages NPM

```powershell
# Backend
cd backend
npm install

# Frontend
cd ..\frontend
npm install
```

#### 3️⃣ Configuration Locale

**Créer le fichier `backend/.env`** :

```env
# Base de données locale (avec Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/voiture_annonces

# JWT Secrets
JWT_SECRET=dev_secret_change_in_production
JWT_REFRESH_SECRET=dev_refresh_secret_change_in_production
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Application
NODE_ENV=development
PORT=3001

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google OAuth (optionnel pour le dev local)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Email (MailDev pour le dev)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@voiture-annonces.local
```

**Créer le fichier `frontend/.env.local`** :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### 4️⃣ Lancer la Base de Données

**Option 1 : Avec Docker (recommandé)**

```powershell
# Démarrer PostgreSQL et MailDev
docker-compose up -d postgres maildev redis
```

**Option 2 : PostgreSQL installé localement**
- Assurez-vous que PostgreSQL est installé et démarré
- Créez une base de données nommée `voiture_annonces`
- Mettez à jour `DATABASE_URL` dans `.env`

#### 5️⃣ Initialiser la Base de Données

```powershell
cd backend

# Générer le client Prisma
npx prisma generate

# Lancer les migrations
npx prisma migrate dev --name init

# Insérer les données de test
npm run prisma:seed
```

#### 6️⃣ Démarrer le Backend

```powershell
cd backend
npm run start:dev
```

Le backend sera accessible sur : http://localhost:3001/api

#### 7️⃣ Démarrer le Frontend

**Dans un nouveau terminal** :

```powershell
cd frontend
npm run dev
```

Le frontend sera accessible sur : http://localhost:3000

---

## 🔍 Vérifications

### Backend est OK si :
- ✅ Logs : `Application is running on: http://[::1]:3001`
- ✅ Logs : `Database connected successfully`
- ✅ URL accessible : http://localhost:3001/api

### Frontend est OK si :
- ✅ Logs : `ready started server on 0.0.0.0:3000`
- ✅ URL accessible : http://localhost:3000

### Base de données est OK si :
- ✅ Prisma Studio fonctionne : `npx prisma studio`
- ✅ Les tables sont créées
- ✅ Les données de seed sont présentes

---

## 🌐 URLs Importantes

### Production (En Ligne)
- **Frontend** : https://voiture-annonces.vercel.app
- **Backend** : https://voiture-annonces-production.up.railway.app

### Développement Local
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001/api
- **MailDev** : http://localhost:1080
- **Prisma Studio** : http://localhost:5555 (après `npx prisma studio`)

### Gestion
- **Railway Dashboard** : https://railway.app/
- **Vercel Dashboard** : https://vercel.com/
- **GitHub Repository** : https://github.com/hermannnande/voiture-annonces
- **Google Cloud Console** : https://console.cloud.google.com/

---

## 🧪 Comptes de Test

### Super Administrateur
- **Email** : admin@voiture.com
- **Mot de passe** : admin123
- **Accès** : Dashboard admin, modération, statistiques

### Vendeur 1
- **Email** : vendeur1@gmail.com
- **Mot de passe** : seller123

### Vendeur 2
- **Email** : vendeur2@gmail.com
- **Mot de passe** : seller123

---

## 📚 Documentation Complète

- **README.md** - Documentation générale du projet
- **GUIDE_CONFIGURATION_GOOGLE_OAUTH.md** - Configuration OAuth Google
- **RESUME_SITUATION.md** - État actuel et problèmes
- **VARIABLES_GOOGLE_OAUTH.txt** - Variables d'environnement OAuth
- **backend/DEPLOIEMENT_RAILWAY.md** - Guide déploiement Railway
- **backend/CONFIGURATION.md** - Configuration détaillée

---

## 🚨 Problèmes Courants

### Erreur : "Cannot find module"
```powershell
cd backend  # ou frontend
npm install
```

### Erreur : "Database connection failed"
```powershell
# Vérifier que PostgreSQL est démarré
docker-compose ps

# Ou démarrer Docker
docker-compose up -d postgres
```

### Erreur : "Port already in use"
```powershell
# Trouver et arrêter le processus
# Port 3000 (Frontend)
netstat -ano | findstr :3000

# Port 3001 (Backend)
netstat -ano | findstr :3001

# Puis tuer le processus avec :
taskkill /PID <numero_pid> /F
```

### Google OAuth ne fonctionne pas
➡️ Suivez le guide : `GUIDE_CONFIGURATION_GOOGLE_OAUTH.md`

---

## 🎯 Recommandation

**Pour reprendre rapidement** :

1. **Aujourd'hui** : Configurez Google OAuth (Option A)
   - C'est le problème bloquant actuel
   - Prend 15-30 minutes
   - Pas besoin de développer en local

2. **Plus tard** : Configurez l'environnement local (Option B)
   - Seulement si vous voulez développer de nouvelles fonctionnalités
   - Prend 30-60 minutes
   - Utile pour tester sans déployer

---

## ✅ Checklist de Démarrage

### Configuration Google OAuth (Prioritaire)
- [ ] Consulter `GUIDE_CONFIGURATION_GOOGLE_OAUTH.md`
- [ ] Créer projet sur Google Cloud Console
- [ ] Configurer OAuth consent screen
- [ ] Créer Client ID et Secret
- [ ] Ajouter les 3 variables dans Railway
- [ ] Vérifier le redéploiement
- [ ] Tester la connexion Google

### Environnement Local (Optionnel)
- [ ] Installer Node.js 20+
- [ ] Installer Docker Desktop
- [ ] Cloner le projet (déjà fait ✅)
- [ ] Installer dépendances npm
- [ ] Créer fichiers .env
- [ ] Démarrer PostgreSQL
- [ ] Lancer migrations Prisma
- [ ] Lancer seed
- [ ] Démarrer backend
- [ ] Démarrer frontend
- [ ] Tester en local

---

## 💡 Conseils

1. **Vous n'avez pas besoin de Docker** si vous voulez juste corriger Google OAuth
2. **Le site fonctionne déjà** en production (Railway + Vercel)
3. **L'environnement local** est optionnel pour développer de nouvelles fonctionnalités
4. **Les déploiements sont automatiques** via GitHub

---

## 📞 Besoin d'Aide ?

Si vous êtes bloqué :
1. Consultez les fichiers de documentation pertinents
2. Vérifiez les logs dans Railway
3. Prenez une capture d'écran de l'erreur
4. Demandez de l'aide avec le contexte

---

**Dernière mise à jour** : 25 novembre 2025


