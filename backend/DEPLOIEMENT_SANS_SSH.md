# 🚀 DÉPLOIEMENT SANS SSH - 100% FTP + Panel Web

## ⚠️ SOLUTION POUR HÉBERGEUR QUI BLOQUE SSH

Si PuTTY et le terminal SSH ne fonctionnent pas, utilisez cette méthode alternative qui fonctionne uniquement avec FTP et le panel web de votre hébergeur.

---

## 🎯 MÉTHODE 1 : PANEL WEB DE L'HÉBERGEUR (RECOMMANDÉ)

Votre hébergeur a probablement un **panneau de contrôle web** accessible par navigateur.

### Accéder au panel web

Essayez ces URLs dans votre navigateur :

```
https://vps116108.serveur-vps.net:2222
https://vps116108.serveur-vps.net:8443
https://vps116108.serveur-vps.net/cpanel
https://vps116108.serveur-vps.net/plesk
https://vps116108.serveur-vps.net:10000  (Webmin)
```

**Identifiants** :
- Utilisateur : `root`
- Mot de passe : `U9p0j2o8Y2h2C7C`

### Une fois connecté au panel web

1. Cherchez "Terminal" ou "Console Web" ou "SSH Terminal"
2. Vous aurez un terminal directement dans le navigateur
3. Suivez les commandes d'installation depuis là

---

## 🎯 MÉTHODE 2 : DÉPLOIEMENT HÉBERGEMENT MUTUALISÉ

Si votre serveur est un hébergement mutualisé classique (pas un VPS libre), voici comment procéder :

### Étape 1 : Transférer UNIQUEMENT le frontend compilé

Via FileZilla, transférez :

```
frontend/.next/          → /public_html/.next/
frontend/node_modules/   → /public_html/node_modules/
frontend/public/         → /public_html/public/
frontend/package.json    → /public_html/package.json
frontend/next.config.js  → /public_html/next.config.js
```

### Étape 2 : Configuration pour hébergement mutualisé

Créez un fichier `.htaccess` dans `/public_html/` :

```apache
# Redirection vers Next.js
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^$ http://localhost:3000/ [P,L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

⚠️ **PROBLÈME** : Cette méthode nécessite quand même d'exécuter `npm start` sur le serveur...

---

## 🎯 MÉTHODE 3 : DÉPLOIEMENT STATIC EXPORT (LA MEILLEURE SANS SSH !)

Cette méthode exporte votre site Next.js en HTML statique, utilisable sur n'importe quel hébergement !

### Étape 1 : Modifier next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // URL de votre API backend (à héberger séparément ou utiliser un service)
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.annonceauto.ci/api',
  },
};

module.exports = nextConfig;
```

### Étape 2 : Compiler en local

```powershell
cd frontend
npm run build
```

Cela crée un dossier `out/` avec votre site en HTML statique.

### Étape 3 : Transférer via FTP

Transférez TOUT le contenu du dossier `frontend/out/` vers `/public_html/` ou `/www/`

```
frontend/out/*  → /public_html/
```

### Étape 4 : Configuration .htaccess

Créez `/public_html/.htaccess` :

```apache
# Redirection HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Support des routes Next.js
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

✅ **AVANTAGE** : Fonctionne sur TOUS les hébergements web !

---

## 🎯 MÉTHODE 4 : UTILISER UN SERVICE CLOUD (SIMPLE ET GRATUIT)

Au lieu de gérer le serveur, utilisez un service cloud qui fait tout pour vous :

### Option A : Vercel (Gratuit, spécialisé Next.js)

1. Créez un compte sur https://vercel.com
2. Connectez votre projet (ou uploadez le code)
3. Vercel déploie automatiquement
4. Configurez votre domaine annonceauto.ci dans Vercel

**Backend** : Déployez sur Railway.app ou Render.com (gratuit aussi)

### Option B : Netlify (Gratuit)

1. Compte sur https://netlify.com
2. Glissez-déposez le dossier `frontend/out/`
3. Configurez votre domaine

### Option C : Cloudflare Pages (Gratuit)

1. Compte sur https://pages.cloudflare.com
2. Uploadez votre site
3. Configuration automatique

---

## 🎯 MÉTHODE 5 : CONTACTER VOTRE HÉBERGEUR

Il est possible que :

1. **Le port SSH soit bloqué** → Demandez à l'activer
2. **L'accès SSH nécessite une configuration** → Demandez les instructions
3. **Vous devez utiliser leur panel web** → Demandez l'URL du panel

**Contactez le support** avec ces questions :

```
Bonjour,

Je souhaite déployer une application Node.js sur mon VPS (vps116108.serveur-vps.net).

Questions :
1. L'accès SSH est-il activé ? Sur quel port ?
2. Avez-vous un panel web (cPanel, Plesk, Webmin) ? Quelle est l'URL ?
3. Comment puis-je exécuter des applications Node.js sur ce serveur ?
4. Node.js et PM2 sont-ils déjà installés ?

Merci !
```

---

## 📋 SOLUTION RECOMMANDÉE POUR VOUS

Vu votre situation, je recommande **MÉTHODE 3** :

### ✅ Avantages :
- ✔️ Pas besoin de SSH
- ✔️ Fonctionne sur n'importe quel hébergement
- ✔️ Simple : juste du FTP
- ✔️ Rapide et performant

### ⚠️ Limitations :
- Le frontend sera statique (mais fonctionnel)
- Vous devrez héberger le backend ailleurs (ou demander à votre hébergeur comment exécuter Node.js)

---

## 🛠️ SCRIPT D'EXPORT STATIQUE

Je vais créer un script pour vous faciliter la vie :

```powershell
# Compiler le frontend en statique
cd frontend
npm run build

Write-Host "✅ Site compilé dans frontend/out/"
Write-Host "📤 Transférez le contenu de frontend/out/ vers /public_html/ via FTP"
```

---

## 🌐 POUR LE BACKEND

Si le backend doit aussi être hébergé :

### Option 1 : Service cloud gratuit
- **Railway.app** : Gratuit, déploiement facile
- **Render.com** : Gratuit, base de données incluse
- **Fly.io** : Gratuit jusqu'à 3 apps

### Option 2 : Demander à votre hébergeur
Contactez-les pour savoir comment exécuter Node.js

### Option 3 : VPS différent
Prenez un petit VPS chez OVH, Scaleway, ou DigitalOcean avec SSH activé

---

## 🎯 QUE VOULEZ-VOUS FAIRE ?

1. **Essayer le panel web** de votre hébergeur ?
2. **Export statique** via FTP (méthode 3) ?
3. **Utiliser Vercel/Netlify** (gratuit et simple) ?
4. **Contacter l'hébergeur** pour débloquer SSH ?

Dites-moi et je vous guide précisément ! 🚀


