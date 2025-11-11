# 🚀 Guide de Déploiement FTP - annonceauto.ci

## ⚠️ IMPORTANT : Informations de Connexion

### Serveur FTP/SFTP
- **Hôte**: vps116108.serveur-vps.net
- **Port**: 22 (SFTP) ou 21 (FTP)
- **Protocole**: SFTP (recommandé) ou FTP
- **Utilisateur**: root
- **Mot de passe**: U9p0j2o8Y2h2C7C

### Base de Données
- **Hôte**: localhost ou vps116108.serveur-vps.net
- **Nom de la base**: c0ann5434
- **Utilisateur**: c0ann5434
- **Mot de passe**: $J-ZFr!Huo))_
- **PhpMyAdmin**: https://vps116108.serveur-vps.net:8080/phpmyadmin

---

## 📋 Étape 1 : Préparer les fichiers localement

### Sur Windows
Exécutez le script PowerShell :
```powershell
.\prepare-deploy.ps1
```

### Sur Linux/Mac
Exécutez le script Bash :
```bash
chmod +x prepare-deploy.sh
./prepare-deploy.sh
```

Ce script va :
1. ✅ Compiler le backend
2. ✅ Compiler le frontend
3. ✅ Créer les fichiers .env nécessaires
4. ✅ Préparer tous les fichiers pour le transfert

---

## 📦 Étape 2 : Installer un client FTP

### Options recommandées :

#### FileZilla (Windows/Mac/Linux) - RECOMMANDÉ
1. Télécharger : https://filezilla-project.org/
2. Installer le logiciel
3. Configurer la connexion :
   - Hôte : `sftp://vps116108.serveur-vps.net`
   - Utilisateur : `root`
   - Mot de passe : `U9p0j2o8Y2h2C7C`
   - Port : `22`

#### WinSCP (Windows uniquement)
1. Télécharger : https://winscp.net/
2. Configurer en mode SFTP
3. Utiliser les mêmes informations de connexion

---

## 🔄 Étape 3 : Transférer les fichiers

### Structure sur le serveur à créer :

```
/home/annonceauto/
├── backend/
│   ├── dist/
│   ├── node_modules/
│   ├── prisma/
│   ├── uploads/
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── ecosystem.config.js
└── frontend/
    ├── .next/
    ├── node_modules/
    ├── public/
    ├── package.json
    ├── package-lock.json
    ├── .env.production
    ├── next.config.js
    └── ecosystem.config.js
```

### Fichiers à transférer :

#### Backend (dossier local → serveur)
```
backend/dist/              → /home/annonceauto/backend/dist/
backend/node_modules/      → /home/annonceauto/backend/node_modules/
backend/prisma/            → /home/annonceauto/backend/prisma/
backend/package.json       → /home/annonceauto/backend/package.json
backend/package-lock.json  → /home/annonceauto/backend/package-lock.json
backend/.env               → /home/annonceauto/backend/.env
backend/ecosystem.config.js → /home/annonceauto/backend/ecosystem.config.js
```

#### Frontend (dossier local → serveur)
```
frontend/.next/            → /home/annonceauto/frontend/.next/
frontend/node_modules/     → /home/annonceauto/frontend/node_modules/
frontend/public/           → /home/annonceauto/frontend/public/
frontend/package.json      → /home/annonceauto/frontend/package.json
frontend/package-lock.json → /home/annonceauto/frontend/package-lock.json
frontend/.env.production   → /home/annonceauto/frontend/.env.production
frontend/next.config.js    → /home/annonceauto/frontend/next.config.js
frontend/ecosystem.config.js → /home/annonceauto/frontend/ecosystem.config.js
```

### ⚠️ Note importante
Le transfert des dossiers `node_modules` peut prendre du temps (plusieurs minutes à 1 heure selon votre connexion).

**Alternative plus rapide** : Ne pas transférer `node_modules` et lancer `npm install` directement sur le serveur via SSH.

---

## 🖥️ Étape 4 : Configuration du serveur (via SSH)

### Se connecter au serveur

Utilisez un client SSH comme PuTTY (Windows) ou le terminal (Mac/Linux) :

```bash
ssh root@vps116108.serveur-vps.net
```

Mot de passe : `U9p0j2o8Y2h2C7C`

### Installer les dépendances système

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Installer PM2 (gestionnaire de processus)
npm install -g pm2

# Installer Nginx (serveur web)
apt install -y nginx

# Installer MySQL (si pas déjà installé)
apt install -y mysql-server

# Vérifier les installations
node -v
npm -v
pm2 -v
nginx -v
```

### Configurer les permissions

```bash
# Créer les dossiers nécessaires
mkdir -p /home/annonceauto/backend/uploads
mkdir -p /home/annonceauto/backend/logs
mkdir -p /home/annonceauto/frontend/logs

