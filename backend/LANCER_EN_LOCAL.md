# 🚀 GUIDE DE LANCEMENT EN LOCAL - annonceauto.ci

## ⚡ Démarrage Rapide

### 1️⃣ Lancer le Backend

Ouvrez un terminal PowerShell et exécutez :

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5\backend"
npm run start:dev
```

Le backend démarrera sur **http://localhost:3001/api**

### 2️⃣ Lancer le Frontend

Ouvrez un AUTRE terminal PowerShell et exécutez :

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5\frontend"
npm run dev
```

Le frontend démarrera sur **http://localhost:3000**

### 3️⃣ Ouvrir dans le navigateur

Allez sur : **http://localhost:3000**

---

## 📋 Configuration Requise

### Base de données

⚠️ **IMPORTANT** : Vous devez avoir une base de données configurée.

#### Option 1 : PostgreSQL (recommandé pour dev)

Si le backend ne démarre pas, créez un fichier `.env` dans `backend/` :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/annonceauto_dev"
JWT_SECRET="dev_secret_123"
JWT_REFRESH_SECRET="dev_refresh_secret_123"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
FRONTEND_URL="http://localhost:3000"
BACKEND_PORT=3001
NODE_ENV=development
```

Puis lancez les migrations :

```powershell
cd backend
npx prisma migrate dev
npx prisma generate
```

#### Option 2 : MySQL (comme en production)

Si vous avez MySQL local, créez un fichier `.env` dans `backend/` :

```env
DATABASE_URL="mysql://root:password@localhost:3306/annonceauto_dev"
JWT_SECRET="dev_secret_123"
JWT_REFRESH_SECRET="dev_refresh_secret_123"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
FRONTEND_URL="http://localhost:3000"
BACKEND_PORT=3001
NODE_ENV=development
```

#### Option 3 : SQLite (le plus simple pour tester)

Créez un fichier `.env` dans `backend/` :

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev_secret_123"
JWT_REFRESH_SECRET="dev_refresh_secret_123"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
FRONTEND_URL="http://localhost:3000"
BACKEND_PORT=3001
NODE_ENV=development
```

**ATTENTION** : Pour SQLite, modifiez aussi `backend/prisma/schema.prisma` :

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Puis lancez :

```powershell
cd backend
npx prisma migrate dev
npx prisma db seed
```

---

## 🔧 Configuration Frontend

Créez un fichier `.env.local` dans `frontend/` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🎯 URLs de développement

Une fois tout lancé :

- 🌐 **Frontend** : http://localhost:3000
- 🔧 **Backend API** : http://localhost:3001/api
- 🗄️ **Prisma Studio** (base de données) : Lancez `npx prisma studio` dans backend

---

## 🛑 Problèmes Courants

### Le backend ne démarre pas

**Erreur : "DATABASE_URL not found"**
```powershell
# Créez le fichier .env dans backend/ avec DATABASE_URL
# Voir les options ci-dessus
```

**Erreur : "Cannot connect to database"**
```powershell
# Vérifiez que votre base de données est lancée
# Pour SQLite, lancez : npx prisma migrate dev
```

### Le frontend ne se connecte pas au backend

**Erreur : "Network Error" ou "Failed to fetch"**
```powershell
# 1. Vérifiez que le backend tourne sur http://localhost:3001
# 2. Créez le fichier .env.local dans frontend/ :
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Port déjà utilisé

**Erreur : "Port 3000 is already in use"**
```powershell
# Changez le port :
npm run dev -- -p 3002
```

---

## 🔄 Arrêter les serveurs

Pour arrêter, appuyez sur **CTRL + C** dans chaque terminal.

---

## 📦 Commandes Utiles

### Backend

```powershell
# Lancer en mode développement (avec auto-reload)
npm run start:dev

# Lancer en mode production
npm run start:prod

# Voir la base de données
npx prisma studio

# Réinitialiser la base de données
npx prisma migrate reset

# Remplir avec des données de test
npx prisma db seed
```

### Frontend

```powershell
# Lancer en mode développement
npm run dev

# Compiler pour production
npm run build

# Lancer la version compilée
npm run start
```

---

## 🎨 Premier Test

1. Allez sur http://localhost:3000
2. Cliquez sur "S'inscrire"
3. Créez un compte
4. Connectez-vous
5. Créez une annonce de test

---

## 💡 Conseils

- Gardez les deux terminaux ouverts pendant le développement
- Le backend se recharge automatiquement si vous modifiez le code
- Le frontend se recharge automatiquement également
- Utilisez Prisma Studio pour voir vos données : `npx prisma studio`

---

## ✅ Checklist Rapide

Avant de lancer :

☐ Node.js installé (version 18+)
☐ npm install lancé dans backend/
☐ npm install lancé dans frontend/
☐ Fichier .env créé dans backend/
☐ Base de données configurée
☐ npx prisma generate lancé dans backend/
☐ npx prisma migrate dev lancé dans backend/

---

## 🚀 Script de Lancement Automatique

Créez un fichier `start-local.ps1` à la racine :

```powershell
# Ouvrir deux terminaux PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\LENOVO\Desktop\voiture 5\backend'; npm run start:dev"
Start-Sleep -Seconds 5
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\LENOVO\Desktop\voiture 5\frontend'; npm run dev"
Start-Sleep -Seconds 10
Start-Process "http://localhost:3000"
```

Exécutez : `.\start-local.ps1`

---

## 🎉 Prêt à tester !

Suivez les étapes ci-dessus et votre site sera accessible en local ! 🚀


