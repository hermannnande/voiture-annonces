# Guide de Déploiement - annonceauto.ci

## 📋 Configuration VPS

### Informations du serveur
- **Domaine**: annonceauto.ci
- **Serveur**: vps116108.serveur-vps.net
- **Base de données**: c0ann5434
- **Utilisateur DB**: c0ann5434
- **Mot de passe DB**: $J-ZFr!Huo))_

---

## 🚀 Étapes de Déploiement

### 1. Préparer les fichiers localement

#### A. Backend

1. **Créer le fichier `.env` dans le dossier backend** :
```env
DATABASE_URL="mysql://c0ann5434:$J-ZFr!Huo))_@localhost:3306/c0ann5434"
JWT_SECRET="votre_jwt_secret_super_securise_changez_moi_123456789"
JWT_REFRESH_SECRET="votre_jwt_refresh_secret_super_securise_changez_moi_987654321"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
FRONTEND_URL="https://annonceauto.ci"
BACKEND_PORT=3001
NODE_ENV=production
UPLOAD_PATH="/home/annonceauto/backend/uploads"
EMAIL_HOST="vps116108.serveur-vps.net"
EMAIL_PORT=587
EMAIL_USER="admin@annonceauto.ci"
EMAIL_PASSWORD="Y_LrJsjuYMOlN"
EMAIL_FROM="admin@annonceauto.ci"
```

2. **Modifier le schema.prisma** pour utiliser MySQL au lieu de PostgreSQL :
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

3. **Compiler le backend** :
```bash
cd backend
npm install
npm run build
```

#### B. Frontend

1. **Créer le fichier `.env.production` dans le dossier frontend** :
```env
NEXT_PUBLIC_API_URL=https://api.annonceauto.ci/api
NEXT_PUBLIC_SITE_URL=https://annonceauto.ci
```

2. **Compiler le frontend** :
```bash
cd frontend
npm install
npm run build
```

---

### 2. Se connecter au VPS via SSH

```bash
ssh root@vps116108.serveur-vps.net
```

**Mot de passe root**: U9p0j2o8Y2h2C7C

---