# Donner les permissions
chmod 755 /home/annonceauto/backend/uploads
chown -R www-data:www-data /home/annonceauto/backend/uploads
```

### Si vous n'avez pas transféré node_modules

```bash
# Backend
cd /home/annonceauto/backend
npm install

# Frontend
cd /home/annonceauto/frontend
npm install
```

---

## 🗄️ Étape 5 : Configuration de la base de données

### Via SSH sur le serveur

```bash
# Aller dans le dossier backend
cd /home/annonceauto/backend

# Installer Prisma CLI (si pas déjà fait)
npm install prisma @prisma/client

# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate deploy

# (Optionnel) Remplir la base avec des données initiales
npx ts-node prisma/seed.ts
```

### Via PhpMyAdmin (alternative)

1. Aller sur : https://vps116108.serveur-vps.net:8080/phpmyadmin
2. Se connecter avec :
   - Utilisateur : `root`
   - Mot de passe : `U9p0j2o8Y2h2C7C`
3. Sélectionner la base `c0ann5434`
4. Importer le fichier SQL si vous en avez un

---

## ⚙️ Étape 6 : Configuration Nginx

### Créer le fichier de configuration

```bash
nano /etc/nginx/sites-available/annonceauto.ci
```

### Coller cette configuration

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
        client_max_body_size 50M;
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
    }
}
```

### Activer le site

```bash
# Créer le lien symbolique
ln -s /etc/nginx/sites-available/annonceauto.ci /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Redémarrer Nginx
systemctl restart nginx
```

---

## 🚀 Étape 7 : Démarrer les applications

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
# Copier et exécuter la commande suggérée

# Vérifier que tout fonctionne
pm2 status
pm2 logs
```

---

## 🔒 Étape 8 : Installer SSL (HTTPS)

```bash
# Installer Certbot
apt install -y certbot python3-certbot-nginx

# Obtenir les certificats SSL
certbot --nginx -d annonceauto.ci -d www.annonceauto.ci -d api.annonceauto.ci

# Suivre les instructions à l'écran
# Choisir de rediriger automatiquement HTTP vers HTTPS
```

---

## 🌐 Étape 9 : Configuration DNS

Dans votre panneau de gestion de domaine (OVH, Gandi, etc.) :

```
Type    Nom     Valeur                      TTL
A       @       [IP de votre VPS]           3600
A       www     [IP de votre VPS]           3600
A       api     [IP de votre VPS]           3600
```

Pour trouver l'IP de votre VPS :
```bash
curl ifconfig.me
```

---

## ✅ Étape 10 : Vérification finale

### Vérifier les services

```bash
# Statut de PM2
pm2 status

# Logs en temps réel
pm2 logs

# Statut de Nginx
systemctl status nginx
```

### Tester les URLs

1. **Backend API** : https://api.annonceauto.ci/api
2. **Frontend** : https://annonceauto.ci

---

## 🔧 Commandes Utiles

### Gestion PM2

```bash
# Voir le statut
pm2 status

# Redémarrer une application
pm2 restart annonceauto-backend
pm2 restart annonceauto-frontend

# Arrêter une application
pm2 stop annonceauto-backend

# Voir les logs
pm2 logs annonceauto-backend
pm2 logs annonceauto-frontend

# Supprimer une application
pm2 delete annonceauto-backend
```

### Mise à jour du site

Après avoir modifié le code localement :

```bash
# 1. Recompiler localement
npm run build

# 2. Transférer via FTP les nouveaux fichiers :
#    - backend/dist/
#    - frontend/.next/

# 3. Sur le serveur, redémarrer les applications
pm2 restart all
```

---

## 🐛 Dépannage

### Le site ne s'affiche pas

```bash
# Vérifier les logs
pm2 logs

# Vérifier Nginx
systemctl status nginx
tail -f /var/log/nginx/error.log

# Vérifier que les applications tournent
pm2 status

# Vérifier les ports
netstat -tulpn | grep LISTEN
```

### Erreur de base de données

```bash
# Vérifier la connexion
cd /home/annonceauto/backend
npx prisma studio

# Vérifier les migrations
npx prisma migrate status

# Réappliquer les migrations si nécessaire
npx prisma migrate deploy
```

### Problème d'upload de fichiers

```bash
# Vérifier les permissions
ls -la /home/annonceauto/backend/uploads

# Corriger les permissions si nécessaire
chmod 755 /home/annonceauto/backend/uploads
chown -R www-data:www-data /home/annonceauto/backend/uploads
```

---

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez les logs : `pm2 logs`
2. Vérifiez Nginx : `systemctl status nginx`
3. Vérifiez la base de données : PhpMyAdmin
4. Consultez le guide complet : `GUIDE_DEPLOIEMENT.md`

---

## 🎉 Félicitations !

Votre site devrait maintenant être en ligne sur **https://annonceauto.ci** ! 🚀


