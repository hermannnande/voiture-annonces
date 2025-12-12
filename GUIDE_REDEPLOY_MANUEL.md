# 🚀 Guide : Redéployer manuellement sur Railway

## ⚠️ Problème

Railway n'a **pas redéployé automatiquement** après le dernier push GitHub.

**Résultat** : Les corrections ne sont pas encore en production !

---

## ✅ SOLUTION : Redéploiement manuel

### **Méthode 1 : Via Railway Dashboard** (⭐ Recommandé)

#### **Étape 1 : Ouvrir Railway**
- URL : https://railway.app/
- (Déjà ouvert automatiquement)

#### **Étape 2 : Sélectionner le projet**
- Cliquez sur le projet **`voiture-annonces`**

#### **Étape 3 : Sélectionner le service backend**
- Cliquez sur le service qui contient :
  - Le domaine `api.annonceauto.ci`
  - Ou le service nommé `backend`
  - Ou celui qui affiche le Dockerfile

#### **Étape 4 : Redéployer**

**Option A** : Bouton Redeploy
- En haut à droite, cliquez sur les **3 points verticaux** ⋮
- Cliquez sur **"Redeploy"**
- Confirmez

**Option B** : Via l'onglet Deployments
- Cliquez sur l'onglet **"Deployments"**
- Cliquez sur le bouton **"Deploy"** (violet)
- Confirmez

#### **Étape 5 : Attendre**
- ⏳ Build Docker : ~3 minutes
- ⏳ Prisma db push : ~30 secondes
- ⏳ Démarrage : ~30 secondes
- **Total : ~4-5 minutes**

#### **Étape 6 : Vérifier les logs**
- Onglet **"Deployments"**
- Cliquez sur le déploiement en cours
- **Surveillez les logs** :
  - ✅ `Your database is now in sync`
  - ✅ `Generated Prisma Client`
  - ✅ `🚀 Backend démarré`

---

### **Méthode 2 : Via Railway CLI** (Avancé)

Si vous préférez la ligne de commande :

#### **Installation Railway CLI** (si pas déjà installé)

```powershell
npm install -g @railway/cli
```

#### **Connexion et déploiement**

```powershell
# Se connecter
railway login

# Lier le projet (première fois seulement)
railway link

# Déployer
railway up
```

---

## 🔧 ACTIVER LE REDÉPLOIEMENT AUTOMATIQUE

Pour éviter ce problème à l'avenir :

### **Étape 1 : Aller dans Settings**
- Railway Dashboard
- Votre service backend
- Onglet **"Settings"** ⚙️

### **Étape 2 : Vérifier la Source**

Dans la section **"Source"** ou **"GitHub Repo"** :

```
✅ Repository : hermannnande/voiture-annonces
✅ Branch : main
✅ Auto Deploy : ON (activé) ← Vérifiez ici !
```

### **Étape 3 : Activer Auto Deploy**

Si **"Auto Deploy"** est désactivé (OFF) :
- Activez-le (toggle ON)
- Sauvegardez

**Maintenant** : Chaque push vers `main` déclenchera un redéploiement automatique ! 🎉

---

## 📊 Ce qui sera déployé

Toutes les corrections d'aujourd'hui :

### 🐛 Corrections de bugs
- ✅ **Fix erreur P3009 Prisma** (db push au lieu de migrate)
- ✅ **Fix crash admin/publication** (optimisation Prisma)
- ✅ **Fix sécurité crédits** (double vérification atomique)
- ✅ **Fix erreurs TypeScript** (build)

### ✨ Nouvelles fonctionnalités
- ✅ **Kilométrage optionnel** (schema + DTO + frontend)
- ✅ **Modals professionnels** (boosts page)
- ✅ **Sessions persistantes** (refresh token automatique)

### 📝 Documentation
- ✅ 15+ guides et scripts
- ✅ Scripts de diagnostic
- ✅ Scripts de déploiement

---

## ⏰ Après le redéploiement

### **Test 1 : API Health** (2 minutes après déploiement)

```powershell
curl https://voiture-annonces-production.up.railway.app/api/health
```

**Attendu** :
```json
{
  "status": "ok",
  "database": "connected"
}
```

### **Test 2 : Connexion** (5 minutes après déploiement)

```powershell
.\test-login.ps1
```

Ou allez sur : https://www.annonceauto.ci/auth/login

**Identifiants** :
```
Email    : hermannnmande@gmail.com
Password : Nande19912012.
```

### **Test 3 : Fonctionnalités**

Une fois connecté, testez :
- ✅ Créer une annonce **sans kilométrage**
- ✅ Acheter un boost (voir les modals professionnels)
- ✅ Tester la sécurité crédits (essayer d'acheter sans solde)
- ✅ Se déconnecter/reconnecter (session persistante)

---

## 🔍 Diagnostic si problème

### Si le build échoue

**Consultez les logs** :
- Railway Dashboard
- Deployments
- Cliquez sur le déploiement échoué
- **Cherchez les erreurs en rouge**

**Erreurs possibles** :
- ❌ `P3009` (migration) → Devrait être corrigé
- ❌ `DATABASE_URL` → Vérifier variables
- ❌ `JWT_SECRET` → Vérifier variables
- ❌ Erreur TypeScript → Déjà corrigées normalement

### Si le backend crash au démarrage

**Vérifiez** :
1. Variables d'environnement (Settings > Variables)
2. Logs de démarrage
3. Connexion à la base de données

---

## 📋 Checklist

Avant de redéployer :
- ✅ Dernier commit pushé sur GitHub (`main`)
- ✅ Railway Dashboard ouvert
- ✅ Prêt à attendre 4-5 minutes
- ✅ Prêt à surveiller les logs

Après le redéploiement :
- ⏳ Attendre "Backend démarré" dans les logs
- ⏳ Tester API Health
- ⏳ Tester la connexion
- ⏳ Tester les nouvelles fonctionnalités

---

## 🎯 RÉSUMÉ

### Ce que vous devez faire maintenant

1. **Redéployer manuellement** sur Railway Dashboard
   - Projet `voiture-annonces`
   - Service backend
   - Bouton "Redeploy" ou "Deploy"

2. **Attendre 4-5 minutes**
   - Surveillez les logs
   - Cherchez "Backend démarré"

3. **Activer Auto Deploy** (pour éviter ce problème)
   - Settings > Source > Auto Deploy : ON

4. **Tester la connexion**
   - https://www.annonceauto.ci/auth/login
   - Utilisez vos identifiants

---

## 🔗 Liens directs

- **Railway Dashboard** : https://railway.app/
- **API Health** : https://voiture-annonces-production.up.railway.app/api/health
- **Connexion** : https://www.annonceauto.ci/auth/login
- **GitHub Repo** : https://github.com/hermannnande/voiture-annonces

---

**Date** : 12 décembre 2025  
**Action** : Redéploiement manuel requis  
**Durée estimée** : 5 minutes (redeploy) + 5 minutes (tests)

🚀 **Allez-y, redéployez maintenant !** 🚀

