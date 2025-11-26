# 🚀 Guide de Déploiement sur LWS

## 📋 Vue d'Ensemble

Votre application nécessite :
- ✅ **Backend NestJS** (API Node.js)
- ✅ **Frontend Next.js** (Application React)
- ✅ **Base de données PostgreSQL**
- ✅ **Redis** (Cache)
- ✅ **Storage** pour les images uploadées

---

## 🎯 Options de Déploiement LWS

### Option 1 : VPS LWS (Recommandé) ⭐

**Avantages** :
- ✅ Contrôle total
- ✅ Docker supporté
- ✅ PostgreSQL + Redis natifs
- ✅ Node.js sans limitation

**Prix** : À partir de ~10€/mois

### Option 2 : Hébergement Web LWS + Base externe

**Avantages** :
- ✅ Moins cher
- ✅ Facile à configurer

**Limitations** :
- ⚠️ Pas de Docker
- ⚠️ PostgreSQL limité
- ⚠️ Node.js restreint

---

## 🔧 OPTION 1 : Déploiement sur VPS LWS (RECOMMANDÉ)

### Prérequis

1. **Louer un VPS LWS** :
   - https://www.lws.fr/serveur_dedie_linux.php
   - Choisir : **VPS SSD Starter** (minimum)
   - OS : **Ubuntu 22.04 LTS**

2. **Accès SSH** au VPS

---

## 📦 Étape 1 : Préparer le VPS

### Connexion SSH

```bash
ssh root@votre-ip-vps
```

### Installation des dépendances

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installer Docker Compose
apt install docker-compose -y

# Installer Node.js (pour build si nécessaire)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Installer Git
apt install git -y

# Installer Nginx (reverse proxy)
apt install nginx -y

# Activer les services
systemctl enable docker
systemctl enable nginx
systemctl start nginx
```

---

## 📂 Étape 2 : Transférer Votre Application

### Option A : Via Git (Recommandé)

```bash
# Créer un dépôt Git sur GitHub/GitLab
# Puis sur le VPS :
cd /var/www
git clone https://votre-depot-git.git voiture-app
cd voiture-app
```

### Option B : Via SFTP

1. **Utiliser FileZilla** ou WinSCP
2. **Connecter** au VPS (port 22)
3. **Uploader** tous vos fichiers dans `/var/www/voiture-app`

---

## 🔐 Étape 3 : Configurer les Variables d'Environnement

### Créer le fichier `.env` pour le backend

```bash
cd /var/www/voiture-app
nano backend/.env
```

**Contenu** :

```env
# Database (PostgreSQL sur le VPS)
DATABASE_URL="postgresql://voiture_user:VOTRE_MOT_DE_PASSE_FORT@postgres:5432/voiture_db?schema=public"

# JWT Configuration
JWT_SECRET=GENERER_UN_SECRET_FORT_ICI_32_CARACTERES_MINIMUM
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=AUTRE_SECRET_FORT_DIFFERENT_32_CARACTERES
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Email (Configuration SMTP réelle)
MAIL_HOST=smtp.votre-domaine.com
MAIL_PORT=587
MAIL_USER=noreply@votre-domaine.com
MAIL_PASSWORD=votre_mot_de_passe_email
MAIL_FROM=noreply@votre-domaine.com

# Application
NODE_ENV=production
PORT=3001

# CORS (votre domaine)
FRONTEND_URL=https://votre-domaine.com
```

**⚠️ IMPORTANT** : Générer des secrets forts !

```bash
# Générer des secrets aléatoires
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Créer le fichier `.env.local` pour le frontend

```bash
nano frontend/.env.local
```

**Contenu** :

```env
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api
```

---

## 🐳 Étape 4 : Modifier docker-compose pour la Production

### Créer `docker-compose.prod.yml`

```bash
nano docker-compose.prod.yml
```

**Contenu** :

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: voiture_db
      POSTGRES_USER: voiture_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U voiture_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data
    networks:
      - app-network
    command: redis-server --appendonly yes

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    environment:
      NODE_ENV: production
    env_file:
      - backend/.env
    volumes:
      - ./backend/uploads:/app/uploads
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - app-network
    ports:
      - "3001:3001"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    environment:
      NODE_ENV: production
    env_file:
      - frontend/.env.local
    depends_on:
      - backend
    networks:
      - app-network
    ports:
      - "3000:3000"

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

---

## 🏗️ Étape 5 : Builder et Démarrer

### Définir le mot de passe PostgreSQL

