# ⚡ Guide Rapide - Déploiement LWS

## 🎯 Vue Rapide

Votre site nécessite :
- Backend Node.js (NestJS)
- Frontend Next.js
- Base de données PostgreSQL
- Redis

---

## ✅ Solution Recommandée : VPS LWS

**Prix** : ~15€/mois

**Pourquoi** :
- ✅ Supporte Docker
- ✅ PostgreSQL natif
- ✅ Contrôle total
- ✅ Node.js sans limite

---

## 📋 Checklist Rapide

### 1️⃣ Louer un VPS chez LWS

1. **Aller sur** : https://www.lws.fr/serveur_dedie_linux.php
2. **Choisir** : VPS SSD Starter (minimum)
3. **OS** : Ubuntu 22.04 LTS
4. **Noter l'IP du VPS** : `XX.XX.XX.XX`

---

### 2️⃣ Se Connecter au VPS

```bash
ssh root@VOTRE_IP_VPS
```

---

### 3️⃣ Installer Docker (Copier-Coller)

```bash
# Mettre à jour
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Installer Docker Compose
apt install docker-compose git nginx -y

# Activer
systemctl enable docker nginx
systemctl start nginx
```

---

### 4️⃣ Transférer Votre Application

**Option A - Via Git (si vous avez un dépôt)** :
```bash
cd /var/www
git clone https://votre-depot.git voiture-app
```

**Option B - Via SFTP** :
1. Utiliser **FileZilla** ou **WinSCP**
2. Connecter : `VOTRE_IP_VPS`, port `22`
3. Uploader vos fichiers dans `/var/www/voiture-app`

---

### 5️⃣ Configurer les Variables d'Environnement

```bash
cd /var/www/voiture-app
nano backend/.env
```

**Copier-coller et modifier** :

```env
DATABASE_URL="postgresql://voiture_user:CHANGEZ_MOI@postgres:5432/voiture_db?schema=public"
JWT_SECRET=GENERER_SECRET_FORT_32_CARACTERES
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=AUTRE_SECRET_FORT_32_CARACTERES
JWT_REFRESH_EXPIRATION=7d
REDIS_HOST=redis
REDIS_PORT=6379
NODE_ENV=production
PORT=3001
```

**Générer des secrets** :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Frontend** :
```bash
nano frontend/.env.local
```

**Contenu** :
```env
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api
```

---

### 6️⃣ Créer docker-compose.prod.yml

```bash
cd /var/www/voiture-app
nano docker-compose.prod.yml
```

**Copier tout le contenu de `DEPLOIEMENT_LWS.md` section docker-compose.prod.yml**

---

### 7️⃣ Lancer l'Application

```bash
cd /var/www/voiture-app

# Définir le mot de passe PostgreSQL
export DB_PASSWORD="VOTRE_MOT_DE_PASSE_FORT"

# Builder
docker-compose -f docker-compose.prod.yml build

# Démarrer
docker-compose -f docker-compose.prod.yml up -d

# Migrer la DB
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed
docker-compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

---

### 8️⃣ Configurer Nginx

```bash
nano /etc/nginx/sites-available/voiture-app
```

**Contenu** (ADAPTER votre-domaine.com) :

```nginx
server {
    listen 80;
    server_name api.votre-domaine.com;
    client_max_body_size 50M;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    client_max_body_size 50M;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Activer** :
```bash
ln -s /etc/nginx/sites-available/voiture-app /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

### 9️⃣ Configurer le DNS chez LWS

1. **Aller sur** : https://panel.lws.fr
2. **Domaines** → Votre domaine → **Zone DNS**
3. **Ajouter ces enregistrements** :

| Type | Nom | Valeur | TTL |
|------|-----|--------|-----|
| A | @ | VOTRE_IP_VPS | 3600 |
| A | www | VOTRE_IP_VPS | 3600 |
| A | api | VOTRE_IP_VPS | 3600 |

**⚠️ Attendre 2-24h pour la propagation DNS**

---

### 🔟 Installer SSL (HTTPS)

```bash
# Installer Certbot
apt install certbot python3-certbot-nginx -y

# Générer les certificats
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com -d api.votre-domaine.com
```

**Suivre les instructions à l'écran.**

---

## 🎉 C'est Fini !

**Votre site est maintenant en ligne !**

**URLs** :
- Frontend : https://votre-domaine.com
- API : https://api.votre-domaine.com/api
- Admin : https://votre-domaine.com/admin

---

## 🧪 Tests

```bash
# Test API
curl https://api.votre-domaine.com/api/health

# Test Frontend
https://votre-domaine.com
```

---

## 📊 Commandes Utiles

```bash
# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f

# Redémarrer
docker-compose -f docker-compose.prod.yml restart

# Arrêter
docker-compose -f docker-compose.prod.yml down

# Vérifier l'état
docker-compose -f docker-compose.prod.yml ps
```

---

## 🆘 Problèmes Courants

### DNS ne propage pas
**Solution** : Attendre 2-24h

### Nginx ne démarre pas
```bash
nginx -t
systemctl status nginx
```

### Docker ne build pas
```bash
docker-compose -f docker-compose.prod.yml logs
```

---

## 💰 Coût Total

- **VPS LWS** : ~15€/mois
- **Domaine** : ~10€/an
- **Total** : ~15€/mois

---

## 📚 Documentation Complète

Voir `DEPLOIEMENT_LWS.md` pour le guide détaillé avec :
- Scripts de sauvegarde
- Monitoring
- Sécurité avancée
- Dépannage complet

---

**Bon déploiement ! 🚀**