### 3. Installer Node.js et les dépendances sur le VPS

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Node.js (version 18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Installer PM2 (gestionnaire de processus)
npm install -g pm2

# Installer les outils de compilation
apt install -y build-essential
```

---

### 4. Créer la structure des dossiers

```bash
mkdir -p /home/annonceauto/backend
mkdir -p /home/annonceauto/frontend
mkdir -p /home/annonceauto/backend/uploads
```

---

### 5. Transférer les fichiers via FTP

#### A. Se connecter au FTP

- **Hôte**: vps116108.serveur-vps.net
- **Port**: 21 (ou 22 pour SFTP)
- **Utilisateur**: root
- **Mot de passe**: U9p0j2o8Y2h2C7C

#### B. Fichiers à transférer

**Backend** :
- `backend/dist/` → `/home/annonceauto/backend/dist/`
- `backend/node_modules/` → `/home/annonceauto/backend/node_modules/`
- `backend/prisma/` → `/home/annonceauto/backend/prisma/`
- `backend/package.json` → `/home/annonceauto/backend/package.json`
- `backend/package-lock.json` → `/home/annonceauto/backend/package-lock.json`
- `backend/.env` → `/home/annonceauto/backend/.env`
- `backend/ecosystem.config.js` → `/home/annonceauto/backend/ecosystem.config.js`

**Frontend** :
- `frontend/.next/` → `/home/annonceauto/frontend/.next/`
- `frontend/node_modules/` → `/home/annonceauto/frontend/node_modules/`
- `frontend/public/` → `/home/annonceauto/frontend/public/`
- `frontend/package.json` → `/home/annonceauto/frontend/package.json`
- `frontend/package-lock.json` → `/home/annonceauto/frontend/package-lock.json`
- `frontend/.env.production` → `/home/annonceauto/frontend/.env.production`
- `frontend/next.config.js` → `/home/annonceauto/frontend/next.config.js`
- `frontend/ecosystem.config.js` → `/home/annonceauto/frontend/ecosystem.config.js`

---

### 6. Configuration de la base de données

```bash
# Se connecter au VPS via SSH
ssh root@vps116108.serveur-vps.net

# Aller dans le dossier backend
cd /home/annonceauto/backend

# Installer les dépendances Prisma
npm install @prisma/client prisma

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate deploy

# (Optionnel) Seed la base de données
npm run prisma:seed
```

---

### 7. Démarrer les applications avec PM2

```bash
# Démarrer le backend
cd /home/annonceauto/backend
pm2 start ecosystem.config.js

# Démarrer le frontend
cd /home/annonceauto/frontend
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
```

---

### 8. Configuration Nginx (Reverse Proxy)

Créer le fichier `/etc/nginx/sites-available/annonceauto.ci` :

```nginx
# Backend API
server {
    listen 80;
    server_name api.annonceauto.ci;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name annonceauto.ci www.annonceauto.ci;

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
}
```

Activer le site :

```bash
ln -s /etc/nginx/sites-available/annonceauto.ci /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

### 9. Installer SSL avec Let's Encrypt

```bash
# Installer Certbot
apt install -y certbot python3-certbot-nginx

# Obtenir les certificats SSL
certbot --nginx -d annonceauto.ci -d www.annonceauto.ci -d api.annonceauto.ci

# Le renouvellement automatique sera configuré automatiquement
```

---

### 10. Configuration DNS

Dans votre panneau de configuration DNS (chez votre registrar) :

```
Type    Nom     Valeur                          TTL
A       @       [IP de votre VPS]               3600
A       www     [IP de votre VPS]               3600
A       api     [IP de votre VPS]               3600
```

---

## 📝 Commandes Utiles

### Vérifier le statut des applications
```bash
pm2 status
pm2 logs annonceauto-backend
pm2 logs annonceauto-frontend
```

### Redémarrer les applications
```bash
pm2 restart annonceauto-backend
pm2 restart annonceauto-frontend
```

### Arrêter les applications
```bash
pm2 stop annonceauto-backend
pm2 stop annonceauto-frontend
```

### Mettre à jour après modifications
```bash
# Backend
cd /home/annonceauto/backend
npm run build
pm2 restart annonceauto-backend

# Frontend
cd /home/annonceauto/frontend
npm run build
pm2 restart annonceauto-frontend
```

---

## 🔐 Sécurité

### Configurer le pare-feu
```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

### Créer un utilisateur non-root
```bash
adduser annonceauto
usermod -aG sudo annonceauto
```

---

## 📦 Alternative : Script de Déploiement Automatique

Créer un script `deploy.sh` :

```bash
#!/bin/bash

# Arrêter les applications
pm2 stop all

# Aller dans le backend
cd /home/annonceauto/backend
npm install
npx prisma generate
npx prisma migrate deploy

# Aller dans le frontend
cd /home/annonceauto/frontend
npm install

# Redémarrer les applications
pm2 restart all
```

Rendre le script exécutable :
```bash
chmod +x deploy.sh
```

---

## ✅ Vérification

Après le déploiement, vérifier que tout fonctionne :

1. Backend API : https://api.annonceauto.ci/api
2. Frontend : https://annonceauto.ci
3. Vérifier les logs : `pm2 logs`

---

## 🐛 Dépannage

### Si le backend ne démarre pas
```bash
cd /home/annonceauto/backend
pm2 logs annonceauto-backend
# Vérifier les erreurs et corriger
```

### Si la base de données ne se connecte pas
```bash
# Vérifier que MySQL est installé et en cours d'exécution
systemctl status mysql

# Vérifier les credentials
mysql -u c0ann5434 -p
# Entrer le mot de passe : $J-ZFr!Huo))_
```

### Si les uploads ne fonctionnent pas
```bash
# Créer le dossier uploads et donner les permissions
mkdir -p /home/annonceauto/backend/uploads
chmod 755 /home/annonceauto/backend/uploads
chown -R www-data:www-data /home/annonceauto/backend/uploads
```

---

## 📞 Support

En cas de problème, vérifier :
1. Les logs PM2 : `pm2 logs`
2. Les logs Nginx : `tail -f /var/log/nginx/error.log`
3. Les logs système : `journalctl -xe`