```bash
export DB_PASSWORD="VOTRE_MOT_DE_PASSE_POSTGRES_FORT"
```

### Builder les images

```bash
cd /var/www/voiture-app
docker-compose -f docker-compose.prod.yml build
```

### Démarrer les services

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Vérifier que tout fonctionne

```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🗄️ Étape 6 : Initialiser la Base de Données

### Exécuter les migrations Prisma

```bash
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### Seed la base de données

```bash
docker-compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

---

## 🌐 Étape 7 : Configurer Nginx (Reverse Proxy)

### Créer la configuration Nginx

```bash
nano /etc/nginx/sites-available/voiture-app
```

**Contenu** :

```nginx
# Backend API
server {
    listen 80;
    server_name api.votre-domaine.com;

    client_max_body_size 50M;

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
    server_name votre-domaine.com www.votre-domaine.com;

    client_max_body_size 50M;

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

### Activer la configuration

```bash
ln -s /etc/nginx/sites-available/voiture-app /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🔒 Étape 8 : Installer SSL (HTTPS)

### Installer Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

### Générer les certificats SSL

```bash
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com -d api.votre-domaine.com
```

**Suivre les instructions interactives.**

### Renouvellement automatique

```bash
# Ajouter au cron
crontab -e

# Ajouter cette ligne :
0 3 * * * certbot renew --quiet
```

---

## 🌍 Étape 9 : Configurer le DNS chez LWS

### Accéder au Panneau LWS

1. **Connexion** : https://panel.lws.fr
2. **Aller dans "Domaines"**
3. **Sélectionner votre domaine**
4. **Cliquer sur "Zone DNS"**

### Ajouter les enregistrements DNS

| Type | Nom | Valeur | TTL |
|------|-----|--------|-----|
| **A** | @ | IP_DE_VOTRE_VPS | 3600 |
| **A** | www | IP_DE_VOTRE_VPS | 3600 |
| **A** | api | IP_DE_VOTRE_VPS | 3600 |

**Exemple** :
```
Type: A
Nom: @
Valeur: 51.210.xxx.xxx (votre IP VPS)
TTL: 3600

Type: A
Nom: www
Valeur: 51.210.xxx.xxx
TTL: 3600

Type: A
Nom: api
Valeur: 51.210.xxx.xxx
TTL: 3600
```

**⚠️ La propagation DNS peut prendre 2-24 heures.**

---

## 📁 Étape 10 : Configurer le Storage des Images

### Créer le dossier uploads

```bash
mkdir -p /var/www/voiture-app/backend/uploads
chown -R 1000:1000 /var/www/voiture-app/backend/uploads
chmod -R 755 /var/www/voiture-app/backend/uploads
```

### Servir les images via Nginx

**Ajouter dans `/etc/nginx/sites-available/voiture-app`** :

```nginx
# Dans le bloc server pour api.votre-domaine.com
location /uploads/ {
    alias /var/www/voiture-app/backend/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

**Recharger Nginx** :

```bash
nginx -t
systemctl reload nginx
```

---

## 🔄 Étape 11 : Scripts de Déploiement Automatique

### Créer un script de mise à jour

```bash
nano /var/www/voiture-app/deploy.sh
```

**Contenu** :

```bash
#!/bin/bash
set -e

echo "🚀 Début du déploiement..."

# Aller dans le dossier
cd /var/www/voiture-app

# Pull les dernières modifications (si Git)
git pull origin main

# Rebuild les images
docker-compose -f docker-compose.prod.yml build

# Redémarrer les services
docker-compose -f docker-compose.prod.yml up -d

# Exécuter les migrations
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

echo "✅ Déploiement terminé !"
```

**Rendre exécutable** :

```bash
chmod +x /var/www/voiture-app/deploy.sh
```

**Utiliser** :

```bash
/var/www/voiture-app/deploy.sh
```

---

## 🔍 Étape 12 : Monitoring et Logs

### Voir les logs en temps réel

```bash
cd /var/www/voiture-app
docker-compose -f docker-compose.prod.yml logs -f
```

### Logs par service

```bash
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Vérifier l'état des services

```bash
docker-compose -f docker-compose.prod.yml ps
```

---

## 💾 Étape 13 : Sauvegardes Automatiques

### Script de backup PostgreSQL

```bash
nano /var/www/voiture-app/backup.sh
```

**Contenu** :

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/voiture-app"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker-compose -f /var/www/voiture-app/docker-compose.prod.yml exec -T postgres \
  pg_dump -U voiture_user voiture_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/voiture-app/backend/uploads

# Nettoyer les anciens backups (garder 7 jours)
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "✅ Backup créé : $DATE"
```

**Rendre exécutable** :

```bash
chmod +x /var/www/voiture-app/backup.sh
```

**Ajouter au cron (backup quotidien à 2h)** :

```bash
crontab -e

# Ajouter :
0 2 * * * /var/www/voiture-app/backup.sh
```

---

## 🛡️ Étape 14 : Sécurité

### Firewall UFW

```bash
# Installer UFW
apt install ufw -y

# Règles par défaut
ufw default deny incoming
ufw default allow outgoing

# Autoriser SSH
ufw allow 22/tcp

# Autoriser HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Activer
ufw enable
```

### Changer le port SSH (optionnel)

```bash
nano /etc/ssh/sshd_config

# Changer la ligne :
Port 2222

systemctl restart sshd

# Mettre à jour le firewall
ufw allow 2222/tcp
ufw delete allow 22/tcp
```

---

## 📊 Checklist de Déploiement

- [ ] VPS LWS loué et configuré
- [ ] Docker et Docker Compose installés
- [ ] Application transférée sur le VPS
- [ ] Fichiers .env configurés (secrets forts)
- [ ] Docker containers buildés et démarrés
- [ ] Base de données migrée et seedée
- [ ] Nginx configuré comme reverse proxy
- [ ] DNS configuré (A records)
- [ ] SSL installé (HTTPS)
- [ ] Storage des images configuré
- [ ] Script de déploiement créé
- [ ] Backups automatiques configurés
- [ ] Firewall activé
- [ ] Tests complets effectués

---

## 🧪 Tests Post-Déploiement

### Test 1 : Backend API

```bash
curl https://api.votre-domaine.com/api/health
```

**Résultat attendu** : `{"status":"ok"}`

### Test 2 : Frontend

```
https://votre-domaine.com
```

**Résultat attendu** : Page d'accueil chargée

### Test 3 : Login

1. Aller sur `https://votre-domaine.com/auth/login`
2. Se connecter avec `admin@voiture.com` / `admin123`
3. ✅ Devrait fonctionner

### Test 4 : Upload d'image

1. Créer une annonce
2. Uploader une image
3. ✅ L'image devrait être visible

---

## 🆘 Dépannage

### Problème : Services ne démarrent pas

```bash
docker-compose -f docker-compose.prod.yml logs
```

### Problème : Base de données ne se connecte pas

```bash
# Vérifier que PostgreSQL est démarré
docker-compose -f docker-compose.prod.yml ps postgres

# Voir les logs
docker-compose -f docker-compose.prod.yml logs postgres
```

### Problème : Frontend ne se charge pas

```bash
# Vérifier les logs Nginx
tail -f /var/log/nginx/error.log

# Vérifier le frontend
docker-compose -f docker-compose.prod.yml logs frontend
```

### Problème : SSL ne fonctionne pas

```bash
# Vérifier Certbot
certbot certificates

# Renouveler manuellement
certbot renew
```

---

## 💰 Coûts Estimés

| Service | Prix | Fréquence |
|---------|------|-----------|
| **VPS SSD Starter LWS** | 10-15€ | /mois |
| **Domaine .com** | 10€ | /an |
| **Stockage supplémentaire** | Optionnel | - |

**Total** : ~15€/mois + 10€/an

---

## 🔗 Ressources Utiles

- **Panel LWS** : https://panel.lws.fr
- **Documentation LWS VPS** : https://aide.lws.fr/
- **Support LWS** : support@lws.fr

---

## 📞 Commandes Utiles

```bash
# Redémarrer tous les services
docker-compose -f docker-compose.prod.yml restart

# Arrêter tous les services
docker-compose -f docker-compose.prod.yml down

# Voir l'utilisation des ressources
docker stats

# Nettoyer Docker
docker system prune -a

# Mise à jour du système
apt update && apt upgrade -y
```

---

## 🎉 Félicitations !

**Votre application est maintenant déployée sur LWS !**

**URLs** :
- Frontend : https://votre-domaine.com
- Backend API : https://api.votre-domaine.com
- Admin : https://votre-domaine.com/admin

---

## 📝 Notes Importantes

1. **Changez tous les mots de passe par défaut**
2. **Configurez les sauvegardes automatiques**
3. **Surveillez les logs régulièrement**
4. **Mettez à jour le système mensuellement**
5. **Testez les backups régulièrement**

**Bon déploiement ! 🚀**




