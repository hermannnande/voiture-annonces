# 🔐 Nouvelles Variables d'Environnement

## 📧 Email (vérification, reset password)

Pour activer les fonctionnalités d'email, ajoutez ces variables dans Railway :

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-app-password-gmail
```

## 🔐 Comment obtenir un App Password Gmail

1. Allez sur https://myaccount.google.com/security
2. Activez la validation en 2 étapes si ce n'est pas déjà fait
3. Allez dans "Mots de passe des applications"
4. Créez un mot de passe pour "Mail"
5. Copiez le mot de passe généré (format: xxxx xxxx xxxx xxxx)
6. Utilisez ce mot de passe dans `EMAIL_PASSWORD`

## 📝 Variables existantes à vérifier

- `FRONTEND_URL` : Doit pointer vers votre frontend Vercel (ex: https://votre-app.vercel.app)
- Cette URL est utilisée pour générer les liens de vérification email et reset password

## 🔑 Google OAuth (Connexion avec Google)

```
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret
GOOGLE_CALLBACK_URL=https://votre-backend.railway.app/api/auth/google/callback
```

### 📝 Comment configurer Google OAuth

1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet ou sélectionnez un existant
3. Activez "Google+ API"
4. Allez dans "Identifiants" > "Créer des identifiants" > "ID client OAuth"
5. Type d'application : "Application Web"
6. Origines JavaScript autorisées :
   - `https://votre-backend.railway.app`
   - `http://localhost:3001` (pour le développement)
7. URI de redirection autorisés :
   - `https://votre-backend.railway.app/api/auth/google/callback`
   - `http://localhost:3001/api/auth/google/callback` (pour le développement)
8. Copiez le Client ID et le Client Secret

## ✅ Checklist Railway

### Email
- [ ] `EMAIL_HOST` ajouté
- [ ] `EMAIL_PORT` ajouté
- [ ] `EMAIL_USER` ajouté (votre email Gmail)
- [ ] `EMAIL_PASSWORD` ajouté (App Password Gmail)

### Google OAuth
- [ ] `GOOGLE_CLIENT_ID` ajouté
- [ ] `GOOGLE_CLIENT_SECRET` ajouté
- [ ] `GOOGLE_CALLBACK_URL` ajouté (URL de votre backend Railway)

### Général
- [ ] `FRONTEND_URL` vérifié

