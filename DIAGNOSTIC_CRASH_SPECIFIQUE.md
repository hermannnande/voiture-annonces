# 🚨 Diagnostic Crash lors de Connexion Admin et Publication

## 📊 Situation

Le backend Railway ne crashe PAS au démarrage, mais lors de :
1. ❌ Connexion au panneau admin (`/admin`)
2. ❌ Publication d'une annonce

## 🔍 Causes probables identifiées

### 1. Problème de connexion Base de Données (le plus probable)

#### Symptômes
- Backend démarre correctement
- API Health fonctionne
- Crash lors d'opérations complexes (jointures, transactions)

#### Causes
```
- Pool de connexions Prisma saturé
- Timeout de requêtes trop court
- Connexions PostgreSQL non fermées correctement
```

#### Solution rapide
Augmenter les limites Prisma dans `schema.prisma`

### 2. Mémoire insuffisante sur Railway

#### Symptômes
- Out of Memory (OOM)
- Killed process
- Restart automatique

#### Causes
```
- Plan Railway gratuit limité à 512MB RAM
- Requêtes lourdes (many includes, grandes images)
```

### 3. Timeout sur requêtes longues

#### Symptômes
- Timeout après 30 secondes
- Connexion admin/publication prend du temps

#### Causes
```
- Requêtes avec beaucoup de jointures
- Index manquants sur la base de données
```

## 🔧 SOLUTIONS À APPLIQUER

### Solution 1 : Optimiser Prisma (Recommandé) ⭐

