# 🔄 Redéployer sur l'Ancien Projet Railway

## Option 1 : Garder l'Ancienne Base de Données

### Étape 1 : Corriger les Données Existantes

1. **Ouvrez Railway :** https://railway.app/dashboard
2. Cliquez sur votre projet **voiture-annonces**
3. Cliquez sur la **base de données PostgreSQL**
4. Cliquez sur **"Data"** (ou "Query")
5. Exécutez cette requête pour corriger les emails :

```sql
-- Vérifier tous les utilisateurs
UPDATE users SET is_email_verified = true WHERE role = 'SELLER';
UPDATE users SET is_email_verified = true WHERE email = 'hermannnande@gmail.com';
```

### Étape 2 : Mettre à Jour les Variables du Backend

1. Cliquez sur votre **service backend** (pas la BDD)
2. Allez dans **Variables**
3. **Vérifiez/Ajoutez ces variables :**

```env
# Si DATABASE_URL existe déjà, ne la touchez pas
DATABASE_URL=${{Postgres.DATABASE_URL}}

NODE_ENV=production
PORT=3001

# GÉNÉREZ DE NOUVEAUX SECRETS !
JWT_SECRET=[NOUVEAU SECRET SÉCURISÉ]
JWT_REFRESH_SECRET=[NOUVEAU SECRET SÉCURISÉ]
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Votre compte admin
ADMIN_EMAIL=hermannnande@gmail.com
ADMIN_NAME=Hermann Nande
ADMIN_PHONE=+2250778030075
ADMIN_DEFAULT_PASSWORD=Nande19912012.

# URL Frontend
FRONTEND_URL=https://annonceauto.ci

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=annonceautoci@gmail.com
SMTP_PASS=[VOTRE MOT DE PASSE APP GMAIL]
EMAIL_FROM=noreply@annonceauto.ci
```

### Étape 3 : Forcer un Nouveau Déploiement

1. Toujours dans le service backend
2. Allez dans **Deployments**
3. Cliquez sur **"Deploy"** ou **"Redeploy"**
4. Railway va télécharger le nouveau code depuis GitHub
5. Attendez que ça devienne **vert** ✅

### Étape 4 : Vérifier les Logs

1. Dans **Deployments → View Logs**
2. Cherchez ces messages :
   ```
   ✅ Base de données connectée
   🔧 Initialisation de l'application...
   ✅ Admin principal déjà existant
   🚀 Backend démarré sur http://localhost:3001/api
   ```

---

## Option 2 : Créer une Nouvelle Base de Données (Recommandé)

### Étape 1 : Supprimer l'Ancienne BDD

1. Dans Railway, cliquez sur votre **PostgreSQL**
2. Allez dans **Settings**
3. Tout en bas, cliquez **"Delete Service"**
4. Confirmez

### Étape 2 : Créer une Nouvelle BDD

1. Dans votre projet, cliquez **"+ New"**
2. Sélectionnez **"Database → Add PostgreSQL"**
3. ✅ Nouvelle base créée !

### Étape 3 : Reconnecter le Backend

La variable `DATABASE_URL` sera automatiquement mise à jour.

**Vérifiez quand même :**
1. Cliquez sur le **service backend**
2. Allez dans **Variables**
3. Vérifiez que `DATABASE_URL=${{Postgres.DATABASE_URL}}`

### Étape 4 : Mettre à Jour les Autres Variables

Ajoutez toutes les variables de l'Option 1 ci-dessus.

### Étape 5 : Redéployer

1. Dans le service backend → **Deployments**
2. Cliquez **"Redeploy"**
3. Attendez que ça devienne vert ✅

### Étape 6 : Ajouter les Données (Optionnel)

Si vous voulez les marques, modèles, annonces de démo :

1. Dans le service backend → **Settings**
2. Cliquez sur **"Terminal"** ou l'icône console
3. Exécutez :

```bash
npm run prisma:seed
```

---

## 🔐 Générer de Nouveaux Secrets JWT

**Dans PowerShell local :**

```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

Exécutez 2 fois et copiez les résultats dans Railway.

---

## ⚙️ Configuration du Service Backend (Vérifier)

Si ce n'est pas déjà configuré :

**Settings → Service Settings**

**Root Directory :**
```
backend
```

**Build Command :**
```
npm install && npx prisma generate && npx prisma migrate deploy
```

**Start Command :**
```
npm run start:prod
```

**Watch Paths :**
```
backend/**
```

---

## 🌐 Vercel - Mettre à Jour

1. Allez sur https://vercel.com/dashboard
2. Ouvrez **voiture-annonces**
3. **Settings → Environment Variables**
4. Vérifiez ces variables :

```env
NEXT_PUBLIC_API_URL=https://[VOTRE-URL-RAILWAY]/api
NEXT_PUBLIC_WS_URL=wss://[VOTRE-URL-RAILWAY]
NODE_ENV=production
```

5. Remplacez `[VOTRE-URL-RAILWAY]` par votre vraie URL Railway
6. **Deployments → Redeploy**

---

## ✅ Test Final

1. **Backend :** https://votre-url-railway.up.railway.app/api
2. **Frontend :** https://annonceauto.ci
3. **Connexion :** hermannnande@gmail.com / Nande19912012.

---

## ❓ Quelle Option Choisir ?

### Garder l'Ancienne BDD si :
- ✅ Vous avez des données importantes à conserver
- ✅ Vous voulez aller vite
- ✅ La BDD n'a que quelques petits problèmes

### Créer une Nouvelle BDD si :
- ✅ L'ancienne a beaucoup d'erreurs
- ✅ Vous préférez repartir sur une base saine
- ✅ Pas de données importantes (ou facile à recréer)

**Recommandation :** **Option 2** (Nouvelle BDD) car plus propre et évite les problèmes.

---

## 🎯 Résumé Rapide

**Option 1 (Garder BDD) :**
```
1. Corriger les données SQL
2. Mettre à jour variables
3. Redéployer
```

**Option 2 (Nouvelle BDD) :**
```
1. Supprimer ancienne BDD
2. Créer nouvelle BDD
3. Mettre à jour variables
4. Redéployer
5. Seed (optionnel)
```

**Temps estimé :** 10-15 minutes pour les deux options

---

**Laquelle préférez-vous ?**




