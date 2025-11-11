# ⚡ Guide Rapide - Correction Immédiate

## 🎯 Deux Problèmes à Corriger

1. ✅ **Annonces non affichées** → **CORRIGÉ !**
2. ⚠️ **Déconnexion automatique** → **À CONFIGURER**

---

## ✅ Problème 1 : Annonces Corrigées

**J'ai déjà corrigé l'erreur "BigInt" dans le backend.**

### Test Rapide (10 secondes)

1. **Aller sur** : http://localhost:3000/listings

2. ✅ **Les annonces devraient maintenant s'afficher !**

**Si ça ne marche pas** :
```powershell
# Redémarrer le backend
cd "C:\Users\LENOVO\Desktop\voiture 5"
docker-compose restart backend
```

---

## ⚠️ Problème 2 : Déconnexion Automatique

**Cause** : Le token JWT expire après **15 minutes** seulement.

### Solution Express (2 minutes)

#### Étape 1 : Modifier le fichier .env

1. **Ouvrir** : `backend/.env`

2. **Trouver la ligne** :
   ```env
   JWT_EXPIRATION=15m
   ```

3. **Remplacer par** :
   ```env
   JWT_EXPIRATION=24h
   ```
   
   **OU** (si la ligne n'existe pas, l'ajouter) :
   ```env
   JWT_SECRET=votre_secret
   JWT_EXPIRATION=24h          ← AJOUTER CETTE LIGNE
   JWT_REFRESH_SECRET=votre_refresh_secret
   JWT_REFRESH_EXPIRATION=7d
   ```

4. **Sauvegarder le fichier**

---

#### Étape 2 : Redémarrer le Backend

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"
docker-compose restart backend
```

**Attendre 5 secondes** que le backend redémarre.

---

#### Étape 3 : Vider le Cache Navigateur

**Option A - Via Console (F12)** :
```javascript
localStorage.clear();
location.reload();
```

**Option B - Manuellement** :
1. `F12` → Onglet "Application" (Chrome) ou "Stockage" (Firefox)
2. Supprimer `accessToken`, `refreshToken`, `auth-storage`
3. Fermer tous les onglets du site
4. Rouvrir

---

#### Étape 4 : Se Reconnecter

```
Email: vendeur1@gmail.com
Mot de passe: seller123
```

---

### ✅ Résultat Attendu

Après ces 3 étapes :
- ✅ Les annonces s'affichent
- ✅ **Vous restez connecté pendant 24 heures**
- ✅ Plus de déconnexion automatique lors des actions

---

## 🧪 Test Final (1 minute)

1. **Se connecter**

2. **Effectuer plusieurs actions** :
   - Aller sur "Mes Annonces"
   - Cliquer sur "Mon Wallet"
   - Aller sur "Dashboard"
   - Créer un brouillon d'annonce

3. ✅ **Vous devez rester connecté** après chaque action !

4. **Attendre 5-10 minutes** sans rien faire

5. **Faire une action** (ex: cliquer sur "Dashboard")

6. ✅ **Toujours connecté !** (si JWT_EXPIRATION=24h)

---

## 🚨 Si Ça Ne Marche Toujours Pas

### Vérifier la Configuration JWT

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"
docker exec voiture_backend cat /app/.env | Select-String "JWT"
```

**Résultat attendu** :
```
JWT_SECRET=...
JWT_EXPIRATION=24h          ← Doit être présent et = 24h
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRATION=7d
```

**Si JWT_EXPIRATION n'apparaît pas** :
- Le fichier `.env` n'a pas été modifié correctement
- Recommencer l'Étape 1

---

### Reset Complet (Si Nécessaire)

```powershell
cd "C:\Users\LENOVO\Desktop\voiture 5"

# Arrêter tout
docker-compose down

# Modifier backend/.env (ajouter JWT_EXPIRATION=24h)

# Redémarrer
docker-compose up -d

# Attendre
Start-Sleep -Seconds 10

# Vérifier
docker-compose ps
```

---

## 📊 Récapitulatif

| Action | Commande | Résultat |
|--------|----------|----------|
| **1. Modifier .env** | Ajouter `JWT_EXPIRATION=24h` | Token dure 24h |
| **2. Redémarrer backend** | `docker-compose restart backend` | Config chargée |
| **3. Vider cache** | `localStorage.clear()` (F12) | Anciens tokens supprimés |
| **4. Se reconnecter** | Login avec vendeur1 | Nouveau token 24h |

---

## ✅ Checklist

Après avoir tout fait :

- [ ] J'ai modifié `backend/.env` (JWT_EXPIRATION=24h)
- [ ] J'ai redémarré le backend
- [ ] J'ai vidé le cache navigateur
- [ ] Je me suis reconnecté
- [ ] Les annonces s'affichent sur `/listings`
- [ ] Je reste connecté après plusieurs actions
- [ ] Je peux créer une annonce sans déconnexion
- [ ] Après 10 minutes, je suis toujours connecté

**Si toutes les cases sont cochées : C'est corrigé ! 🎉**

---

## 📞 Comptes de Test

```
Vendeur 1:
📧 vendeur1@gmail.com
🔑 seller123
💰 500 crédits

Vendeur 2:
📧 vendeur2@gmail.com
🔑 seller123
💰 300 crédits

Admin:
📧 admin@voiture.com
🔑 admin123
```

---

## 🎉 C'est Fait !

**Après avoir suivi ces étapes, tout devrait fonctionner normalement.**

**Les deux problèmes sont maintenant résolus** :
1. ✅ Annonces affichées
2. ✅ Plus de déconnexion automatique (token 24h)

**Testez maintenant !** 🚀