Modifiez `backend/prisma/schema.prisma` :

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
  previewFeatures = ["fullTextSearch"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // ✅ Ajouter ces paramètres
  directUrl = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### Solution 2 : Augmenter le pool de connexions

Modifiez `backend/src/prisma/prisma.service.ts` :

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      // ✅ Configuration optimisée
      log: ['error', 'warn'],
      errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ [Prisma] Connexion à la base de données réussie');
    } catch (error) {
      console.error('❌ [Prisma] Erreur de connexion:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // ✅ Cleanup automatique des connexions
  async enableShutdownHooks(app: any) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

### Solution 3 : Modifier DATABASE_URL sur Railway

Ajoutez des paramètres de connexion optimisés :

```env
# Railway Variables
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/railway?connection_limit=5&pool_timeout=10&connect_timeout=30
```

**Paramètres expliqués** :
- `connection_limit=5` : Max 5 connexions simultanées
- `pool_timeout=10` : Timeout de 10 secondes pour obtenir une connexion
- `connect_timeout=30` : Timeout de 30 secondes pour se connecter

### Solution 4 : Ajouter un try/catch global

Modifiez `backend/src/admin/admin.controller.ts` :

```typescript
@Get('moderation/pending')
async getPendingListings(@Query() query: { page?: string; limit?: string }) {
  try {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '20');
    
    console.log('[Admin] Récupération des annonces en attente...');
    const result = await this.adminService.getPendingListings({ page, limit });
    console.log(`[Admin] ${result.listings.length} annonces récupérées`);
    
    return result;
  } catch (error) {
    console.error('[Admin] Erreur lors de la récupération:', error);
    throw error;
  }
}
```

### Solution 5 : Désactiver temporairement les audit logs

**✅ Déjà fait** - Je vois que c'est commenté dans le code :

```typescript
// backend/src/listings/listings.service.ts ligne 62-70
// Log d'audit (désactivé temporairement)
// await this.auditService.log({...});
```

## 🧪 TESTS À EFFECTUER

### Test 1 : Vérifier les logs Railway en temps réel

```bash
# Dans Railway CLI
railway logs --follow
```

**Ou** dans Railway Dashboard :
1. Allez sur Deployments
2. Cliquez sur le dernier déploiement
3. Consultez les logs

**Cherchez ces erreurs** :
```
❌ "Out of memory"           → Solution : Upgrade Railway plan
❌ "Connection pool timeout"  → Solution : Réduire connection_limit
❌ "Can't reach database"     → Solution : Vérifier DATABASE_URL
❌ "ECONNRESET"              → Solution : Ajouter retry logic
❌ "Process exited with code 137" → OOM Killed
```

### Test 2 : Reproduire localement

```powershell
cd backend

# Définir DATABASE_URL Railway localement
$env:DATABASE_URL="postgresql://[COPIER_DEPUIS_RAILWAY]"

# Lancer en local
npm run start:prod
```

Puis testez :
1. Connexion admin : `POST http://localhost:3001/api/auth/login`
2. Accès admin : `GET http://localhost:3001/api/admin/moderation/pending`
3. Création annonce : `POST http://localhost:3001/api/listings`

### Test 3 : Vérifier la mémoire Railway

Dans Railway Dashboard > Metrics :
- **Memory Usage** ne doit pas être > 450MB (limite 512MB)
- **CPU Usage** ne doit pas être > 90%

## 📝 SCRIPT DE CORRECTION RAPIDE

Créez `backend/fix-crash.sql` pour optimiser la base de données :

```sql
-- Créer des index pour accélérer les requêtes admin
CREATE INDEX IF NOT EXISTS idx_listings_user_status ON listings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_listings_created_status ON listings(created_at DESC, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_action ON audit_logs(actor_id, action);

-- Nettoyer les anciennes audit logs si trop nombreuses
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '30 days';

-- Vacuum pour optimiser
VACUUM ANALYZE listings;
VACUUM ANALYZE audit_logs;
VACUUM ANALYZE users;
```

Exécutez-le sur Railway :
```bash
railway run npx prisma db execute --file fix-crash.sql
```

## 🔍 CHECKLIST DE DIAGNOSTIC

### Étape 1 : Identifier l'erreur exacte

- [ ] Consulter les logs Railway
- [ ] Noter l'erreur exacte (Out of memory, timeout, etc.)
- [ ] Noter quand ça crash (connexion admin, création annonce)

### Étape 2 : Vérifier la base de données

- [ ] DATABASE_URL correcte sur Railway
- [ ] Service PostgreSQL actif
- [ ] Connexion possible depuis Railway CLI

### Étape 3 : Vérifier les ressources

- [ ] Memory Usage < 450MB
- [ ] CPU Usage < 90%
- [ ] Nombre de connexions DB < 10

### Étape 4 : Appliquer les corrections

- [ ] Modifier DATABASE_URL avec paramètres de connexion
- [ ] Modifier PrismaService avec configuration optimisée
- [ ] Ajouter try/catch dans controllers critiques
- [ ] Créer index sur la base de données

### Étape 5 : Redéployer et tester

- [ ] Commit et push les changements
- [ ] Attendre le redéploiement
- [ ] Tester connexion admin
- [ ] Tester création annonce

## 🚨 SI RIEN NE FONCTIONNE

### Option A : Upgrade Railway Plan

Le plan gratuit Railway (512MB RAM) peut être insuffisant.

**Upgrade vers Hobby ($5/mois)** :
- 512MB → 8GB RAM
- Plus de CPU
- Plus de déploiements

### Option B : Migrer vers un autre service

Alternatives gratuites :
1. **Render.com** (512MB gratuit)
2. **Fly.io** (256MB gratuit mais meilleure performance)
3. **Heroku** (512MB gratuit via GitHub Student Pack)

### Option C : Optimiser drastiquement

1. **Désactiver tous les includes inutiles**
2. **Paginer TOUTES les requêtes**
3. **Ajouter un cache Redis**
4. **Lazy load les relations Prisma**

## 📊 MODIFICATIONS PRIORITAIRES

### 🔴 URGENT (Maintenant)

1. **Modifier DATABASE_URL** avec paramètres de connexion
2. **Consulter les logs Railway** pour identifier l'erreur exacte
3. **Ajouter console.log** dans les endpoints critiques

### 🟡 IMPORTANT (Aujourd'hui)

1. **Optimiser PrismaService** avec configuration avancée
2. **Créer des index** sur la base de données
3. **Ajouter try/catch** dans tous les controllers

### 🟢 MOYEN TERME (Cette semaine)

1. **Implémenter un cache Redis** pour réduire les requêtes DB
2. **Paginer toutes les réponses** (max 20 items par page)
3. **Lazy load** les relations Prisma

---

## 🎯 ACTIONS IMMÉDIATES

### 1. Récupérez les logs Railway

```powershell
# Ouvrez PowerShell et exécutez :
railway login
railway link
railway logs > crash-logs.txt
```

**Ou manuellement** :
1. Railway Dashboard > Deployments > View Logs
2. Copiez les dernières 100 lignes
3. Cherchez "Error", "crash", "killed", "OOM"

### 2. Modifiez DATABASE_URL

1. Railway Dashboard > Variables
2. Cliquez sur DATABASE_URL > Edit
3. Ajoutez à la fin :
```
?connection_limit=5&pool_timeout=10&connect_timeout=30
```
4. Save et Redeploy

### 3. Testez immédiatement

Après redéploiement :
1. Testez connexion admin
2. Testez création annonce
3. Surveillez les logs en temps réel

---

**Date** : 12 décembre 2025  
**Priorité** : 🔴 CRITIQUE  
**Temps estimé** : 15-30 minutes

