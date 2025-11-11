# 🚀 DÉPLOIEMENT SUR VPS LWS - Guide Complet

## ✅ VOS INFORMATIONS LWS

- **Domaine** : annonceauto.ci
- **VPS** : vps116108.serveur-vps.net (180.149.199.219)
- **Panel** : https://vps116108.serveur-vps.net:8080
- **Base de données** : MySQL (c0ann5434)

## 📋 ÉTAPE 1 : PRÉPARER LES FICHIERS D'ENVIRONNEMENT

### 1.1 Créer backend/.env pour production

Copiez ces informations dans `backend/.env` :

```env
# Base de données MySQL LWS
DATABASE_URL="mysql://c0ann5434:$J-ZFr!Huo))_@localhost:3306/c0ann5434"

# JWT Secrets (GARDEZ-LES SECRETS !)
JWT_SECRET=annonceauto_lws_production_jwt_secret_2024_ultra_secure
JWT_REFRESH_SECRET=annonceauto_lws_production_refresh_jwt_secret_2024_ultra_secure
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Application
NODE_ENV=production
PORT=3001
```

### 1.2 Créer frontend/.env.local pour production

```env
NEXT_PUBLIC_API_URL=https://annonceauto.ci/api
NEXT_PUBLIC_SITE_URL=https://annonceauto.ci
```

## 📤 ÉTAPE 2 : TRANSFÉRER LES FICHIERS VIA FTP

### Méthode A : Avec FileZilla (Recommandé)

1. **Téléchargez FileZilla** : https://filezilla-project.org/download.php

2. **Connectez-vous** :
   - Hôte : `ftp.annonceauto.ci`
   - Nom d'utilisateur : `admin_annonceauto.ci`
   - Mot de passe : `*XREfL)X)*uNT`
   - Port : `21`

3. **Transférez ces dossiers** :
   - `backend/` entier (tous les fichiers)
   - `frontend/` entier (tous les fichiers)

⏱️ **Temps estimé** : 10-15 minutes (selon la connexion)

### Méthode B : Avec WinSCP

1. **Téléchargez WinSCP** : https://winscp.net/eng/download.php
2. Même configuration que FileZilla

## 🔧 ÉTAPE 3 : SE CONNECTER EN SSH ET INSTALLER

### 3.1 Connexion SSH

Vous avez 2 options :

**Option A : Via le Panel LWS**
1. Allez sur https://vps116108.serveur-vps.net:8080
2. Connectez-vous (admin / U9p0j2o8Y2h2C7C)
3. Cherchez "Terminal" ou "SSH Access"

**Option B : Via PuTTY**
1. Téléchargez PuTTY : https://www.putty.org
2. Host : `vps116108.serveur-vps.net`
3. Port : `22`
4. Utilisateur : `root`
5. Mot de passe : `U9p0j2o8Y2h2C7C`

### 3.2 Vérifier Node.js

```bash
node --version
npm --version
```

**Si Node.js n'est pas installé** :
```bash
# Installer Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier
node --version  # Devrait afficher v20.x.x
npm --version   # Devrait afficher 10.x.x
```

### 3.3 Aller dans le dossier du site

```bash
cd /var/www/annonceauto.ci
# ou
cd /home/admin_annonceauto.ci/
```

(Le chemin exact dépend de votre configuration LWS)

### 3.4 Installer les dépendances du backend

```bash
cd backend
npm install --production
```

### 3.5 Configurer Prisma et la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les migrations (initialiser la base de données)
npx prisma migrate deploy

# Remplir la base avec les données initiales
npm run prisma:seed
```

✅ **Votre base de données est maintenant configurée !**

### 3.6 Compiler le backend

```bash
npm run build
```

### 3.7 Installer les dépendances du frontend

```bash
cd ../frontend
npm install --production
```

### 3.8 Compiler le frontend

```bash
npm run build
```

## 🔄 ÉTAPE 4 : INSTALLER PM2 (Gestionnaire de processus)

PM2 permet de garder votre application en ligne 24/7.

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Démarrer le backend
cd /var/www/annonceauto.ci/backend
pm2 start npm --name "annonceauto-backend" -- run start:prod

# Démarrer le frontend
cd /var/www/annonceauto.ci/frontend
pm2 start npm --name "annonceauto-frontend" -- start

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# Copiez et exécutez la commande affichée
```

