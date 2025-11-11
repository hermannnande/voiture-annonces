#!/bin/bash

# Script de démarrage automatique pour le projet Annonces Auto CI

set -e

echo "🚗 Annonces Auto CI - Démarrage automatique"
echo "============================================"
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker Desktop."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé."
    exit 1
fi

# Déterminer la commande docker compose
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo "✅ Docker détecté"
echo ""

# Créer le fichier .env si nécessaire
if [ ! -f backend/.env ]; then
    echo "📝 Création du fichier .env..."
    cp env.example backend/.env
    echo "✅ Fichier .env créé"
fi

echo "🐳 Démarrage des conteneurs Docker..."
$DOCKER_COMPOSE up -d

echo "⏳ Attente que les services soient prêts (30 secondes)..."
sleep 30

echo "🗄️  Génération du client Prisma..."
$DOCKER_COMPOSE exec backend npx prisma generate || true

echo "🔄 Application des migrations de base de données..."
$DOCKER_COMPOSE exec backend npx prisma migrate deploy || true

echo "🌱 Seed de la base de données..."
$DOCKER_COMPOSE exec backend npm run prisma:seed || true

echo ""
echo "✅ Installation terminée avec succès !"
echo ""
echo "🌐 Services disponibles :"
echo "   - Frontend:      http://localhost:3000"
echo "   - Backend API:   http://localhost:3001/api"
echo "   - MailDev:       http://localhost:1080"
echo ""
echo "👤 Comptes de test :"
echo "   - Super Admin:   admin@voiture.com / admin123"
echo "   - Vendeur 1:     vendeur1@gmail.com / seller123"
echo "   - Vendeur 2:     vendeur2@gmail.com / seller123"
echo ""
echo "📋 Commandes utiles :"
echo "   - Voir les logs:           $DOCKER_COMPOSE logs -f"
echo "   - Arrêter les services:    $DOCKER_COMPOSE down"
echo "   - Redémarrer:              $DOCKER_COMPOSE restart"
echo "   - Prisma Studio:           $DOCKER_COMPOSE exec backend npx prisma studio"
echo ""
echo "🎉 Bon développement !"





