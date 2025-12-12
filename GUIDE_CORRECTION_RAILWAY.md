# 🚀 Guide de Correction et Redéploiement Railway

## ⚠️ Problème identifié
Votre backend Railway crashe car :
- Les migrations Prisma ne sont pas appliquées avant le démarrage
- La configuration du Dockerfile n'est pas optimale

## ✅ Corrections appliquées

### 1. Dockerfile optimisé (`backend/Dockerfile`)
- Installation optimisée des dépendances
- Génération automatique du client Prisma
- Healthcheck ajouté pour vérifier la santé du service
- Nettoyage des fichiers inutiles

### 2. Railway.json mis à jour (`backend/railway.json`)
- Commande de démarrage : `npx prisma migrate deploy && node dist/src/main.js`
- Les migrations sont appliquées automatiquement avant chaque démarrage
- Retry policy augmenté à 10 tentatives

## 🔧 Étapes de redéploiement

### Sur Railway

#### Option A : Redéploiement automatique (Recommandé)
1. Commitez et pushez les changements sur GitHub :
```bash
git add backend/Dockerfile backend/railway.json GUIDE_CORRECTION_RAILWAY.md
git commit -m "fix(railway): optimisation Dockerfile et commande démarrage"
git push origin main
```

2. Railway détectera automatiquement les changements et redéploiera
3. Attendez 2-3 minutes que le build se termine

#### Option B : Redéploiement manuel
1. Allez sur Railway dashboard : https://railway.app/
2. Cliquez sur votre projet `voiture-annonces`
3. Dans l'onglet **Deployments**, cliquez sur **Deploy** (bouton violet)
4. Attendez que le build se termine

### ⚙️ Configuration Railway - Variables d'environnement essentielles

Vérifiez que ces variables sont bien configurées dans Railway :

```
✅ Obligatoires :
- DATABASE_URL (fourni automatiquement par Railway Postgres)
- JWT_SECRET
- JWT_EXPIRATION (ex: 7d)
- JWT_REFRESH_SECRET
- JWT_REFRESH_EXPIRATION (ex: 30d)
- FRONTEND_URL=https://www.annonceauto.ci
- PORT=3001

✅ Pour ImageKit :
- IMAGEKIT_PUBLIC_KEY
- IMAGEKIT_PRIVATE_KEY
- IMAGEKIT_URL_ENDPOINT

✅ Pour Google OAuth (optionnel) :
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_CALLBACK_URL

✅ Pour l'admin par défaut :
- ADMIN_EMAIL
- ADMIN_DEFAULT_PASSWORD

✅ Pour Moneroo (paiements) :
- MONEROO_PUBLIC_KEY
- MONEROO_SECRET_KEY
```

### 🔍 Vérification du déploiement

1. **Dans Railway Dashboard** :
   - Status doit être **Active** (vert)
   - Logs doivent afficher :
     ```
     🚀 [STARTUP] Début du bootstrap...
     ✅ [STARTUP] AppModule créé
     🚀 Backend démarré sur http://localhost:3001/api
     ```

2. **Test de l'API** :
   - Ouvrez : `https://api.annonceauto.ci/api/health` (ou votre URL Railway)
   - Réponse attendue : `{ "status": "ok", "database": "connected" }`

3. **Test depuis le frontend** :
   - Allez sur https://www.annonceauto.ci
   - Vérifiez que les annonces se chargent
   - Testez la connexion/inscription

## 🐛 En cas de problème persistant

### Consulter les logs Railway
```bash
# Ouvrez le terminal Railway dans le dashboard
# Ou utilisez la CLI Railway :
railway logs
```

### Erreurs courantes

#### 1. `Error: P1001: Can't reach database server`
**Cause** : DATABASE_URL invalide ou service Postgres non démarré

**Solution** :
- Vérifiez que le service Postgres est actif
- Regenerez DATABASE_URL si nécessaire
- Format attendu : `postgresql://postgres:PASSWORD@HOST:PORT/railway`

#### 2. `Error: Cannot find module './app.module'`
**Cause** : Build TypeScript incomplet

**Solution** :
- Vérifiez que `npm run build` fonctionne localement
- Supprimez `node_modules` et `dist` puis rebuild

#### 3. `CORS error` depuis le frontend
**Cause** : FRONTEND_URL mal configurée

**Solution** :
- Dans Railway Variables, vérifiez : `FRONTEND_URL=https://www.annonceauto.ci`
- Pas de slash à la fin !
- Redéployez après modification

### Commandes de diagnostic

```bash
# Tester en local (optionnel)
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start:prod
```

## 📊 Configuration Railway Settings

Dans Railway Dashboard > Settings :

### Source
- **Root Directory** : `/backend`
- **Branch** : `main`

### Deploy
- **Custom Start Command** : `npx prisma migrate deploy && node dist/src/main.js`
- **Watch Paths** : `/backend/**`

### Networking
- **Public Domain** : Ajoutez `api.annonceauto.ci` si vous avez un domaine personnalisé

## 🎯 Checklist finale

- [ ] Dockerfile mis à jour et commité
- [ ] railway.json mis à jour et commité
- [ ] Changements pushés sur GitHub
- [ ] Déploiement Railway terminé (status vert)
- [ ] Logs affichent "Backend démarré"
- [ ] URL API accessible : `https://votre-backend.railway.app/api/health`
- [ ] Frontend peut se connecter à l'API
- [ ] Tests de connexion/inscription fonctionnent

## 📞 Support

Si le problème persiste après ces étapes :
1. Copiez les logs Railway complets
2. Vérifiez toutes les variables d'environnement
3. Testez l'application en local pour isoler le problème

---

**Date de création** : 12 décembre 2025  
**Version** : 1.0

