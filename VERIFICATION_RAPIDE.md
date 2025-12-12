# ✅ Checklist de Vérification Rapide

## 🎯 Objectif
Vérifier que votre plateforme Voiture Annonces est correctement déployée et fonctionnelle.

---

## 1️⃣ Vérification Backend Railway

### Status du service
- [ ] Aller sur [Railway Dashboard](https://railway.app/)
- [ ] Service `voiture-annonces` montre **Active** (pastille verte)
- [ ] Pas d'erreurs dans les logs

### Variables d'environnement essentielles
```
✅ À vérifier dans Railway Variables :

DATABASE_URL                   [Généré auto par Railway]
JWT_SECRET                     [Votre secret]
JWT_EXPIRATION                 7d
JWT_REFRESH_SECRET             [Votre autre secret]
JWT_REFRESH_EXPIRATION         30d
FRONTEND_URL                   https://www.annonceauto.ci
PORT                           3001
IMAGEKIT_PUBLIC_KEY            [Votre clé publique]
IMAGEKIT_PRIVATE_KEY           [Votre clé privée]
IMAGEKIT_URL_ENDPOINT          https://ik.imagekit.io/[votre-id]
ADMIN_EMAIL                    admin@annonceauto.ci
ADMIN_DEFAULT_PASSWORD         [Votre mot de passe admin]
```

### Test API Health
Ouvrez dans votre navigateur :
```
https://voiture-annonces-production.up.railway.app/api/health
```

**Réponse attendue** :
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-12-12T10:30:00.000Z"
}
```

❌ Si erreur → Consultez `GUIDE_CORRECTION_RAILWAY.md`

### Test API Listings
```
https://votre-backend.railway.app/api/listings?page=1&limit=10
```

**Réponse attendue** :
```json
{
  "listings": [...],
  "total": 123,
  "page": 1,
  "limit": 10
}
```

---

## 2️⃣ Vérification Frontend Vercel

### Status du déploiement
- [ ] Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Dernier déploiement montre **Ready** (pastille verte)
- [ ] Temps de build < 5 minutes

### Variables d'environnement Vercel
```
✅ À vérifier dans Vercel Environment Variables :

NEXT_PUBLIC_API_URL            https://voiture-annonces-production.up.railway.app/api
NEXT_PUBLIC_SITE_URL           https://www.annonceauto.ci
NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED   true (ou false si désactivé)
```

### Test du site
Ouvrez : `https://www.annonceauto.ci`

**Checklist** :
- [ ] Page d'accueil charge correctement
- [ ] Les annonces s'affichent (au moins 1 annonce visible)
- [ ] Images des annonces chargent
- [ ] Header avec logo et menu
- [ ] Footer avec liens légaux

---

## 3️⃣ Test Fonctionnalités Principales

### Inscription Utilisateur
1. Allez sur `https://www.annonceauto.ci/auth/register`
2. Remplissez le formulaire :
   - Nom : `Test User`
   - Email : `test@example.com`
   - Téléphone : `+2250700000000`
   - Mot de passe : `Test123456!`
3. Cliquez sur **S'inscrire**
4. **Résultat attendu** : Redirection vers la page de connexion ou dashboard

✅ **Si ça marche** : Inscription OK  
❌ **Si erreur** : Vérifiez la console (F12) et les logs Railway

### Connexion Utilisateur
1. Allez sur `https://www.annonceauto.ci/auth/login`
2. Utilisez les identifiants créés ou admin :
   - Email : `admin@annonceauto.ci`
   - Mot de passe : `[Votre ADMIN_DEFAULT_PASSWORD]`
3. Cliquez sur **Se connecter**
4. **Résultat attendu** : Redirection vers `/dashboard`

### Création d'annonce
1. Connectez-vous
2. Allez sur `/dashboard/listings/new`
3. Remplissez le formulaire :
   - Titre : `Test Voiture`
   - Prix : `5000000` FCFA
   - Marque, Modèle, etc.
4. Ajoutez au moins 1 photo
5. Cliquez sur **Publier**
6. **Résultat attendu** : Annonce créée et visible dans "Mes annonces"

### Recherche d'annonces
1. Retournez sur la page d'accueil
2. Utilisez la barre de recherche
3. Testez les filtres (Prix, Marque, etc.)
4. **Résultat attendu** : Les annonces sont filtrées correctement

---

## 4️⃣ Test Console Développeur

### Ouvrez les DevTools (F12)

#### Console Tab
Vérifiez qu'il n'y a **AUCUNE** erreur rouge :
- ❌ `Failed to fetch`
- ❌ `CORS error`
- ❌ `404 Not Found`
- ❌ `TypeError`

✅ **Acceptable** : Warnings (jaunes) sur Google OAuth si désactivé

#### Network Tab
1. Filtrez par **Fetch/XHR**
2. Actualisez la page
3. Vérifiez les requêtes API :

**Exemples de requêtes** :
```
GET https://votre-backend/api/listings       → Status 200
GET https://votre-backend/api/brands         → Status 200
POST https://votre-backend/api/auth/login    → Status 200 ou 401
```

