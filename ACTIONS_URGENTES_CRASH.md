# 🚨 ACTIONS URGENTES - Crash Admin/Publication

## ⚡ RÉSUMÉ 3 MINUTES

Votre backend crash lors de :
- ❌ Connexion au panneau admin
- ❌ Publication d'une annonce

**Cause probable** : Pool de connexions Prisma saturé ou timeout de requêtes

---

## 🎯 SOLUTION RAPIDE (5 MINUTES)

### Étape 1 : Modifier DATABASE_URL sur Railway (2 min)

1. **Allez sur Railway Dashboard**
   - https://railway.app/
   - Sélectionnez votre projet

2. **Cliquez sur Variables**

3. **Trouvez DATABASE_URL**
   - Cliquez sur les 3 points (...) > **Edit**

4. **Ajoutez ces paramètres à la fin de l'URL** :
   ```
   ?connection_limit=5&pool_timeout=10&connect_timeout=30
   ```

   **Avant** :
   ```
   postgresql://postgres:PASSWORD@HOST:5432/railway
   ```

   **Après** :
   ```
   postgresql://postgres:PASSWORD@HOST:5432/railway?connection_limit=5&pool_timeout=10&connect_timeout=30
   ```

5. **Save** et **Redeploy**

---

### Étape 2 : Commit et Push les optimisations (1 min)

Les fichiers suivants ont été optimisés :
- ✅ `backend/src/prisma/prisma.service.ts` - Retry logic + requêtes lentes
- ✅ `backend/src/main.ts` - Shutdown hooks activés

**Exécutez ce script PowerShell** :

```powershell
.\fix-crash-admin.ps1
```

**OU manuellement** :

```powershell
git add backend/src/prisma/prisma.service.ts backend/src/main.ts DIAGNOSTIC_CRASH_SPECIFIQUE.md fix-crash-admin.ps1 ACTIONS_URGENTES_CRASH.md
git commit -m "fix(backend): optimisation Prisma - crash admin/publication"
git push origin main
```

---

### Étape 3 : Attendre et tester (3 min)

1. **Attendez le redéploiement Railway** (3-5 minutes)
   - Surveillez le status : Railway > Deployments

2. **Testez la connexion admin**
   - Allez sur : `https://www.annonceauto.ci/admin`
   - Connectez-vous avec les identifiants admin

3. **Testez la création d'annonce**
   - Allez sur : `https://www.annonceauto.ci/dashboard/listings/new`
   - Créez une annonce test

4. **Vérifiez les logs**
   - Railway Dashboard > Logs
   - Cherchez : `✅ Connexion à la base de données réussie`
   - Vérifiez qu'il n'y a pas de crash

---

## 🔍 CE QUI A ÉTÉ OPTIMISÉ

### 1. PrismaService avec Retry Logic

```typescript
// ✅ AVANT : Connexion simple qui peut échouer
await this.$connect();

// ✅ APRÈS : Retry logic avec 3 tentatives
let retries = 3;
while (retries > 0) {
  try {
    await this.$connect();
    break;
  } catch (error) {
    retries--;
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}
```

### 2. Logger des requêtes lentes

```typescript
// ✅ Middleware pour identifier les requêtes problématiques
this.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;

  if (duration > 1000) {
    logger.warn(`⚠️  Requête lente: ${params.model}.${params.action} - ${duration}ms`);
  }

  return result;
});
```

### 3. Shutdown Hooks

```typescript
// ✅ Cleanup automatique des connexions lors de l'arrêt
const prismaService = app.get(PrismaService);
await prismaService.enableShutdownHooks(app);
```

### 4. DATABASE_URL optimisée

```
?connection_limit=5       → Max 5 connexions simultanées
&pool_timeout=10          → 10s pour obtenir une connexion
&connect_timeout=30       → 30s pour se connecter
```

---

## 📊 VÉRIFICATIONS APRÈS DÉPLOIEMENT

### ✅ Checklist

- [ ] **DATABASE_URL modifiée** avec paramètres de connexion
- [ ] **Code optimisé commité** et pushé sur GitHub
- [ ] **Railway redéployé** (status vert)
- [ ] **Logs affichent** "✅ Connexion à la base de données réussie"
- [ ] **Connexion admin fonctionne** sans crash
- [ ] **Création d'annonce fonctionne** sans crash
- [ ] **Pas de requêtes lentes** dans les logs (>1s)

