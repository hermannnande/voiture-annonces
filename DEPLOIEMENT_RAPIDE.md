# 🚀 Déploiement Rapide - Checklist

## ✅ Étape 1 : Code Poussé sur GitHub
**Status :** TERMINÉ ✅

Le code avec toutes les corrections est maintenant sur :
- https://github.com/hermannnande/voiture-annonces

---

## 📦 Étape 2 : Railway (Backend + BDD)

### A. Créer une Nouvelle Base de Données

1. Allez sur https://railway.app/dashboard
2. Cliquez sur **"+ New Project"**
3. Sélectionnez **"Provision PostgreSQL"**
4. ✅ Base de données créée !

### B. Déployer le Backend

1. Dans le même projet, cliquez sur **"+ New"**
2. Sélectionnez **"GitHub Repo"**
3. Choisissez **voiture-annonces**
4. Railway va détecter le backend automatiquement

### C. Configuration Backend Service

**Root Directory:**
```
backend
```

**Build Command:**
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

**Start Command:**
```bash
npm run start:prod
```

**Watch Paths:**
```
backend/**
```

### D. Variables d'Environnement

Cliquez sur l'onglet **Variables** et ajoutez :

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NODE_ENV=production
PORT=3001

JWT_SECRET=VotreSecretJWTLongEtSecurise64CaracteresMinimum2024!
JWT_REFRESH_SECRET=VotreRefreshSecretJWTLongEtSecurise64CaracteresMinimum2024!
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

ADMIN_EMAIL=hermannnande@gmail.com
ADMIN_NAME=Hermann Nande
ADMIN_PHONE=+2250778030075
ADMIN_DEFAULT_PASSWORD=Nande19912012.

FRONTEND_URL=https://annonceauto.ci

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=annonceautoci@gmail.com
SMTP_PASS=VotreMotDePasseApplicationGmail
EMAIL_FROM=noreply@annonceauto.ci
```

### E. Générer de Nouveaux Secrets JWT

**Dans PowerShell, exécutez :**
```powershell
# Génère un secret JWT
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))

# Faites-le 2 fois pour JWT_SECRET et JWT_REFRESH_SECRET
```

Copiez les résultats dans Railway.

### F. Récupérer l'URL du Backend

Une fois déployé, Railway vous donnera une URL comme :
```
https://voiture-annonces-production-XXXX.up.railway.app
```

**Notez cette URL !** Vous en aurez besoin pour Vercel.

---

## 🌐 Étape 3 : Vercel (Frontend)

### A. Ouvrir Votre Projet Vercel

1. Allez sur https://vercel.com/dashboard
2. Trouvez votre projet **voiture-annonces**
3. Cliquez dessus

### B. Variables d'Environnement

1. Allez dans **Settings → Environment Variables**
2. **Supprimez** les anciennes variables (si elles causent des erreurs)
3. Ajoutez ces nouvelles variables :

```env
NEXT_PUBLIC_API_URL=https://VOTRE-URL-RAILWAY.up.railway.app/api
NEXT_PUBLIC_WS_URL=wss://VOTRE-URL-RAILWAY.up.railway.app
NODE_ENV=production
```

**⚠️ IMPORTANT:** Remplacez `VOTRE-URL-RAILWAY.up.railway.app` par l'URL réelle de Railway !

### C. Configurer le Domaine

1. Allez dans **Settings → Domains**
2. Vérifiez que **annonceauto.ci** et **www.annonceauto.ci** sont ajoutés
3. Si les DNS ne sont pas configurés, suivez les instructions Vercel

**Configuration DNS (chez votre registrar) :**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.19.19 | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

### D. Redéployer

1. Allez dans **Deployments**
2. Sur le dernier déploiement, cliquez sur **"..."** → **"Redeploy"**
3. Attendez que le déploiement se termine

---

## 🗄️ Étape 4 : Initialiser la Base de Données

### Option A : Laisser le Backend S'Initialiser

✅ **Recommandé** - Le backend va automatiquement :
- Créer les tables
- Créer votre compte admin
- Vérifier les emails

### Option B : Exécuter le Seed Manuellement

Si vous voulez les données de démo (marques, modèles, annonces) :

1. Dans Railway, cliquez sur votre **service backend**
2. Allez dans **Settings**
3. Cliquez sur **"Terminal"** ou **"Shell"**
4. Exécutez :

```bash
npm run prisma:seed
```

---

## ✅ Étape 5 : Vérification

### A. Tester le Backend

Ouvrez dans votre navigateur :
```
https://VOTRE-URL-RAILWAY.up.railway.app/api
```

Vous devriez voir une réponse ou "Cannot GET /api".

### B. Tester le Frontend

1. Allez sur https://annonceauto.ci
2. La page d'accueil devrait s'afficher
3. Essayez de vous connecter avec :
   - Email : `hermannnande@gmail.com`
   - Mot de passe : `Nande19912012.`

### C. Vérifier les Logs

**Railway :**
- Cliquez sur votre service backend
- Allez dans **Deployments → View Logs**
- Cherchez : "✅ Base de données connectée"
- Cherchez : "✅ Administrateur principal créé"

**Vercel :**
- Allez dans **Deployments**
- Cliquez sur le dernier déploiement
- Consultez les logs si erreur

---

## 🔧 Problèmes Courants et Solutions

### ❌ Erreur : "Failed to connect to database"

**Cause :** Variable DATABASE_URL mal configurée

**Solution :**
1. Dans Railway, vérifiez que PostgreSQL est déployé
2. Dans Variables du backend, vérifiez : `DATABASE_URL=${{Postgres.DATABASE_URL}}`
3. Redéployez le backend

---

### ❌ Erreur : "CORS error" sur le frontend

**Cause :** Le backend bloque les requêtes du frontend

**Solution :**
1. Vérifiez que `FRONTEND_URL=https://annonceauto.ci` est dans Railway
2. Dans le code `backend/src/main.ts`, vérifiez la config CORS
3. Redéployez le backend

---

### ❌ Erreur : "Cannot read property of undefined"

**Cause :** Variables d'environnement manquantes sur Vercel

**Solution :**
1. Vérifiez que `NEXT_PUBLIC_API_URL` est défini
2. Vérifiez l'URL (sans / à la fin)
3. Redéployez Vercel

---

### ❌ Le site affiche mais pas de données

**Cause :** Base de données vide

**Solution :**
1. Connectez-vous au shell Railway backend
2. Exécutez : `npm run prisma:seed`
3. Attendez la fin du seed
4. Rafraîchissez le site

---

## 🎉 Déploiement Réussi !

Votre application est maintenant en ligne sur :

- **Site public :** https://annonceauto.ci
- **Backend API :** https://VOTRE-URL-RAILWAY.up.railway.app/api

### Comptes de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| hermannnande@gmail.com | Nande19912012. | Super Admin |

*(Les comptes vendeurs seront créés après le seed)*

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- `DEPLOIEMENT_RAILWAY_VERCEL_GUIDE.md` - Guide complet
- `VARIABLES_ENVIRONNEMENT_RAILWAY.txt` - Liste des variables

---

## 🚀 Prochaines Étapes

1. ✅ Testez toutes les fonctionnalités
2. ✅ Configurez SMTP pour les emails (Gmail ou service professionnel)
3. ✅ Configurez ImageKit pour les images (optionnel)
4. ✅ Activez Google OAuth (optionnel)
5. ✅ Configurez les backups automatiques Railway

---

**Bon déploiement ! 🎊**




