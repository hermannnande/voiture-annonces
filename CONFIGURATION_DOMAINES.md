# 🌐 Configuration Complète des Domaines - AnnonceAuto.ci

## 📌 Vue d'ensemble des domaines

### Domaines principaux
- **Frontend** : `https://www.annonceauto.ci` (domaine principal)
- **Frontend alternatif** : `https://annonceauto.ci` (redirige vers www)
- **Backend API** : `https://api.annonceauto.ci/api`

---

## 🔧 Configuration Vercel (Frontend)

### Variables d'environnement à configurer

Allez dans : **Vercel Dashboard** → **Settings** → **Environment Variables**

```env
NEXT_PUBLIC_API_URL=https://api.annonceauto.ci/api
NEXT_PUBLIC_SITE_URL=https://www.annonceauto.ci
```

### Domaines configurés
- `www.annonceauto.ci` → Production
- `annonceauto.ci` → Redirige vers www (configuré dans next.config.js)

---

## 🚂 Configuration Railway (Backend)

### Variables d'environnement à configurer

Allez dans : **Railway Dashboard** → **Votre Projet** → **Variables**

```env
# Base de données
DATABASE_URL=mysql://votre_user:votre_password@localhost:3306/votre_db

# JWT
JWT_SECRET=votre_jwt_secret_super_securise_changez_moi_123456789
JWT_REFRESH_SECRET=votre_jwt_refresh_secret_super_securise_changez_moi_987654321
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# URLs
FRONTEND_URL=https://www.annonceauto.ci
BACKEND_PORT=3001
NODE_ENV=production

# Email
EMAIL_HOST=vps116108.serveur-vps.net
EMAIL_PORT=587
EMAIL_USER=admin@annonceauto.ci
EMAIL_PASSWORD=votre_mot_de_passe
EMAIL_FROM=admin@annonceauto.ci

# Google OAuth
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret
GOOGLE_CALLBACK_URL=https://api.annonceauto.ci/api/auth/google/callback

# ImageKit (si utilisé)
IMAGEKIT_PUBLIC_KEY=votre_public_key
IMAGEKIT_PRIVATE_KEY=votre_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/votre_id
```

---

## 🔐 Configuration Google OAuth

### Console Google Cloud

1. Allez sur : https://console.cloud.google.com/
2. Sélectionnez votre projet (ou créez-en un)
3. **APIs & Services** → **Credentials**

### URIs de redirection autorisés

Ajoutez ces URLs dans la section "Authorized redirect URIs" :

```
https://api.annonceauto.ci/api/auth/google/callback
https://www.annonceauto.ci/auth/google/callback
http://localhost:3001/api/auth/google/callback (pour dev)
```

### Origines JavaScript autorisées

Ajoutez ces URLs dans "Authorized JavaScript origins" :

```
https://www.annonceauto.ci
https://annonceauto.ci
http://localhost:3000 (pour dev)
```

---

## 🌐 Configuration DNS (TPEcloud)

### Enregistrements DNS requis

```
Type    Nom d'hôte          TTL      Valeur
A       annonceauto.ci      14400    216.150.1.1
CNAME   www                 14400    cname.vercel-dns.com
A       api                 14400    IP_DE_VOTRE_SERVEUR_RAILWAY
```

**Note** : Si Railway ne vous donne pas d'IP fixe, utilisez un CNAME :
```
CNAME   api                 14400    votre-projet.up.railway.app
```

---

## ✅ Checklist de vérification

### Frontend (Vercel)
- [ ] Domaine `www.annonceauto.ci` configuré en Production
- [ ] Domaine `annonceauto.ci` configuré (redirige ou en Production)
- [ ] Variable `NEXT_PUBLIC_API_URL` = `https://api.annonceauto.ci/api`
- [ ] Variable `NEXT_PUBLIC_SITE_URL` = `https://www.annonceauto.ci`
- [ ] Le site se charge correctement sur `https://www.annonceauto.ci`

### Backend (Railway)
- [ ] Variable `FRONTEND_URL` = `https://www.annonceauto.ci`
- [ ] Variable `GOOGLE_CALLBACK_URL` = `https://api.annonceauto.ci/api/auth/google/callback`
- [ ] Variable `DATABASE_URL` correctement configurée
- [ ] Variables email configurées
- [ ] L'API répond sur `https://api.annonceauto.ci/api`

### Google OAuth
- [ ] URIs de redirection configurés dans Google Console
- [ ] `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` dans Railway
- [ ] Test de connexion Google fonctionnel

### DNS
- [ ] Enregistrement A pour `annonceauto.ci` pointe vers Vercel
- [ ] CNAME `www` pointe vers Vercel
- [ ] Enregistrement A ou CNAME pour `api` pointe vers Railway
- [ ] Propagation DNS terminée (peut prendre jusqu'à 48h)

---

## 🧪 Tests à effectuer

### Test 1 : Frontend
```bash
# Doit afficher votre site
curl -I https://www.annonceauto.ci

# Doit rediriger vers www
curl -I https://annonceauto.ci
```

### Test 2 : Backend API
```bash
# Doit retourner une réponse JSON
curl https://api.annonceauto.ci/api/health
```

### Test 3 : OAuth Google
1. Allez sur `https://www.annonceauto.ci/auth/login`
2. Cliquez sur "Continuer avec Google"
3. Vérifiez que la redirection fonctionne
4. Vérifiez que la connexion réussit

---

## 🚨 Problèmes courants

### Le site ne se charge pas
- Vérifiez que le DNS est propagé (utilisez https://dnschecker.org/)
- Vérifiez que Vercel a bien déployé la dernière version
- Vérifiez les variables d'environnement sur Vercel

### L'API ne répond pas
- Vérifiez que Railway a bien déployé le backend
- Vérifiez que le DNS pour `api.annonceauto.ci` pointe vers Railway
- Vérifiez les logs Railway pour voir les erreurs

### Google OAuth ne fonctionne pas
- Vérifiez que les URIs de redirection sont exactement corrects dans Google Console
- Vérifiez que `GOOGLE_CALLBACK_URL` dans Railway correspond exactement
- Vérifiez les logs Railway pendant la tentative de connexion

### Images ne se chargent pas
- Vérifiez que `remotePatterns` dans `next.config.js` inclut votre domaine
- Vérifiez que les URLs des images pointent vers le bon domaine

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel : Dashboard → Deployments → [Dernier déploiement] → Logs
2. Vérifiez les logs Railway : Dashboard → Votre projet → Deployments → Logs
3. Utilisez les outils de développement du navigateur (Console et Network)

---

**Dernière mise à jour** : 25 novembre 2025























