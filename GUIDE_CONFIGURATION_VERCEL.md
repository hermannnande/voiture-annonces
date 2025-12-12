# 🚀 Guide de Configuration Vercel

## 📋 Vue d'ensemble

Ce guide vous aide à configurer correctement votre frontend Next.js sur Vercel pour qu'il communique avec votre backend Railway.

## 🔑 Variables d'environnement Vercel

### Accéder aux variables d'environnement

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet `voiture-annonces`
3. Cliquez sur **Settings** (icône engrenage)
4. Dans le menu latéral, cliquez sur **Environment Variables**

### Variables obligatoires

Configurez ces variables dans **All Environments** (Production, Preview, Development) :

#### 1. NEXT_PUBLIC_API_URL
```
Variable Name: NEXT_PUBLIC_API_URL
Value: https://voiture-annonces-production.up.railway.app/api
Environments: ✅ Production ✅ Preview ✅ Development
```

**⚠️ Important** :
- Remplacez par votre véritable URL Railway Backend
- Format : `https://[NOM-SERVICE].up.railway.app/api`
- OU votre domaine personnalisé : `https://api.annonceauto.ci/api`
- **DOIT se terminer par `/api`** (ne pas oublier !)

#### 2. NEXT_PUBLIC_SITE_URL
```
Variable Name: NEXT_PUBLIC_SITE_URL
Value: https://www.annonceauto.ci
Environments: ✅ Production ✅ Preview
```

**Usage** : URL publique de votre site frontend (pour les redirections, SEO, etc.)

#### 3. NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED (Optionnel)
```
Variable Name: NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED
Value: true
Environments: ✅ Production ✅ Preview
```

**Usage** : Active/désactive la connexion avec Google

---

### Variables optionnelles mais recommandées

#### Pour Google OAuth (si activé)
```
Variable Name: NEXT_PUBLIC_GOOGLE_CLIENT_ID
Value: [Votre Client ID depuis Google Cloud Console]
Environments: ✅ Production ✅ Preview
```

#### Pour le support WhatsApp
```
Variable Name: NEXT_PUBLIC_WHATSAPP_NUMBER
Value: +2250778030075
Environments: ✅ Production
```

---

## 🔧 Configuration du projet Vercel

### Build & Development Settings

Allez dans **Settings** > **Build & Development Settings**

#### Framework Preset
```
Framework Preset: Next.js
```

#### Root Directory
```
Root Directory: frontend
```
⚠️ **Important** : Ne pas oublier car votre `package.json` est dans `/frontend`

#### Build Command
```
Build Command: npm run build
```

#### Output Directory
```
Output Directory: .next
```
(Par défaut pour Next.js)

#### Install Command
```
Install Command: npm install
```

---

## 🌐 Configuration des domaines

### Domaine personnalisé (si vous en avez un)

1. Allez dans **Settings** > **Domains**
2. Ajoutez vos domaines :

```
annonceauto.ci                    -> Production
www.annonceauto.ci                -> Production (recommended)
```

3. Configurez vos DNS chez votre registrar :

#### Type A Record (pour annonceauto.ci)
```
Type: A
Name: @
Value: 76.76.21.21 (IP de Vercel)
TTL: Auto
```

#### Type CNAME (pour www.annonceauto.ci)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

---

## 🔄 Synchronisation avec Railway Backend

### Assurez-vous que Railway connaît le frontend

Dans **Railway Dashboard** > **Variables**, ajoutez :

```
FRONTEND_URL=https://www.annonceauto.ci
```

⚠️ **Sans slash à la fin !**

Cette variable est utilisée pour :
- Configuration CORS (autoriser les requêtes depuis le frontend)
- Liens de redirection (emails de vérification, OAuth, etc.)

---

## 🚀 Processus de déploiement

### Déploiement automatique (recommandé)

Vercel se redéploie automatiquement à chaque push sur GitHub :

```bash
# Après avoir modifié le frontend
cd frontend
git add .
git commit -m "feat: amélioration interface utilisateur"
git push origin main
```

Vercel :
1. Détecte le push sur GitHub
2. Lance le build automatiquement
3. Déploie la nouvelle version
4. Le site est mis à jour en ~2 minutes

### Déploiement manuel

1. Allez dans **Deployments**
2. Cliquez sur **...** (trois points) sur le dernier déploiement
3. Cliquez sur **Redeploy**

---

## ✅ Vérification de la configuration

### Test 1 : Variables d'environnement

Dans votre navigateur, ouvrez la console (F12) et tapez :

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL);
```

Vous devriez voir vos URLs correctes.

### Test 2 : Connexion Backend

Ouvrez votre site : `https://www.annonceauto.ci`

1. **Test des annonces** : La page d'accueil doit afficher les annonces
2. **Test de connexion** : Allez sur `/auth/login` et essayez de vous connecter
3. **Test d'inscription** : Allez sur `/auth/register` et créez un compte

### Test 3 : Vérification réseau

