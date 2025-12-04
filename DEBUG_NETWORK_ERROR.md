# 🔍 DEBUG: Network Error Admin

## Étape 1 : Vérifier Railway

1. Allez sur https://railway.app/dashboard
2. Cliquez sur votre projet
3. Vérifiez que le déploiement est **"Active"** (vert)
4. Si **"Crashed"** (rouge) → Cliquez sur "Redeploy"

## Étape 2 : Tester l'API directement

Ouvrez un onglet et testez ces URLs :

```
✅ https://api.annonceauto.ci/api/health
✅ https://api.annonceauto.ci/api/health/detailed
```

**Résultat attendu** :
```json
{ "status": "ok", "timestamp": "...", ... }
```

**Si erreur 404** → Railway n'a pas déployé le nouveau code  
**Si timeout** → Railway est down  
**Si SSL error** → Problème de certificat Railway

## Étape 3 : Vérifier les variables d'environnement

Railway → Settings → Variables

**Variables critiques** :
- `DATABASE_URL` : URL PostgreSQL
- `JWT_SECRET` : Secret pour les tokens
- `JWT_REFRESH_SECRET` : Secret pour refresh tokens
- `FRONTEND_URL` : https://www.annonceauto.ci (PAS avec virgule)
- `BACKEND_URL` : https://api.annonceauto.ci

## Étape 4 : Logs Railway

Railway → Deployments → Dernier déploiement → Logs

**Cherchez ces lignes** :
```
📌 Frontend URL: https://www.annonceauto.ci
📌 Backend URL: https://api.annonceauto.ci
✅ Application démarrée sur le port 3001
```

**Si erreurs** → Copiez les logs et envoyez-les

## Étape 5 : Console navigateur

F12 → Console → Actualisez la page admin

**Cherchez** :
```
❌ Erreur chargement admin: {
  status: ...,
  message: "...",
  code: "ERR_NETWORK"
}
```

**Si `ERR_NETWORK`** → L'API ne répond pas (Railway down)  
**Si `401`** → Token expiré (reconnectez-vous)  
**Si `403`** → Vous n'êtes pas SUPER_ADMIN  
**Si `500`** → Erreur serveur (voir logs Railway)

## Solution rapide

Si rien ne fonctionne :

1. **Redémarrer Railway** :
   - Railway dashboard → Settings → Restart

2. **Vider le cache navigateur** :
   - `Ctrl + Shift + Delete`
   - Cocher "Cookies" et "Cache"
   - Cliquer "Effacer"

3. **Reconnexion** :
   - Se déconnecter complètement
   - Fermer tous les onglets du site
   - Se reconnecter en navigation privée (`Ctrl + Shift + N`)

4. **Test en curl** (depuis PowerShell) :
```powershell
curl https://api.annonceauto.ci/api/health
```

Si ça fonctionne en curl mais pas dans le navigateur → Problème de CORS ou cache.