### 🔍 Logs à surveiller

**Dans Railway Logs, cherchez** :

#### ✅ Logs positifs
```
✅ [STARTUP] AppModule créé
✅ [STARTUP] Prisma shutdown hooks activés
✅ Connexion à la base de données réussie
🚀 Backend démarré sur http://localhost:3001/api
```

#### ❌ Erreurs à éviter
```
❌ "Out of memory"
❌ "Connection pool timeout"
❌ "Can't reach database"
❌ "Process exited with code 137" (OOM Killed)
❌ "⚠️  Requête lente" (si fréquent)
```

---

## 🐛 SI LE PROBLÈME PERSISTE

### Problème 1 : Toujours des crashes

**Solutions supplémentaires** :

1. **Réduire le connection_limit**
   ```
   connection_limit=3  (au lieu de 5)
   ```

2. **Désactiver complètement les audit logs**
   - Déjà fait dans le code (commentés)

3. **Ajouter plus de logging**
   ```typescript
   // Dans admin.controller.ts
   @Get('moderation/pending')
   async getPendingListings() {
     console.log('[Admin] Début récupération annonces...');
     const result = await this.adminService.getPendingListings();
     console.log('[Admin] Fin récupération - OK');
     return result;
   }
   ```

### Problème 2 : Out of Memory (OOM)

**Symptômes** :
- Process killed (exit code 137)
- Memory usage > 450MB

**Solutions** :

1. **Upgrade Railway Plan** ($5/mois)
   - 512MB → 8GB RAM
   - Plus stable pour production

2. **Optimiser les requêtes**
   - Réduire les `include` dans Prisma
   - Paginer toutes les listes (max 20 items)

3. **Ajouter un cache**
   - Redis pour cacher les résultats fréquents

### Problème 3 : Requêtes trop lentes

**Si vous voyez souvent** :
```
⚠️  Requête lente: Listing.findMany - 3500ms
```

**Solutions** :

1. **Créer des index sur la base de données**
   ```sql
   CREATE INDEX idx_listings_status ON listings(status);
   CREATE INDEX idx_listings_created ON listings(created_at DESC);
   ```

2. **Réduire les includes**
   ```typescript
   // ❌ AVANT : Trop d'includes
   include: {
     brand: true,
     model: true,
     category: true,
     user: true,
     images: true
   }

   // ✅ APRÈS : Seulement le nécessaire
   select: {
     id: true,
     title: true,
     priceFcfa: true,
     brand: { select: { name: true } },
     images: { select: { url: true }, take: 1 }
   }
   ```

---

## 📞 COMMANDES UTILES

### Consulter les logs en temps réel

```powershell
# Avec Railway CLI
railway login
railway link
railway logs --follow
```

### Tester l'API localement

```powershell
cd backend
$env:DATABASE_URL="postgresql://[COPIER_DEPUIS_RAILWAY]"
npm run start:prod
```

### Vérifier la mémoire Railway

```powershell
# Dans Railway CLI
railway status
```

### Rollback si nécessaire

```powershell
# Revenir au commit précédent
git revert HEAD
git push origin main
```

---

## 🎯 TIMELINE

| Étape | Durée | Action |
|-------|-------|--------|
| 1 | 2 min | Modifier DATABASE_URL sur Railway |
| 2 | 1 min | Commit et push optimisations |
| 3 | 3-5 min | Attendre redéploiement Railway |
| 4 | 2 min | Tester admin + publication |
| 5 | 1 min | Vérifier logs |
| **TOTAL** | **10 min** | |

---

## 📚 DOCUMENTATION COMPLÈTE

Pour aller plus loin :
- **DIAGNOSTIC_CRASH_SPECIFIQUE.md** - Diagnostic détaillé avec toutes les solutions
- **DEMARRAGE_ICI.md** - Guide général de démarrage
- **VERIFICATION_RAPIDE.md** - Checklist complète de tests

---

**Date** : 12 décembre 2025  
**Priorité** : 🔴 CRITIQUE  
**Difficulté** : ⭐⭐⭐ Moyen  
**Temps estimé** : 10 minutes

