# 🚨 ACTIONS IMMÉDIATES - Résumé pour résoudre le crash

## ⚡ Ce qui a été fait

J'ai analysé votre configuration Railway et Vercel et identifié le problème :
- **Backend Railway crashé** depuis 11 heures
- **Problème** : Migrations Prisma non appliquées avant le démarrage
- **Corrections appliquées** : Dockerfile et railway.json optimisés

---

## 📝 Fichiers modifiés

### 1. `backend/Dockerfile` ✅
- Build optimisé avec `npm ci`
- Prisma generate ajouté
- Healthcheck intégré
- CMD mise à jour avec migrations

### 2. `backend/railway.json` ✅
- Start command : `npx prisma migrate deploy && node dist/src/main.js`
- Retry policy : 10 tentatives

### 3. Guides créés ✅
- `GUIDE_CORRECTION_RAILWAY.md` - Guide complet Railway
- `GUIDE_CONFIGURATION_VERCEL.md` - Guide complet Vercel
- `VERIFICATION_RAPIDE.md` - Checklist de vérification
- `test-deployment.ps1` - Script de test automatique

---

## 🚀 ÉTAPES À SUIVRE MAINTENANT

### Option 1 : Commit et Push (Recommandé) ⭐

```powershell
# Dans PowerShell, à la racine du projet
git add backend/Dockerfile backend/railway.json GUIDE_*.md VERIFICATION_RAPIDE.md test-deployment.ps1 RESUME_ACTIONS_IMMEDIATES.md
git commit -m "fix(deployment): correction crash Railway avec migrations Prisma automatiques"
git push origin main
```

**Résultat attendu** :
- Railway détecte le push et redéploie automatiquement
- Attendez 3-5 minutes que le build se termine
- Le status passe de "Crashed" à "Active" (vert)

### Option 2 : Modification manuelle sur Railway (Rapide)

Si vous ne voulez pas passer par Git :

1. **Allez sur Railway Dashboard**
   - https://railway.app/
   - Sélectionnez `voiture-annonces`

2. **Modifiez la commande de démarrage**
   - Cliquez sur **Settings**
   - Trouvez **Custom Start Command**
   - Remplacez par :
   ```
   npx prisma migrate deploy && node dist/src/main.js
   ```
   - Cliquez **Save**

3. **Redéployez**
   - Allez dans **Deployments**
   - Cliquez sur **Deploy** (bouton violet)
   - Attendez 3-5 minutes

---

## ✅ Vérification après redéploiement

### 1. Vérifiez Railway Dashboard
- Status doit être **Active** (pastille verte)
- Dans **Logs**, vous devriez voir :
```
🚀 [STARTUP] Début du bootstrap...
✅ [STARTUP] AppModule créé
🚀 Backend démarré sur http://localhost:3001/api
```

### 2. Testez l'API
Ouvrez dans votre navigateur :
```
https://voiture-annonces-production.up.railway.app/api/health
```

**Réponse attendue** :
```json
{
  "status": "ok",
  "database": "connected"
}
```

### 3. Testez le frontend
Allez sur : https://www.annonceauto.ci

- [ ] La page d'accueil charge
- [ ] Les annonces s'affichent
- [ ] Pas d'erreur CORS dans la console (F12)

### 4. Utilisez le script de test automatique

```powershell
.\test-deployment.ps1
```

---

## 🔧 Variables d'environnement Railway à vérifier

Avant de redéployer, assurez-vous que ces variables sont configurées :

### ✅ Obligatoires

```
DATABASE_URL           → Généré automatiquement par Railway Postgres
JWT_SECRET             → Votre secret (32+ caractères)
JWT_EXPIRATION         → 7d
JWT_REFRESH_SECRET     → Autre secret (32+ caractères)
JWT_REFRESH_EXPIRATION → 30d
FRONTEND_URL           → https://www.annonceauto.ci
PORT                   → 3001
```

### ✅ Pour ImageKit (upload d'images)

```
IMAGEKIT_PUBLIC_KEY     → Votre clé publique ImageKit
IMAGEKIT_PRIVATE_KEY    → Votre clé privée ImageKit
IMAGEKIT_URL_ENDPOINT   → https://ik.imagekit.io/[votre-id]
```

### ✅ Pour l'administrateur par défaut

```
ADMIN_EMAIL             → admin@annonceauto.ci
ADMIN_DEFAULT_PASSWORD  → Votre mot de passe sécurisé
```

---

## 🐛 Si le problème persiste

### 1. Consultez les logs Railway

