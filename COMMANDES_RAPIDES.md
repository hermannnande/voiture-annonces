# ⚡ Commandes Rapides - Copy/Paste

## 🚀 Option 1 : Correction complète (Recommandé)

### Étape 1 : Commit et Push des corrections

Ouvrez PowerShell dans le dossier du projet et exécutez :

```powershell
# Ajouter tous les fichiers modifiés
git add backend/Dockerfile backend/railway.json GUIDE_CORRECTION_RAILWAY.md GUIDE_CONFIGURATION_VERCEL.md VERIFICATION_RAPIDE.md RESUME_ACTIONS_IMMEDIATES.md test-deployment.ps1 COMMANDES_RAPIDES.md

# Commit avec message descriptif
git commit -m "fix(deployment): correction crash Railway - migrations Prisma automatiques + guides complets"

# Push vers GitHub
git push origin main
```

### Étape 2 : Attendre le redéploiement

Railway va automatiquement :
1. Détecter le push (30 secondes)
2. Lancer le build (2-3 minutes)
3. Déployer le backend (1 minute)

**Total : ~4 minutes**

### Étape 3 : Vérifier le déploiement

```powershell
# Lancer le script de test automatique
.\test-deployment.ps1
```

---

## ⚙️ Option 2 : Test rapide sans Git

Si vous voulez juste tester l'état actuel :

```powershell
# Test de santé de l'API
curl https://voiture-annonces-production.up.railway.app/api/health

# Test des listings
curl https://voiture-annonces-production.up.railway.app/api/listings?page=1&limit=3

# Test du frontend
curl https://www.annonceauto.ci
```

---

## 🔍 Commandes de diagnostic

### Vérifier les services en local (optionnel)

```powershell
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start:prod
```

```powershell
# Frontend (dans un autre terminal)
cd frontend
npm install
npm run build
npm start
```

---

## 🐛 Commandes de dépannage

### Si le backend ne démarre pas

```powershell
cd backend

# Nettoyer et réinstaller
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force dist
npm install

# Regénérer Prisma
npx prisma generate

# Rebuild
npm run build

# Tester
npm run start:prod
```

### Si Prisma pose problème

```powershell
cd backend

# Réinitialiser Prisma
npx prisma generate
npx prisma migrate reset --force
npx prisma db push
npx prisma db seed
```

⚠️ **ATTENTION** : `migrate reset` supprime toutes les données !

### Si Git pose problème

```powershell
# Voir le status
git status

# Voir les différences
git diff

# Annuler les modifications locales (si besoin)
git restore backend/Dockerfile
git restore backend/railway.json

# Ou tout annuler
git reset --hard HEAD
```

---

## 📊 URLs à bookmarker

### Production

```
Frontend:
https://www.annonceauto.ci

Backend API:
https://voiture-annonces-production.up.railway.app/api

Health Check:
https://voiture-annonces-production.up.railway.app/api/health

Listings:
https://voiture-annonces-production.up.railway.app/api/listings

Dashboard Admin:
https://www.annonceauto.ci/admin

User Dashboard:
https://www.annonceauto.ci/dashboard
```

### Dashboards

```
Railway Dashboard:
https://railway.app/project/271d3f6c-c44c-48cf-a5b2-e62b0dde253a/service/6e0e8edc1-0711-4510-a2ef-71cde8108283

Vercel Dashboard:
https://vercel.com/dashboard

GitHub Repository:
https://github.com/[votre-username]/voiture-annonces
```

---

## 🧪 Tests manuels rapides

### Test 1 : API Health

```powershell
Invoke-RestMethod -Uri "https://voiture-annonces-production.up.railway.app/api/health" -Method Get | ConvertTo-Json
```

**Attendu** :
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-12-12T..."
}
```

### Test 2 : Listings API

```powershell
$response = Invoke-RestMethod -Uri "https://voiture-annonces-production.up.railway.app/api/listings?page=1&limit=3" -Method Get
$response.listings.Count
```

**Attendu** : Nombre > 0

### Test 3 : Auth Login

```powershell
$body = @{
    email = "admin@annonceauto.ci"
    password = "VotreMotDePasse"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://voiture-annonces-production.up.railway.app/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

**Attendu** :
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "...", "email": "admin@annonceauto.ci" }
}
```

---

## 🔐 Variables d'environnement

### Copier dans Railway Variables

```env
# JWT
JWT_SECRET=votre-secret-tres-securise-de-32-caracteres-minimum
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=autre-secret-different-de-32-caracteres-minimum
JWT_REFRESH_EXPIRATION=30d

# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://www.annonceauto.ci

# Admin par défaut
ADMIN_EMAIL=admin@annonceauto.ci
ADMIN_DEFAULT_PASSWORD=VotreMotDePasseSecurise123!

# ImageKit
IMAGEKIT_PUBLIC_KEY=votre_public_key
IMAGEKIT_PRIVATE_KEY=votre_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/votre_id

# Moneroo (paiements)
MONEROO_PUBLIC_KEY=votre_moneroo_public_key
MONEROO_SECRET_KEY=votre_moneroo_secret_key
```

### Copier dans Vercel Environment Variables

```env
NEXT_PUBLIC_API_URL=https://voiture-annonces-production.up.railway.app/api
NEXT_PUBLIC_SITE_URL=https://www.annonceauto.ci
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=false
```

---

## 🔄 Redéploiement manuel

### Railway (via CLI)

```powershell
# Installer Railway CLI (si pas déjà fait)
npm install -g @railway/cli

# Login
railway login

# Lier le projet
railway link

# Déployer
railway up
```

### Vercel (via CLI)

```powershell
# Installer Vercel CLI
npm install -g vercel

# Login
vercel login

# Déployer en production
vercel --prod
```

---

## 📝 Checklist avant de commiter

- [ ] `backend/Dockerfile` modifié
- [ ] `backend/railway.json` modifié
- [ ] Tests en local réussis (optionnel)
- [ ] Variables d'environnement Railway vérifiées
- [ ] Variables d'environnement Vercel vérifiées
- [ ] Pas de secrets dans le code
- [ ] `.gitignore` à jour

### Vérifier avant commit

```powershell
# Voir ce qui va être commité
git diff --staged

# Liste des fichiers modifiés
git status

# Si tout est OK, commit
git commit -m "fix: correction déploiement"
git push origin main
```

---

## 🎯 Workflow complet en 5 minutes

```powershell
# 1. Commit et push (30 secondes)
git add backend/Dockerfile backend/railway.json *.md *.ps1
git commit -m "fix: correction déploiement Railway"
git push origin main

# 2. Attendre build Railway (~3-4 minutes)
# Pendant ce temps, vérifier les variables sur Railway Dashboard

# 3. Tester le déploiement (30 secondes)
.\test-deployment.ps1

# 4. Vérifier manuellement (1 minute)
Start-Process "https://voiture-annonces-production.up.railway.app/api/health"
Start-Process "https://www.annonceauto.ci"
```

---

## 🆘 Commande d'urgence

Si tout est cassé et vous voulez revenir en arrière :

```powershell
# Voir les derniers commits
git log --oneline -5

# Revenir au commit précédent
git revert HEAD

# Ou annuler complètement (DANGER: perte des modifications)
git reset --hard HEAD~1

# Push force (DANGER: utiliser avec précaution)
# git push origin main --force
```

⚠️ **N'utilisez `--force` que si vous savez ce que vous faites !**

---

## 📞 Logs en temps réel

### Railway

```powershell
# Avec Railway CLI
railway logs --follow
```

### Vercel

```powershell
# Avec Vercel CLI
vercel logs --follow
```

---

## ✅ Validation finale one-liner

```powershell
# Test complet en une commande
@("https://voiture-annonces-production.up.railway.app/api/health", "https://www.annonceauto.ci") | ForEach-Object { Write-Host "Testing: $_"; try { $r = Invoke-WebRequest $_ -UseBasicParsing; Write-Host "✅ OK - Status: $($r.StatusCode)" -ForegroundColor Green } catch { Write-Host "❌ FAIL - $_" -ForegroundColor Red } }
```

---

**Date** : 12 décembre 2025  
**Temps total estimé** : 5-10 minutes  
**Difficulté** : ⭐⭐ Facile

