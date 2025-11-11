#!/bin/bash

# Script d'installation sur le serveur VPS
# À exécuter directement sur le serveur après le transfert FTP

echo "🚀 Installation de annonceauto.ci sur le serveur"
echo "================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Vérifier si on est root
if [ "$EUID" -ne 0 ]; then 
    print_error "Ce script doit être exécuté en tant que root (sudo)"
    exit 1
fi

print_info "Mise à jour du système..."
apt update && apt upgrade -y
print_success "Système mis à jour"

# Installer Node.js
print_info "Installation de Node.js 18 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    print_success "Node.js installé (version $(node -v))"
else
    print_success "Node.js déjà installé (version $(node -v))"
fi

# Installer PM2
print_info "Installation de PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    print_success "PM2 installé"
else
    print_success "PM2 déjà installé"
fi

# Installer Nginx
print_info "Installation de Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    print_success "Nginx installé et démarré"
else
    print_success "Nginx déjà installé"
fi

# Installer les outils de compilation
print_info "Installation des outils de compilation..."
apt install -y build-essential
print_success "Outils de compilation installés"

# Créer la structure des dossiers
print_info "Création de la structure des dossiers..."
mkdir -p /home/annonceauto/backend
mkdir -p /home/annonceauto/frontend
mkdir -p /home/annonceauto/backend/uploads
mkdir -p /home/annonceauto/backend/logs
mkdir -p /home/annonceauto/frontend/logs
print_success "Structure des dossiers créée"

# Configurer les permissions
print_info "Configuration des permissions..."
chmod 755 /home/annonceauto/backend/uploads
chown -R www-data:www-data /home/annonceauto/backend/uploads
print_success "Permissions configurées"

# Configurer le pare-feu
print_info "Configuration du pare-feu..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
print_success "Pare-feu configuré"

# Installer les dépendances du backend (si le dossier existe)
if [ -d "/home/annonceauto/backend/package.json" ]; then
    print_info "Installation des dépendances du backend..."
    cd /home/annonceauto/backend
    npm install
    print_success "Dépendances du backend installées"
fi

# Installer les dépendances du frontend (si le dossier existe)
if [ -d "/home/annonceauto/frontend/package.json" ]; then
    print_info "Installation des dépendances du frontend..."
    cd /home/annonceauto/frontend
    npm install
    print_success "Dépendances du frontend installées"
fi

# Configurer Nginx
print_info "Configuration de Nginx..."
cat > /etc/nginx/sites-available/annonceauto.ci << 'EOF'
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
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
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
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/annonceauto.ci /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester la configuration Nginx
if nginx -t; then
    systemctl restart nginx
    print_success "Nginx configuré et redémarré"
else
    print_error "Erreur dans la configuration Nginx"
    exit 1
fi

# Configuration de la base de données
print_info "Configuration de la base de données..."
if [ -f "/home/annonceauto/backend/prisma/schema.prisma" ]; then
    cd /home/annonceauto/backend
    npx prisma generate
    npx prisma migrate deploy
    print_success "Base de données configurée"
else
    print_error "Fichier schema.prisma non trouvé"
fi

# Démarrer les applications avec PM2
print_info "Démarrage des applications..."

# Arrêter les applications existantes si elles existent
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Démarrer le backend
if [ -f "/home/annonceauto/backend/ecosystem.config.js" ]; then
    cd /home/annonceauto/backend
    pm2 start ecosystem.config.js
    print_success "Backend démarré"
else
    print_error "Fichier ecosystem.config.js du backend non trouvé"
fi

# Démarrer le frontend
if [ -f "/home/annonceauto/frontend/ecosystem.config.js" ]; then
    cd /home/annonceauto/frontend
    pm2 start ecosystem.config.js
    print_success "Frontend démarré"
else
    print_error "Fichier ecosystem.config.js du frontend non trouvé"
fi

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
print_success "PM2 configuré pour démarrer au boot"

# Installer Certbot pour SSL
print_info "Installation de Certbot pour SSL..."
apt install -y certbot python3-certbot-nginx
print_success "Certbot installé"

print_info ""
print_success "==========================================="
print_success "Installation terminée avec succès !"
print_success "==========================================="
print_info ""
print_info "Prochaines étapes :"
print_info "1. Vérifiez que vos DNS pointent vers ce serveur"
print_info "2. Installez SSL avec : certbot --nginx -d annonceauto.ci -d www.annonceauto.ci -d api.annonceauto.ci"
print_info "3. Vérifiez les applications : pm2 status"
print_info "4. Consultez les logs : pm2 logs"
print_info ""
print_info "URLs :"
print_info "- Frontend : http://annonceauto.ci"
print_info "- Backend API : http://api.annonceauto.ci/api"
print_info ""
print_success "Votre site est maintenant en ligne ! 🎉"


