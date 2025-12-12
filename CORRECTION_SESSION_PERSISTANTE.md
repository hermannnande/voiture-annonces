# 🔐 Correction - Sessions persistantes après redéploiement

## 🎯 Problème

Les utilisateurs sont **déconnectés à chaque redéploiement** du backend !

### Causes
1. ❌ JWT_SECRET change à chaque déploiement → tokens invalides
2. ❌ Pas de refresh automatique des tokens
3. ❌ Durée de vie trop courte des tokens
4. ❌ Pas de vérification des secrets avant déploiement

---

## ✅ Solutions appliquées

### 1. Vérifier que les secrets Railway sont FIXES

**Variables d'environnement Railway** (NE JAMAIS CHANGER) :

```env
JWT_SECRET=votre-secret-fixe-32-caracteres-minimum
JWT_REFRESH_SECRET=autre-secret-fixe-different-32-caracteres
JWT_EXPIRATION=30d
JWT_REFRESH_EXPIRATION=90d
```

⚠️ **CRITIQUE** : Ces valeurs doivent rester **identiques** entre les déploiements !

### 2. Durées de validité augmentées

**Déjà configuré** dans le code :
- ✅ Access Token : 30 jours (au lieu de 15 minutes)
- ✅ Refresh Token : 90 jours (au lieu de 7 jours)

### 3. Amélioration du système de refresh automatique

**Frontend** - Refresh automatique avant expiration

---

## 🔧 Modifications à appliquer

### Frontend - Refresh automatique des tokens

Fichier : `frontend/src/lib/api.ts`

**AVANT** (refresh seulement après erreur 401) :
```typescript
// Refresh seulement quand le token est déjà expiré
if (error.response?.status === 401) {
  // Trop tard ! L'utilisateur voit une erreur
}
```

**APRÈS** (refresh proactif avant expiration) :
```typescript
// Vérifier si le token va expirer bientôt
const tokenExpiry = getTokenExpiry();
if (tokenExpiry - Date.now() < 5 minutes) {
  // Refresh avant qu'il expire !
  await refreshToken();
}
```

---

## 📝 Checklist de vérification

### Sur Railway Dashboard

1. **Allez sur Railway > Variables**

2. **Vérifiez ces variables** :

```
JWT_SECRET                 → [Valeur fixe, ne doit JAMAIS changer]
JWT_REFRESH_SECRET         → [Valeur fixe, ne doit JAMAIS changer]
JWT_EXPIRATION            → 30d
JWT_REFRESH_EXPIRATION    → 90d
```

3. **Si JWT_SECRET n'existe pas** :

```powershell
# Générer un secret sécurisé (sur votre PC)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Puis copiez la valeur générée dans Railway Variables.

4. **IMPORTANT** : Notez ces valeurs quelque part de sécurisé !

---

## 🚀 Amélioration - Refresh proactif

### Modification du frontend

Fichier : `frontend/src/lib/api.ts`

Ajouter un intercepteur qui vérifie l'expiration AVANT chaque requête :

```typescript
// Intercepteur AVANT la requête
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // Décoder le token pour vérifier l'expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000; // Convertir en ms
        const now = Date.now();
        
        // Si le token expire dans moins de 5 minutes, le refresh
        if (expiryTime - now < 5 * 60 * 1000) {
          console.log('⏰ Token va expirer, refresh automatique...');
          await refreshTokens();
          
          // Utiliser le nouveau token
          const newToken = localStorage.getItem('accessToken');
          config.headers.Authorization = `Bearer ${newToken}`;
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonction de refresh
async function refreshTokens() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }

    console.log('✅ Token refreshed automatiquement');
  } catch (error) {
    // Échec du refresh, déconnecter
    localStorage.clear();
    window.location.href = '/auth/login';
    throw error;
  }
}
```

---

## 🔍 Vérification des secrets Railway

### Script de vérification automatique

Fichier : `verify-jwt-secrets.ps1`

```powershell
# Vérifier que les JWT secrets sont configurés sur Railway
Write-Host "Vérification des JWT secrets Railway..." -ForegroundColor Cyan

railway login
railway link

$env:JWT_SECRET = railway variables get JWT_SECRET
$env:JWT_REFRESH_SECRET = railway variables get JWT_REFRESH_SECRET

if (!$env:JWT_SECRET) {
    Write-Host "❌ JWT_SECRET manquant sur Railway !" -ForegroundColor Red
    Write-Host "Générez-en un :" -ForegroundColor Yellow
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
} else {
    Write-Host "✅ JWT_SECRET configuré" -ForegroundColor Green
}

if (!$env:JWT_REFRESH_SECRET) {
    Write-Host "❌ JWT_REFRESH_SECRET manquant sur Railway !" -ForegroundColor Red
    Write-Host "Générez-en un :" -ForegroundColor Yellow
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
} else {
    Write-Host "✅ JWT_REFRESH_SECRET configuré" -ForegroundColor Green
}
```

---

## 📊 Comparaison Avant/Après

| Problème | Avant | Après |
|----------|-------|-------|
| Durée access token | 15 min | 30 jours ✅ |
| Durée refresh token | 7 jours | 90 jours ✅ |
| Refresh automatique | ❌ Non | ✅ Oui (proactif) |
| Déconnexion après redéploiement | ✅ Oui | ❌ Non |
| Vérification des secrets | ❌ Non | ✅ Oui |
| Refresh avant expiration | ❌ Non | ✅ 5 min avant |

---

## 🧪 Tests

### Test 1 : Token longue durée
1. Se connecter
2. Attendre 24 heures
3. **Attendu** : Toujours connecté (token valide 30 jours)

### Test 2 : Redéploiement backend
1. Se connecter
2. Redéployer Railway
3. Rafraîchir la page
4. **Attendu** : Toujours connecté (secrets identiques)

### Test 3 : Refresh automatique
1. Se connecter
2. Modifier le token pour qu'il expire dans 4 minutes
3. Faire une requête
4. **Attendu** : Token refreshé automatiquement

---

## 🔒 Sécurité

### Bonnes pratiques

✅ **À FAIRE** :
- Stocker JWT_SECRET de manière sécurisée (Railway Variables)
- Ne JAMAIS commiter les secrets dans Git
- Utiliser des secrets différents pour dev/prod
- Générer des secrets longs (32+ caractères)
- Garder une backup des secrets

❌ **À NE PAS FAIRE** :
- Changer JWT_SECRET en production (déconnecte tout le monde)
- Utiliser des secrets courts ou prévisibles
- Partager les secrets publiquement
- Utiliser le même secret pour access et refresh

---

## 📝 Commandes utiles

### Générer un nouveau secret (UNIQUEMENT pour nouveau projet)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Vérifier les variables Railway

```bash
railway variables
```

### Backup des secrets (LOCAL SEULEMENT)

```bash
# NE PAS commiter ce fichier !
railway variables > .secrets.backup.txt
```

---

## 🎯 Récapitulatif

### Ce qui garde les utilisateurs connectés

1. ✅ **JWT_SECRET fixe** sur Railway (ne change jamais)
2. ✅ **Tokens longue durée** (30 jours access, 90 jours refresh)
3. ✅ **Refresh automatique** avant expiration (5 min avant)
4. ✅ **Refresh tokens** en base de données
5. ✅ **Intercepteur intelligent** qui refresh proactivement

### Résultat

- ✅ Utilisateurs restent connectés même après redéploiement
- ✅ Pas de déconnexion surprise
- ✅ Expérience utilisateur fluide
- ✅ Sécurité maintenue

---

**Date** : 12 décembre 2025  
**Priorité** : 🟡 Important  
**Type** : UX + Security