Ouvrez les DevTools (F12) > **Network**

- Filtrez par "Fetch/XHR"
- Actualisez la page
- Vous devriez voir des requêtes vers votre backend Railway
- Exemple : `https://voiture-annonces-production.up.railway.app/api/listings`

---

## 🐛 Résolution des problèmes

### Problème 1 : "Network Error" ou "ERR_CONNECTION_REFUSED"

**Cause** : Le frontend ne peut pas se connecter au backend

**Solutions** :
1. Vérifiez que `NEXT_PUBLIC_API_URL` est correcte dans Vercel
2. Vérifiez que le backend Railway est actif (status vert)
3. Testez l'URL backend directement dans le navigateur : `https://votre-backend.railway.app/api/health`
4. Vérifiez que Railway a bien `FRONTEND_URL=https://www.annonceauto.ci`

### Problème 2 : Erreurs CORS

**Symptômes** : 
```
Access to fetch at 'https://...' from origin 'https://www.annonceauto.ci' 
has been blocked by CORS policy
```

**Solutions** :
1. Dans Railway Variables, vérifiez : `FRONTEND_URL=https://www.annonceauto.ci` (sans slash final)
2. Redéployez le backend Railway
3. Videz le cache du navigateur (Ctrl+Shift+Delete)

### Problème 3 : Images ne s'affichent pas

**Cause** : Configuration Next.js manquante pour les images distantes

**Solution** : Vérifiez `frontend/next.config.js` :

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'votre-backend.railway.app',
      pathname: '/uploads/**',
    },
    // Si vous utilisez ImageKit
    {
      protocol: 'https',
      hostname: 'ik.imagekit.io',
    },
  ],
}
```

### Problème 4 : Déploiement échoue (Build Error)

**Causes communes** :
- Erreurs TypeScript
- Dépendances manquantes
- Variables d'environnement manquantes

**Solutions** :
1. Consultez les logs Vercel : **Deployments** > Cliquez sur le déploiement échoué
2. Vérifiez que `Root Directory` = `frontend`
3. Testez le build localement :
```bash
cd frontend
npm install
npm run build
```

### Problème 5 : Page blanche après déploiement

**Causes** :
- JavaScript désactivé
- Erreur de build non détectée
- Variables d'environnement manquantes

**Solutions** :
1. Ouvrez la console navigateur (F12) pour voir les erreurs
2. Vérifiez les logs Vercel
3. Assurez-vous que toutes les variables `NEXT_PUBLIC_*` sont configurées

---

## 📊 Monitoring et Performance

### Vercel Analytics (optionnel mais recommandé)

1. Allez dans **Analytics** dans le dashboard
2. Activez **Web Analytics**
3. Vous pourrez voir :
   - Nombre de visiteurs
   - Performance du site
   - Core Web Vitals

### Logs en temps réel

1. Allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. Cliquez sur **View Function Logs** pour voir les logs serveur

---

## 🔐 Sécurité

### Ne jamais exposer de secrets

⚠️ **Attention** : Seules les variables préfixées par `NEXT_PUBLIC_` sont exposées au client (navigateur).

**Safe (côté client)** :
```
✅ NEXT_PUBLIC_API_URL
✅ NEXT_PUBLIC_SITE_URL
✅ NEXT_PUBLIC_GOOGLE_CLIENT_ID
```

**Dangereux (NE PAS mettre dans Vercel)** :
```
❌ JWT_SECRET
❌ DATABASE_URL
❌ API_PRIVATE_KEY
```

Ces secrets doivent rester dans Railway (backend) uniquement.

---

## 📝 Checklist de configuration complète

### Vercel Settings

- [ ] **Root Directory** : `frontend`
- [ ] **Build Command** : `npm run build`
- [ ] **Framework** : Next.js

### Variables d'environnement Vercel

- [ ] `NEXT_PUBLIC_API_URL` configurée (avec `/api` à la fin)
- [ ] `NEXT_PUBLIC_SITE_URL` configurée
- [ ] `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED` configurée (si OAuth activé)

### Domaines

- [ ] Domaine principal ajouté : `www.annonceauto.ci`
- [ ] Redirection configurée : `annonceauto.ci` → `www.annonceauto.ci`
- [ ] DNS configurés correctement

### Railway Backend

- [ ] `FRONTEND_URL=https://www.annonceauto.ci` (sans slash final)
- [ ] Backend actif (status vert)
- [ ] Test API : `https://backend-url/api/health` retourne `{"status":"ok"}`

### Tests finaux

- [ ] Page d'accueil charge les annonces
- [ ] Connexion fonctionne
- [ ] Inscription fonctionne
- [ ] Images s'affichent correctement
- [ ] Aucune erreur CORS dans la console
- [ ] Recherche et filtres fonctionnent

---

## 📞 Ressources utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Railway Documentation](https://docs.railway.app/)

---

**Date de création** : 12 décembre 2025  
**Version** : 1.0  
**Auteur** : Support Technique

