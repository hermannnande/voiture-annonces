# ⚡ SOLUTION RAPIDE - Google OAuth

## 🎯 Les 3 Actions les Plus Probables

### Action 1 : Ajouter Votre Email comme Test User

**Le problème le plus courant !**

1. Allez sur : https://console.cloud.google.com/apis/credentials/consent

2. Descendez à **"Test users"**

3. Cliquez sur **"+ ADD USERS"**

4. Ajoutez : `hermannmande@gmail.com`

5. Cliquez sur **"SAVE"**

6. **Testez immédiatement** !

---

### Action 2 : Publier l'Application OAuth

**Plus simple que d'ajouter des test users**

1. Sur la même page : https://console.cloud.google.com/apis/credentials/consent

2. En haut, cherchez le bouton **"PUBLISH APP"** ou **"PUBLIER L'APPLICATION"**

3. Cliquez dessus

4. Confirmez

5. **Testez immédiatement** !

---

### Action 3 : Recréer les Variables Railway

**Si les variables sont mal formatées**

1. Allez sur Railway : https://railway.app/

2. Onglet **"Variables"**

3. **Supprimez** ces 3 variables :
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL`

4. **Recréez-les UNE PAR UNE** :

**GOOGLE_CLIENT_ID** :
```
203996676228-f2ev5hdqv9c8mcqihvmqtfk6oa6vmpqm.apps.googleusercontent.com
```

**GOOGLE_CLIENT_SECRET** :
```
GOCSPX-5L8RfXVJbGuA5qp512y2Mp71aIZ
```

**GOOGLE_CALLBACK_URL** :
```
https://voiture-annonces-production.up.railway.app/api/auth/google/callback
```

5. Railway redéploie automatiquement (attendez 2 min)

6. **Testez** !

---

## 🧪 Comment Tester

**À chaque fois** :

1. **Navigation privée** : `Ctrl + Shift + N`

2. **Allez sur** : https://voiture-annonces.vercel.app

3. Cliquez sur **"Se connecter avec Google"**

---

## ✅ Résultat Attendu

- Google vous demande de choisir votre compte ✅
- Vous autorisez l'application ✅
- Vous êtes redirigé vers votre site ✅
- Vous êtes connecté ✅

---

## 📞 Toujours Bloqué ?

Consultez : **DIAGNOSTIC_GOOGLE_OAUTH.md** pour un diagnostic complet.