### Vérifier que tout fonctionne

```bash
pm2 status
pm2 logs annonceauto-backend
pm2 logs annonceauto-frontend
```

Vous devriez voir :
- ✅ Backend : "Application listening on port 3001"
- ✅ Frontend : "Ready on http://localhost:3000"

## 🌐 ÉTAPE 5 : CONFIGURER NGINX (Reverse Proxy)

### 5.1 Vérifier si Nginx est installé

```bash
nginx -v
```

**Si pas installé** :
```bash
sudo apt update
sudo apt install nginx
```

### 5.2 Créer la configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/annonceauto.ci
```

Collez cette configuration :

```nginx
# Redirection HTTP vers HTTPS
server {
    listen 80;
    server_name annonceauto.ci www.annonceauto.ci;
    return 301 https://annonceauto.ci$request_uri;
}

# Configuration HTTPS
server {
    listen 443 ssl http2;
    server_name annonceauto.ci www.annonceauto.ci;

    # Certificats SSL (à configurer via LWS/Certbot)
    # ssl_certificate /etc/letsencrypt/live/annonceauto.ci/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/annonceauto.ci/privkey.pem;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gestion des fichiers uploadés
    location /uploads {
        alias /var/www/annonceauto.ci/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Appuyez sur `Ctrl+X`, puis `Y`, puis `Entrée` pour sauvegarder.

### 5.3 Activer la configuration

```bash
# Créer un lien symbolique
sudo ln -s /etc/nginx/sites-available/annonceauto.ci /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

## 🔒 ÉTAPE 6 : CONFIGURER LE CERTIFICAT SSL (HTTPS)

### Via Certbot (Let's Encrypt - Gratuit)

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d annonceauto.ci -d www.annonceauto.ci

# Suivre les instructions
# Email : admin@annonceauto.ci
# Accepter les termes
# Choisir : Redirect HTTP to HTTPS (option 2)
```

Le certificat se renouvelle automatiquement !

## ✅ ÉTAPE 7 : VÉRIFICATION FINALE

### Tester votre site

1. **Ouvrez** : https://annonceauto.ci
2. **Testez la connexion** : 
   - Email : admin@annonceauto.ci
   - Mot de passe : Admin123! (si vous avez exécuté le seed)

3. **Créez une annonce** pour tester

### Commandes utiles

```bash
# Voir les logs en temps réel
pm2 logs

# Redémarrer le backend
pm2 restart annonceauto-backend

# Redémarrer le frontend
pm2 restart annonceauto-frontend

# Voir le statut
pm2 status

# Voir les statistiques
pm2 monit
```

## 🔄 MISES À JOUR FUTURES

Quand vous modifiez le code :

```bash
# 1. Transférer les fichiers modifiés via FTP

# 2. Se connecter en SSH
cd /var/www/annonceauto.ci/backend
npm install
npm run build
pm2 restart annonceauto-backend

cd /var/www/annonceauto.ci/frontend
npm install
npm run build
pm2 restart annonceauto-frontend
```

## 🆘 DÉPANNAGE

### Le backend ne démarre pas

```bash
pm2 logs annonceauto-backend --lines 50
```

Vérifiez :
- La connexion à la base de données dans `.env`
- Les permissions des fichiers : `sudo chown -R www-data:www-data /var/www/annonceauto.ci`

### Le frontend affiche une erreur

```bash
pm2 logs annonceauto-frontend --lines 50
```

Vérifiez `.env.local` et assurez-vous que `NEXT_PUBLIC_API_URL` est correct.

### Erreurs Nginx

```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Base de données

Connectez-vous à PhpMyAdmin :
- https://vps116108.serveur-vps.net:8080/phpmyadmin
- Root / U9p0j2o8Y2h2C7C
- Puis sélectionnez c0ann5434

## 🎉 FÉLICITATIONS !

Votre site **annonceauto.ci** est maintenant en ligne et accessible 24/7 !

- 🌐 Site : https://annonceauto.ci
- 📊 Admin : Connectez-vous avec votre compte admin
- 📧 Email : admin@annonceauto.ci configuré
- 💾 Base de données : MySQL fonctionnelle
- 🔒 SSL : Sécurisé avec Let's Encrypt


