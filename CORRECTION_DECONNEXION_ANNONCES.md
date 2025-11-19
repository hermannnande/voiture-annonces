# 🔧 Correction - Annonces et Déconnexion

## ✅ Problèmes Identifiés et Corrigés

### 1. ❌ Problème : Les annonces ne s'affichent plus

**Cause** : Erreur `TypeError: Do not know how to serialize a BigInt`

Les boosts contiennent des champs BigInt (`paymentAmount`, `priceFcfa`, `creditsCost`) qui ne sont pas convertis en string avant d'être envoyés au frontend.

**Solution Appliquée** ✅ :
- Modifié `backend/src/listings/listings.service.ts`
- Ajouté la conversion BigInt → string dans `formatListing()`
- Backend redémarré

**Fichier modifié** : `backend/src/listings/listings.service.ts`

```typescript
private formatListing(listing: any) {
  return {
    ...listing,
    priceFcfa: listing.priceFcfa?.toString(),
    boosts: listing.boosts?.map((boost: any) => ({
      ...boost,
      paymentAmount: boost.paymentAmount?.toString(),
      boostProduct: boost.boostProduct ? {
        ...boost.boostProduct,
        priceFcfa: boost.boostProduct.priceFcfa?.toString(),
        creditsCost: boost.boostProduct.creditsCost?.toString(),
      } : undefined,
    })),
  };
}
```

---

### 2. ❌ Problème : Déconnexion automatique lors d'actions

**Causes identifiées** :

1. **Token JWT expire trop vite** : 15 minutes par défaut
2. **Erreurs API** causent des redirections vers /login
3. **Refresh token** peut ne pas fonctionner correctement

**Solutions** :

#### Solution 1 : Augmenter la durée du token JWT ✅

**Fichier à modifier** : `backend/.env`

```env
# JWT Configuration
JWT_SECRET=votre_secret_ici
JWT_EXPIRATION=24h           # ← CHANGER ICI (au lieu de 15m)
JWT_REFRESH_SECRET=votre_refresh_secret_ici
JWT_REFRESH_EXPIRATION=7d
```

**Durées recommandées** :
- **Développement** : `JWT_EXPIRATION=24h` ou `JWT_EXPIRATION=7d`
- **Production** : `JWT_EXPIRATION=1h` avec refresh token automatique

---

#### Solution 2 : Vérifier le fichier .env backend

**Exécuter dans PowerShell** :

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"
docker exec voiture_backend cat /app/.env | Select-String "JWT"
```

**Résultat attendu** :
```
JWT_SECRET=...
JWT_EXPIRATION=24h          # ← Doit être > 15m
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRATION=7d
```

**Si JWT_EXPIRATION n'existe pas** :
1. Ouvrir `backend/.env`
2. Ajouter la ligne : `JWT_EXPIRATION=24h`
3. Redémarrer le backend : `docker-compose restart backend`

---

#### Solution 3 : Vider le cache navigateur

Les anciens tokens peuvent causer des problèmes :

1. **Ouvrir les outils de développement** : `F12`
2. **Aller dans "Application"** (Chrome) ou "Stockage" (Firefox)
3. **Supprimer** :
   - localStorage → `accessToken`
   - localStorage → `refreshToken`
   - localStorage → `auth-storage`
4. **Fermer tous les onglets** du site
5. **Se reconnecter**

**OU via Console (F12)** :
```javascript
localStorage.clear();
location.reload();
```

---

## 🧪 Tests de Vérification

### Test 1 : Annonces Affichées (30 secondes)

1. **Aller sur** : http://localhost:3000/listings

2. ✅ **Résultat attendu** :
   - Les annonces s'affichent normalement
   - Badges visibles ("📌 Épinglé", "Neuf", "Occasion")
   - Pas d'erreur dans la console (F12)

3. **Si ça ne marche toujours pas** :
   - Ouvrir la console (F12)
   - Chercher des erreurs rouges
   - Vérifier les logs backend :
     ```powershell
     docker-compose logs backend --tail=30
     ```

---

### Test 2 : Plus de Déconnexion (2 minutes)

1. **Se connecter** :
   ```
   Email: vendeur1@gmail.com
   Mot de passe: seller123
   ```

2. **Effectuer plusieurs actions** :
   - Cliquer sur "Mes Annonces"
   - Cliquer sur "Mon Wallet"
   - Créer une annonce (brouillon)
   - Cliquer sur "Dashboard"

3. ✅ **Résultat attendu** :
   - **Vous restez connecté** après chaque action
   - Votre nom reste visible en haut à droite
   - Pas de redirection vers `/auth/login`

4. **Attendre 5-10 minutes** sans rien faire

5. **Effectuer une action** (ex: cliquer sur "Dashboard")

6. ✅ **Résultat attendu** :
   - **Toujours connecté** (si JWT_EXPIRATION > 10 min)
   - Ou **refresh automatique** si < 10 min

---

### Test 3 : Créer une Annonce (1 minute)

1. **Aller sur** : http://localhost:3000/dashboard/listings/create

2. **Remplir le formulaire** :
   - Titre : "Test Déconnexion"
   - Marque : Toyota
   - Modèle : Corolla
   - Etc.

3. **Cliquer sur "Publier"**

4. ✅ **Résultat attendu** :
   - **Annonce créée avec succès**
   - **Vous restez connecté**
   - Redirection vers "Mes Annonces"
   - Nouvelle annonce visible

---

## 🔧 Actions Correctives

### Si les annonces ne s'affichent toujours pas

**Vérifier les logs backend** :
```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"
docker-compose logs backend --tail=50 | Select-String "BigInt|ERROR"
```

**Si vous voyez "BigInt"** :
```powershell
# Redémarrer le backend
docker-compose restart backend