❌ **Si Status 500** : Problème backend  
❌ **Si Status CORS** : Vérifiez `FRONTEND_URL` sur Railway

---

## 5️⃣ Test Performance

### PageSpeed Insights
1. Allez sur [PageSpeed Insights](https://pagespeed.web.dev/)
2. Entrez : `https://www.annonceauto.ci`
3. Lancez l'analyse
4. **Score attendu** :
   - Performance : > 70
   - Accessibility : > 90
   - Best Practices : > 80
   - SEO : > 90

### Lighthouse (dans Chrome DevTools)
1. Ouvrez votre site
2. F12 → **Lighthouse** tab
3. Cliquez sur **Generate report**
4. Vérifiez les scores

---

## 6️⃣ Test Mobile

### Responsive Design
Testez sur plusieurs tailles d'écran :

**Dans Chrome DevTools (F12)** :
1. Cliquez sur l'icône "Toggle device toolbar" (ou Ctrl+Shift+M)
2. Testez sur :
   - [ ] iPhone SE (375px)
   - [ ] iPhone 12 Pro (390px)
   - [ ] iPad (768px)
   - [ ] Desktop (1920px)

**Vérifications** :
- [ ] Menu hamburger apparaît sur mobile
- [ ] Images responsive (pas de débordement)
- [ ] Formulaires utilisables sur petit écran
- [ ] Boutons facilement cliquables (min 44x44px)

---

## 7️⃣ Test Emails (Optionnel)

Si vous avez configuré SMTP :

### Email de vérification
1. Inscrivez-vous avec un vrai email
2. Vérifiez votre boîte mail
3. **Attendu** : Email de vérification reçu dans les 5 minutes

### Email de réinitialisation mot de passe
1. Allez sur `/auth/forgot-password`
2. Entrez votre email
3. **Attendu** : Email reçu avec lien de réinitialisation

---

## 8️⃣ Test Sécurité de Base

### Protection des routes admin
1. Déconnectez-vous
2. Essayez d'accéder à `/admin`
3. **Attendu** : Redirection vers `/auth/login`

### Tokens JWT
1. Connectez-vous
2. Ouvrez DevTools → Application → Local Storage
3. Vérifiez la présence de :
   - `accessToken`
   - `refreshToken`
   - `user`

### HTTPS
- [ ] Votre site utilise HTTPS (cadenas vert dans la barre d'adresse)
- [ ] Aucun avertissement de sécurité

---

## 🐛 Problèmes Fréquents et Solutions

### ❌ Backend "Crashed" sur Railway
**Solution** : Consultez `GUIDE_CORRECTION_RAILWAY.md`

### ❌ Erreur CORS
**Solution** :
```bash
# Vérifiez Railway Variables
FRONTEND_URL=https://www.annonceauto.ci  # Sans slash final !
```
Puis redéployez Railway.

### ❌ Images ne chargent pas
**Solution** :
1. Vérifiez ImageKit configuration sur Railway
2. Vérifiez `next.config.js` → `remotePatterns`

### ❌ "Network Error" depuis le frontend
**Solution** :
1. Vérifiez que `NEXT_PUBLIC_API_URL` est correct sur Vercel
2. Testez l'URL backend directement dans le navigateur
3. Vérifiez que Railway backend est actif

### ❌ 404 sur certaines pages
**Solution** :
1. Vérifiez que la page existe dans `frontend/src/app/`
2. Redéployez Vercel
3. Videz le cache du navigateur

---

## 📊 Récapitulatif des URLs importantes

### Production
```
Frontend:         https://www.annonceauto.ci
Backend API:      https://voiture-annonces-production.up.railway.app/api
Health Check:     https://votre-backend.railway.app/api/health
Admin Panel:      https://www.annonceauto.ci/admin
Dashboard:        https://www.annonceauto.ci/dashboard
```

### Dashboards
```
Railway:          https://railway.app/project/[votre-id]
Vercel:           https://vercel.com/[votre-username]/[votre-projet]
```

---

## ✅ Validation Finale

Si **TOUS** les points suivants sont validés, votre plateforme est prête ! 🎉

- [x] Backend Railway **Active**
- [x] Frontend Vercel **Ready**
- [x] API Health retourne `{"status":"ok"}`
- [x] Page d'accueil charge les annonces
- [x] Inscription fonctionne
- [x] Connexion fonctionne
- [x] Création d'annonce fonctionne
- [x] Images s'affichent
- [x] Aucune erreur CORS
- [x] Aucune erreur dans la console
- [x] Site responsive sur mobile
- [x] HTTPS actif

---

## 📞 Support

Si un test échoue :
1. Consultez le guide correspondant :
   - Backend : `GUIDE_CORRECTION_RAILWAY.md`
   - Frontend : `GUIDE_CONFIGURATION_VERCEL.md`
2. Vérifiez les logs (Railway et Vercel)
3. Testez en local pour isoler le problème

---

**Date** : 12 décembre 2025  
**Version** : 1.0

