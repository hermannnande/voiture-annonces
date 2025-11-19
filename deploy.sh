#!/bin/bash
set -e

echo "🚀 Début du déploiement..."

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Aller dans le dossier
cd /var/www/voiture-app

# Pull les dernières modifications (si Git)
if [ -d ".git" ]; then
    echo -e "${YELLOW}📥 Pull des dernières modifications...${NC}"
    git pull origin main
fi

# Rebuild les images
echo -e "${YELLOW}🏗️  Build des images Docker...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache

# Redémarrer les services
echo -e "${YELLOW}🔄 Redémarrage des services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Attendre que le backend soit prêt
echo -e "${YELLOW}⏳ Attente du démarrage du backend...${NC}"
sleep 10

# Exécuter les migrations
echo -e "${YELLOW}🗄️  Exécution des migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

# Afficher l'état
echo -e "${YELLOW}📊 État des services :${NC}"
docker-compose -f docker-compose.prod.yml ps

echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
echo ""
echo "🌐 Votre site est accessible sur :"
echo "   - Frontend: https://votre-domaine.com"
echo "   - API: https://api.votre-domaine.com"
echo ""