# Attendre 5 secondes
Start-Sleep -Seconds 5

# Vérifier que ça a démarré
docker-compose ps
```

---

### Si vous êtes toujours déconnecté automatiquement

#### Option A : Augmenter JWT_EXPIRATION

**Étapes** :

1. **Arrêter les services** :
   ```powershell
   docker-compose down
   ```

2. **Modifier `backend/.env`** :
   - Ouvrir le fichier
   - Trouver ou ajouter : `JWT_EXPIRATION=24h`
   - Sauvegarder

3. **Redémarrer** :
   ```powershell
   docker-compose up -d
   ```

4. **Attendre que les services soient prêts** :
   ```powershell
   Start-Sleep -Seconds 10
   docker-compose ps
   ```

5. **Vider le cache navigateur** et se reconnecter

---

#### Option B : Activer les logs de debug

**Modifier `frontend/src/lib/api.ts`** :

Ajouter après la ligne 23 :

```typescript
// Intercepteur pour gérer le refresh du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('❌ Erreur API:', error.response?.status, error.config?.url); // ← AJOUTER
    const originalRequest = error.config;
    // ... reste du code
```

Cela affichera dans la console (F12) les erreurs API qui causent la déconnexion.

---

## 📊 Configuration Recommandée

### Pour le Développement

**`backend/.env`** :
```env
JWT_SECRET=dev_secret_change_me_in_production
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=dev_refresh_secret_change_me_in_production
JWT_REFRESH_EXPIRATION=7d
```

### Pour la Production

**`backend/.env`** :
```env
JWT_SECRET=<secret_fort_aléatoire>
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=<autre_secret_fort>
JWT_REFRESH_EXPIRATION=7d
```

---

## ✅ Checklist de Vérification

Après avoir appliqué les corrections :

- [ ] Backend redémarré sans erreur
- [ ] Les annonces s'affichent sur `/listings`
- [ ] Les badges sont visibles
- [ ] Pas d'erreur "BigInt" dans les logs
- [ ] Je peux me connecter
- [ ] Je reste connecté après plusieurs actions
- [ ] Je peux créer une annonce sans être déconnecté
- [ ] Je peux naviguer entre les pages sans déconnexion
- [ ] Le token dure plus de 15 minutes

---

## 🚨 Si Rien ne Fonctionne

### Reset Complet

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"

# Arrêter tout
docker-compose down

# Supprimer les volumes (ATTENTION : efface les données)
docker-compose down -v

# Rebuild complet
docker-compose build --no-cache backend frontend

# Redémarrer
docker-compose up -d

# Attendre
Start-Sleep -Seconds 15

# Vérifier
docker-compose ps
docker-compose logs backend --tail=20
docker-compose logs frontend --tail=20

# Reseed la base de données
docker exec voiture_backend npx prisma db seed
```

---

## 📞 Débogage Avancé

### Vérifier le Token dans le Navigateur

1. **Ouvrir la console (F12)**
2. **Taper** :
   ```javascript
   console.log('Access Token:', localStorage.getItem('accessToken'));
   console.log('Refresh Token:', localStorage.getItem('refreshToken'));
   ```

3. **Vérifier** :
   - Les tokens ne doivent pas être `null`
   - Ils doivent ressembler à : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Vérifier l'Expiration du Token

1. **Copier votre Access Token**
2. **Aller sur** : https://jwt.io
3. **Coller le token**
4. **Vérifier le champ `exp`** (timestamp d'expiration)
5. **Calculer** : Si `exp` est proche de `Date.now() / 1000`, le token est expiré

---

## 🎉 Résumé des Corrections

| Problème | Cause | Solution | Statut |
|----------|-------|----------|--------|
| **Annonces non affichées** | BigInt non sérialisé | Ajout conversion dans `formatListing()` | ✅ Corrigé |
| **Déconnexion auto** | JWT expire trop vite (15m) | Augmenter `JWT_EXPIRATION=24h` | ⚠️ À configurer |
| **Token refresh** | Peut échouer | Vider cache navigateur | ⚠️ Si nécessaire |

---

## 📚 Documentation

- **Backend JWT** : `backend/src/auth/auth.module.ts`
- **Frontend API** : `frontend/src/lib/api.ts`
- **AuthStore** : `frontend/src/stores/authStore.ts`

---

**Après avoir appliqué ces corrections, testez pendant 10-15 minutes pour vérifier que vous restez bien connecté !** 🚀




