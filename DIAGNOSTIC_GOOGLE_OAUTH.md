# 🔍 DIAGNOSTIC COMPLET - Google OAuth "invalid_client"

## 🎯 Problème Identifié

L'erreur **"Erreur 401 : invalid_client"** signifie que Google ne reconnaît pas le `GOOGLE_CLIENT_ID` que votre backend lui envoie.

---

## ✅ Checklist de Vérification (Dans l'Ordre)

### 1️⃣ Google Cloud Console - Vérifier le Client ID

**Action** : Aller sur https://console.cloud.google.com/apis/credentials

**Vérifications** :
- [ ] Vous êtes sur le **bon projet** (en haut de la page)
- [ ] Votre client OAuth "Voiture Annonces Web" existe
- [ ] L'ID client est : `203996676228-f2ev5hdqv9c8mcqihvmqtfk6oa6vmpqm.apps.googleusercontent.com`

**⚠️ IMPORTANT** : Notez le **projet Google Cloud** dans lequel se trouve votre Client OAuth (nom du projet en haut).

---

### 2️⃣ Google Cloud Console - Vérifier les URLs Autorisées

**Sur la page du Client OAuth**, vérifiez :

**Origines JavaScript autorisées** (doit contenir) :
```
https://voiture-annonces-production.up.railway.app
https://voiture-annonces.vercel.app
http://localhost:3000
```

**URI de redirection autorisés** (doit contenir) :
```
https://voiture-annonces-production.up.railway.app/api/auth/google/callback
http://localhost:3001/api/auth/google/callback
```

**⚠️ Si une URL manque** : 
- Cliquez sur "Modifier" (icône crayon)
- Ajoutez les URLs manquantes
- Cliquez sur "Enregistrer"
- **ATTENDEZ 5 MINUTES** avant de retester (propagation Google)

---

### 3️⃣ OAuth Consent Screen - Vérifier le Statut

**Action** : Aller sur https://console.cloud.google.com/apis/credentials/consent

**Vérifications** :
- [ ] **Publishing status** : "Testing" ou "In production"
- [ ] Si **"Testing"** : Votre email `hermannmande@gmail.com` est dans "Test users"

**⚠️ Si vous n'êtes PAS dans Test users** :
1. Descendez à la section "Test users"
2. Cliquez sur "+ ADD USERS"
3. Ajoutez : `hermannmande@gmail.com`
4. Cliquez sur "SAVE"

**OU** (Recommandé) :
1. Trouvez le bouton **"PUBLISH APP"**
2. Cliquez dessus
3. Confirmez la publication

---

### 4️⃣ Railway - Vérifier les Variables (CRITIQUE)

**Action** : Aller sur https://railway.app/ > votre projet > onglet "Variables"

**Variables à vérifier** (révélez-les toutes) :

#### A. GOOGLE_CLIENT_ID
**Valeur attendue** (EXACTEMENT) :
```
203996676228-f2ev5hdqv9c8mcqihvmqtfk6oa6vmpqm.apps.googleusercontent.com
```

**⚠️ Vérifiez** :
- ✅ Pas d'espace avant ou après
- ✅ Pas de guillemets
- ✅ Tous les caractères sont identiques
- ✅ Le `.apps.googleusercontent.com` est présent

#### B. GOOGLE_CLIENT_SECRET
**Format attendu** :
```
GOCSPX-[24 caractères alphanumériques]
```

**⚠️ Vérifiez** :
- ✅ Commence par `GOCSPX-`
- ✅ Pas d'espace avant ou après
- ✅ C'est bien un des secrets actifs de Google Cloud

#### C. GOOGLE_CALLBACK_URL
**Valeur attendue** (EXACTEMENT) :
```
https://voiture-annonces-production.up.railway.app/api/auth/google/callback
```

**⚠️ Vérifiez** :
- ✅ Pas d'espace avant ou après
- ✅ Commence par `https://`
- ✅ Se termine par `/api/auth/google/callback`
- ✅ Le domaine est celui de votre Railway

#### D. FRONTEND_URL
**Valeur attendue** :
```
https://voiture-annonces.vercel.app
```

**⚠️ NE DOIT PAS** pointer vers Railway ou localhost !

---

### 5️⃣ Action Corrective si Variables Incorrectes

**Si UNE SEULE variable est incorrecte** :

1. **Supprimez-la** (cliquez sur "..." puis "Delete")

2. **Recréez-la proprement** :
   - Cliquez sur "New Variable"
   - Name : `GOOGLE_CLIENT_ID` (ou autre)
   - Value : **Copiez DIRECTEMENT depuis Google Cloud Console** (CTRL+C, CTRL+V)
   - Ne tapez RIEN manuellement

3. **Railway redéploiera automatiquement** (attendez 2-3 min)

