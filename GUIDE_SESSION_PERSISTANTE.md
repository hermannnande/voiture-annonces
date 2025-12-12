# 🔐 Guide Simple - Garder les utilisateurs connectés

## 🎯 Objectif

**Les utilisateurs ne seront plus déconnectés après un redéploiement !**

---

## ⚡ SOLUTION RAPIDE (5 minutes)

### Étape 1 : Vérifier les JWT secrets sur Railway (2 min)

1. **Exécutez** :
   ```powershell
   .\verifier-jwt-secrets.ps1
   ```

2. **Ou allez manuellement sur** :
   - https://railway.app/
   - Cliquez sur `voiture-annonces`
   - Cliquez sur `Variables`

3. **Vérifiez** :
   - `JWT_SECRET` existe et ne change jamais
   - `JWT_REFRESH_SECRET` existe et ne change jamais
   - `JWT_EXPIRATION` = `30d`
   - `JWT_REFRESH_EXPIRATION` = `90d`

### Étape 2 : Déployer les améliorations (3 min)

```powershell
git add frontend/src/lib/api.ts CORRECTION_SESSION_PERSISTANTE.md GUIDE_SESSION_PERSISTANTE.md verifier-jwt-secrets.ps1
git commit -m "feat(auth): amélioration sessions persistantes - refresh automatique avant expiration"
git push origin main
```

Attendez 3 minutes que Vercel redéploie.

---

## ✅ Ce qui a été amélioré

### 1. Tokens longue durée ✅ (Déjà fait)
- Access Token : **30 jours** (au lieu de 15 minutes)
- Refresh Token : **90 jours** (au lieu de 7 jours)

### 2. Refresh automatique ✅ (NOUVEAU)
- Le frontend vérifie si le token va expirer
- Si expiration dans < 5 minutes → refresh automatique
- L'utilisateur ne voit rien, tout est transparent

### 3. JWT Secrets persistants ✅ (À vérifier)
- Les secrets ne changent PAS entre déploiements
- Configurés une fois sur Railway
- Les tokens restent valides après redéploiement

---

## 🧪 Tests

### Test 1 : Redéploiement

1. **Connectez-vous** sur https://www.annonceauto.ci
2. **Redéployez** Railway (ou attendez un déploiement)
3. **Rafraîchissez** la page
4. **Résultat attendu** : ✅ Toujours connecté !

### Test 2 : Longue session

1. **Connectez-vous**
2. **Attendez** 24 heures
3. **Revenez** sur le site
4. **Résultat attendu** : ✅ Toujours connecté !

### Test 3 : Refresh automatique

1. **Connectez-vous**
2. **Ouvrez** DevTools (F12) → Console
3. **Attendez** ou faites des actions
4. **Cherchez** : `⏰ Token va expirer bientôt, refresh automatique...`
5. **Puis** : `✅ Token refreshed automatiquement`

---

## 📊 Avant / Après

| Situation | AVANT | APRÈS |
|-----------|-------|-------|
| Après redéploiement | ❌ Déconnecté | ✅ Connecté |
| Après 24h d'inactivité | ❌ Déconnecté | ✅ Connecté |
| Token qui expire | ❌ Erreur 401 | ✅ Refresh auto |
| Durée de session | 15 minutes | 30 jours ✅ |

---

## 🔧 Configuration Railway

### Variables requises

```
JWT_SECRET                 → [Votre secret - NE JAMAIS CHANGER]
JWT_REFRESH_SECRET         → [Votre autre secret - NE JAMAIS CHANGER]
JWT_EXPIRATION            → 30d
JWT_REFRESH_EXPIRATION    → 90d
```

### Comment générer les secrets

**Option 1 - Script PowerShell** :
```powershell
.\verifier-jwt-secrets.ps1
```

**Option 2 - Node.js** :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 3 - En ligne** :
https://generate-secret.vercel.app/32

### ⚠️ ATTENTION

**NE JAMAIS** :
- ❌ Changer JWT_SECRET en production (déconnecte tout le monde)
- ❌ Commiter les secrets dans Git
- ❌ Partager les secrets publiquement
- ❌ Utiliser des secrets courts

**TOUJOURS** :
- ✅ Garder les secrets identiques entre déploiements
- ✅ Utiliser des secrets longs (32+ caractères)
- ✅ Utiliser des secrets différents pour access et refresh
- ✅ Faire une backup sécurisée des secrets

---

## 🔍 Dépannage

### Problème : Utilisateurs toujours déconnectés

**Solution** :
1. Vérifiez que JWT_SECRET ne change pas sur Railway
2. Vérifiez que JWT_EXPIRATION = 30d
3. Consultez les logs Railway pour erreurs JWT
4. Videz le cache du navigateur

### Problème : Refresh automatique ne fonctionne pas

**Solution** :
1. Ouvrez DevTools → Console
2. Cherchez des erreurs
3. Vérifiez que le refresh token est valide
4. Testez `/auth/refresh` manuellement

### Problème : Erreur "Token expired"

**Solution** :
1. C'est normal si token > 30 jours
2. L'utilisateur doit se reconnecter
3. Le refresh token est peut-être expiré (90 jours)

---

## 📝 Commandes utiles

### Générer nouveaux secrets
```powershell
.\verifier-jwt-secrets.ps1
```

### Vérifier variables Railway
```bash
railway variables
```

### Tester l'API de refresh
```bash
curl -X POST https://votre-backend.railway.app/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"VOTRE_REFRESH_TOKEN"}'
```

### Consulter les logs
```bash
railway logs
```

---

## 🎯 Résultat final

Après avoir suivi ce guide :

✅ **Utilisateurs restent connectés** même après redéploiement  
✅ **Sessions longues** (30 jours minimum)  
✅ **Refresh automatique** transparent  
✅ **Pas de déconnexion surprise**  
✅ **Meilleure expérience utilisateur**  

---

**Besoin d'aide ?**  
Consultez : `CORRECTION_SESSION_PERSISTANTE.md` pour plus de détails techniques

**Date** : 12 décembre 2025  
**Version** : 1.0

