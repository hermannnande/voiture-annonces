# 📝 Configuration des Variables d'Environnement

Ce document explique comment configurer toutes les variables d'environnement nécessaires pour le backend.

## 🗄️ Variables Requises

### 1. Base de Données PostgreSQL

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

**Configuration :**
- **Développement** : `postgresql://postgres:password@localhost:5432/voiture_annonces`
- **Production (Railway)** : Copiez la valeur de `DATABASE_PUBLIC_URL` depuis le service PostgreSQL

---

### 2. JWT (Authentification)

```env
JWT_SECRET="votre_secret_jwt_tres_securise"
JWT_EXPIRATION="1d"
JWT_REFRESH_SECRET="votre_secret_refresh_jwt_tres_securise"
JWT_REFRESH_EXPIRATION="7d"
```

**Génération de secrets sécurisés :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 3. URL du Frontend (CORS)

```env
FRONTEND_URL="http://localhost:3000"
```

**Configuration :**
- **Développement** : `http://localhost:3000`
- **Production** : `https://votre-app.vercel.app,https://votre-app-git-main.vercel.app`
  - Séparez plusieurs domaines par des virgules
  - Incluez tous les domaines de prévisualisation Vercel

---

### 4. 📧 Configuration Email (Gmail)

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="votre-email@gmail.com"
EMAIL_PASSWORD="votre_mot_de_passe_application"
```

**Instructions détaillées :**

1. **Créez un compte Gmail** (ou utilisez un existant)
2. **Activez l'authentification à 2 facteurs** :
   - Allez sur [myaccount.google.com/security](https://myaccount.google.com/security)
   - Activez la "Validation en deux étapes"
3. **Générez un mot de passe d'application** :
   - Allez sur [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Sélectionnez "Autre" et donnez un nom (ex: "Voiture Annonces Backend")
   - Copiez le mot de passe généré (16 caractères sans espaces)
4. **Utilisez ce mot de passe** pour `EMAIL_PASSWORD`

**Emails envoyés automatiquement :**
- ✅ Vérification d'email après inscription
- 🔒 Réinitialisation de mot de passe
- ✅ Confirmation de changement de mot de passe

---

### 5. 🖼️ ImageKit (Stockage d'Images)

```env
IMAGEKIT_PUBLIC_KEY="public_xxx"
IMAGEKIT_PRIVATE_KEY="private_xxx"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/votre_id"
```

**Instructions détaillées :**

1. **Créez un compte gratuit** sur [imagekit.io](https://imagekit.io)
   - Plan gratuit : 20 GB de bande passante/mois
   - Stockage illimité
2. **Récupérez vos clés API** :
   - Connectez-vous à ImageKit
   - Allez dans **Dashboard > Developer options**
   - Copiez :
     - `Public Key` → `IMAGEKIT_PUBLIC_KEY`
     - `Private Key` → `IMAGEKIT_PRIVATE_KEY`
     - `URL Endpoint` → `IMAGEKIT_URL_ENDPOINT`

**Pourquoi ImageKit ?**
- ✅ Stockage permanent des images (contrairement à Railway qui est éphémère)
- ✅ CDN global pour chargement rapide
- ✅ Optimisation automatique des images
- ✅ Transformation d'images à la volée

---

### 6. 🔐 Google OAuth 2.0

```env
GOOGLE_CLIENT_ID="votre_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="votre_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"
```

**Instructions détaillées :**

1. **Créez un projet Google Cloud** :
   - Allez sur [console.cloud.google.com](https://console.cloud.google.com)
   - Créez un nouveau projet (ex: "Voiture Annonces")

2. **Activez l'API Google+ (People API)** :
   - Dans le menu, allez sur **API et services > Bibliothèque**
   - Recherchez "Google+ API" ou "People API"
   - Cliquez sur "Activer"

3. **Créez des identifiants OAuth 2.0** :
   - Allez sur **API et services > Identifiants**
   - Cliquez sur **+ Créer des identifiants > ID client OAuth**
   - Type d'application : **Application Web**
   - Nom : "Voiture Annonces Web"

4. **Configurez les URI de redirection** :
   
   **Origines JavaScript autorisées :**
   - `http://localhost:3001` (développement)
   - `https://votre-backend.railway.app` (production)
   
   **URI de redirection autorisés :**
   - `http://localhost:3001/api/auth/google/callback` (développement)
   - `https://votre-backend.railway.app/api/auth/google/callback` (production)

5. **Copiez vos identifiants** :
   - `ID client` → `GOOGLE_CLIENT_ID`
   - `Secret du client` → `GOOGLE_CLIENT_SECRET`

6. **Configurez GOOGLE_CALLBACK_URL** :
   - Développement : `http://localhost:3001/api/auth/google/callback`
   - Production : `https://votre-backend.railway.app/api/auth/google/callback`

---

### 7. Port du Serveur

```env
PORT=3001
```

- Railway définit automatiquement cette variable
- En local, utilisez `3001` (ou tout port disponible)

---

## 🚀 Configuration Railway (Production)

1. **Allez dans votre service backend Railway**
2. **Onglet "Variables"**
3. **Ajoutez toutes les variables ci-dessus**
4. **Important** :
   - `DATABASE_URL` : Copiez depuis le service PostgreSQL → `DATABASE_PUBLIC_URL`
   - `FRONTEND_URL` : Incluez TOUS les domaines Vercel (principal + preview)
   - `GOOGLE_CALLBACK_URL` : Utilisez l'URL Railway complète

---

## ✅ Liste de Vérification

Avant de déployer, assurez-vous d'avoir configuré :

- [ ] `DATABASE_URL` (PostgreSQL)
- [ ] `JWT_SECRET` et `JWT_REFRESH_SECRET`
- [ ] `FRONTEND_URL` (avec tous les domaines Vercel)
- [ ] `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` (Gmail)
- [ ] `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
- [ ] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`

---

## 🧪 Test de Configuration

Après avoir configuré toutes les variables, testez :

1. **Email** : Créez un compte et vérifiez la réception de l'email
2. **Google OAuth** : Cliquez sur "Se connecter avec Google"
3. **Images** : Uploadez une image d'annonce et vérifiez qu'elle apparaît
4. **Mot de passe oublié** : Testez le flux de réinitialisation

---

## ❓ Problèmes Courants

### Email ne s'envoie pas
- ✅ Vérifiez que l'authentification à 2 facteurs est activée
- ✅ Utilisez un mot de passe d'application (pas votre mot de passe Gmail normal)
- ✅ Vérifiez que `EMAIL_PORT=587` (et non 465)

### Google OAuth échoue
- ✅ Vérifiez que l'URI de redirection est exactement identique dans Google Cloud Console
- ✅ Assurez-vous que l'API Google+ est activée
- ✅ Vérifiez que `GOOGLE_CALLBACK_URL` correspond à votre environnement

### Images ne s'affichent pas
- ✅ Vérifiez les clés ImageKit dans le Dashboard
- ✅ Assurez-vous que les 3 variables ImageKit sont définies
- ✅ Vérifiez les logs Railway pour les erreurs d'upload

---

## 📚 Ressources Utiles

- [ImageKit Documentation](https://docs.imagekit.io/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Nodemailer Documentation](https://nodemailer.com/)