---

### 6️⃣ Vercel - Vérifier les Variables

**Action** : Aller sur https://vercel.com/ > votre projet > Settings > Environment Variables

**Variable à vérifier** :

#### NEXT_PUBLIC_API_URL
**Valeur attendue** :
```
https://voiture-annonces-production.up.railway.app/api
```

**⚠️ Si incorrecte** :
1. Modifiez-la
2. Cliquez sur "Save"
3. **Redéployez** : Allez dans Deployments > Dernier déploiement > "..." > "Redeploy"

---

## 🧪 Procédure de Test

**Après CHAQUE modification** :

1. **Attendez** que Railway/Vercel redéploie (2-3 min)

2. **Ouvrez navigation privée** : `Ctrl + Shift + N`

3. **Allez sur** : https://voiture-annonces.vercel.app

4. **Testez** la connexion Google

---

## 🔧 Solution Radicale (Si Rien Ne Fonctionne)

Si après toutes ces vérifications ça ne fonctionne toujours pas :

### Recréer le Client OAuth de Zéro

1. **Sur Google Cloud Console** :
   - Allez sur https://console.cloud.google.com/apis/credentials
   - Trouvez "Voiture Annonces Web"
   - Cliquez sur l'icône **poubelle** pour le supprimer
   - Confirmez

2. **Créez un NOUVEAU Client OAuth** :
   - Cliquez sur "+ CREATE CREDENTIALS" > "OAuth client ID"
   - Type : "Web application"
   - Name : "Voiture Annonces Web v2"
   - Origines JavaScript : Ajoutez les 3 URLs
   - URI de redirection : Ajoutez les 2 URLs
   - Cliquez sur "CREATE"

3. **Copiez le NOUVEAU Client ID et Secret**

4. **Dans Railway** :
   - Supprimez `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET`
   - Recréez-les avec les NOUVELLES valeurs
   - Attendez le redéploiement

5. **Testez**

---

## 📊 Logs de Débogage

### Vérifier les Logs Railway

1. **Sur Railway** : Onglet "Logs"

2. **Cherchez** ces lignes au démarrage :
```
✅ GOOGLE_CLIENT_ID: ✅
✅ GOOGLE_CLIENT_SECRET: ✅
✅ GOOGLE_CALLBACK_URL: ✅
```

3. **Si vous voyez** :
```
⚠️ Google OAuth non configuré - variables manquantes
- GOOGLE_CLIENT_ID: ❌
```
→ La variable n'est PAS définie dans Railway

---

## 💡 Astuce : Test du Client ID

Pour vérifier que Google reconnaît votre Client ID :

1. **Ouvrez** : https://www.googleapis.com/oauth2/v3/certs

2. **Dans un nouvel onglet**, testez cette URL (remplacez par votre Client ID) :
```
https://oauth2.googleapis.com/tokeninfo?id_token=VOTRE_CLIENT_ID
```

Si ça retourne "invalid_token", c'est normal. Si ça dit "invalid_client", votre Client ID n'existe pas dans Google.

---

## 🎯 Résumé des Valeurs Attendues

### Google Cloud Console
```
Client ID: 203996676228-f2ev5hdqv9c8mcqihvmqtfk6oa6vmpqm.apps.googleusercontent.com
Client Secret: GOCSPX-5L8RfXVJbGuA5qp512y2Mp71aIZ

Origines JavaScript:
- https://voiture-annonces-production.up.railway.app
- https://voiture-annonces.vercel.app
- http://localhost:3000

URI de redirection:
- https://voiture-annonces-production.up.railway.app/api/auth/google/callback
- http://localhost:3001/api/auth/google/callback
```

### Railway
```
GOOGLE_CLIENT_ID=203996676228-f2ev5hdqv9c8mcqihvmqtfk6oa6vmpqm.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-5L8RfXVJbGuA5qp512y2Mp71aIZ
GOOGLE_CALLBACK_URL=https://voiture-annonces-production.up.railway.app/api/auth/google/callback
FRONTEND_URL=https://voiture-annonces.vercel.app
```

### Vercel
```
NEXT_PUBLIC_API_URL=https://voiture-annonces-production.up.railway.app/api
```

---

## ⏰ Délais de Propagation

Après modification :
- **Google Cloud Console** : 5-10 minutes
- **Railway** : 2-3 minutes (redéploiement)
- **Vercel** : 1-2 minutes (redéploiement)

**Attendez toujours** avant de retester !

---

## 📞 Si Ça Ne Fonctionne Toujours Pas

Prenez des captures d'écran de :
1. Variables Railway (révélées)
2. Client OAuth Google Cloud (page complète)
3. OAuth consent screen (statut + test users)
4. L'erreur exacte dans le navigateur

Et envoyez-les pour diagnostic approfondi.