Dans Railway Dashboard :
- Cliquez sur votre service
- Onglet **Deployments**
- Cliquez sur le dernier déploiement
- Consultez les **logs en temps réel**

### 2. Erreurs fréquentes et solutions

#### ❌ `Error: P1001: Can't reach database server`
**Solution** : 
- Vérifiez que le service PostgreSQL est actif sur Railway
- Vérifiez que `DATABASE_URL` est correcte

#### ❌ `Error: Cannot find module './app.module'`
**Solution** :
- Le build TypeScript a échoué
- Vérifiez les logs de build
- Assurez-vous que `npm run build` fonctionne localement

#### ❌ `Prisma Client could not locate the Query Engine`
**Solution** :
- Le `binaryTargets` dans `schema.prisma` est incorrect
- Devrait être : `["native", "linux-musl-openssl-3.0.x"]`

#### ❌ Toujours en status "Building"
**Solution** :
- Railway peut prendre jusqu'à 5 minutes pour builder
- Si > 10 minutes, annulez et redéployez

---

## 📊 Configuration Vercel (Frontend)

### Variables d'environnement requises

Sur Vercel Dashboard > Settings > Environment Variables :

```
NEXT_PUBLIC_API_URL              → https://voiture-annonces-production.up.railway.app/api
NEXT_PUBLIC_SITE_URL             → https://www.annonceauto.ci
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED → true (ou false)
```

⚠️ **Important** : 
- `NEXT_PUBLIC_API_URL` DOIT se terminer par `/api`
- Pas de slash final pour `NEXT_PUBLIC_SITE_URL`

### Settings Vercel

- **Root Directory** : `frontend`
- **Framework** : Next.js
- **Build Command** : `npm run build`

---

## 📞 Ordre des opérations recommandé

### 🔄 Étape par étape

1. **Vérifiez les variables Railway** (2 minutes)
   - Allez sur Railway > Variables
   - Vérifiez la checklist ci-dessus

2. **Commitez les corrections** (1 minute)
   ```bash
   git add .
   git commit -m "fix: correction déploiement Railway"
   git push origin main
   ```

3. **Attendez le redéploiement** (3-5 minutes)
   - Railway rebuilds automatiquement
   - Surveillez les logs

4. **Testez l'API** (1 minute)
   - Ouvrez `/api/health`
   - Doit retourner `{"status":"ok"}`

5. **Testez le frontend** (2 minutes)
   - Ouvrez https://www.annonceauto.ci
   - Vérifiez que les annonces chargent
   - Testez la connexion

6. **Lancez le script de test** (1 minute)
   ```powershell
   .\test-deployment.ps1
   ```

**Total : ~10 minutes**

---

## 🎯 Résultat attendu

Après avoir suivi ces étapes :

✅ Railway backend : **Active** (vert)  
✅ Vercel frontend : **Ready** (vert)  
✅ API Health : `{"status":"ok"}`  
✅ Site web : Annonces visibles  
✅ Console : Aucune erreur CORS  

---

## 📚 Documentation complète

Pour aller plus loin, consultez :

1. **GUIDE_CORRECTION_RAILWAY.md**
   - Configuration détaillée Railway
   - Résolution des erreurs courantes
   - Variables d'environnement expliquées

2. **GUIDE_CONFIGURATION_VERCEL.md**
   - Configuration complète Vercel
   - Gestion des domaines
   - Optimisation des performances

3. **VERIFICATION_RAPIDE.md**
   - Checklist exhaustive
   - Tests fonctionnels complets
   - Validation de tous les composants

---

## ⏱️ Timeline estimé

| Étape | Durée estimée | Status |
|-------|---------------|--------|
| Vérification variables | 2 min | ⏳ À faire |
| Commit + Push | 1 min | ⏳ À faire |
| Build Railway | 3-5 min | ⏳ Auto |
| Tests API | 1 min | ⏳ À faire |
| Tests Frontend | 2 min | ⏳ À faire |
| **TOTAL** | **~10 min** | |

---

## 🆘 Support d'urgence

Si après tout cela le problème persiste :

1. **Copiez les logs Railway complets**
   - Railway > Logs > Copy all

2. **Vérifiez la database**
   ```bash
   # Dans Railway CLI ou dashboard
   railway run npx prisma db push
   ```

3. **Test en local**
   ```powershell
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   npm run start:prod
   ```

Si ça marche en local mais pas sur Railway :
- Comparez les variables d'environnement
- Vérifiez les versions Node.js (doit être 20.x)

---

**Créé le** : 12 décembre 2025  
**Priorité** : 🔴 URGENT  
**Temps estimé** : 10 minutes  
**Difficulté** : ⭐⭐ Facile

