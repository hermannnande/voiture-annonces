#!/bin/bash

# Script de vérification avant déploiement
# À exécuter localement avant de transférer les fichiers

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║       🔍 VÉRIFICATION AVANT DÉPLOIEMENT - annonceauto.ci        ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Fonction de vérification
check_exists() {
    if [ -e "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
    fi
}

check_dir_exists() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
    fi
}

check_file_contains() {
    if [ -f "$1" ] && grep -q "$2" "$1"; then
        echo -e "${GREEN}✓${NC} $3"
    else
        echo -e "${YELLOW}⚠${NC} $3"
        ((WARNINGS++))
    fi
}

echo "═══════════════════════════════════════════════════════════════════"
echo "📦 VÉRIFICATION DU BACKEND"
echo "═══════════════════════════════════════════════════════════════════"

check_dir_exists "backend/dist" "Dossier dist/ compilé"
check_dir_exists "backend/node_modules" "Dossier node_modules/"
check_dir_exists "backend/prisma" "Dossier prisma/"

check_exists "backend/package.json" "Fichier package.json"
check_exists "backend/package-lock.json" "Fichier package-lock.json"
check_exists "backend/ecosystem.config.js" "Fichier ecosystem.config.js"
check_exists "backend/ENV_PRODUCTION.txt" "Fichier ENV_PRODUCTION.txt"

check_file_contains "backend/prisma/schema.prisma" "provider = \"mysql\"" "Schema Prisma configuré pour MySQL"

if [ -f "backend/.env" ]; then
    check_file_contains "backend/.env" "DATABASE_URL" ".env contient DATABASE_URL"
    check_file_contains "backend/.env" "JWT_SECRET" ".env contient JWT_SECRET"
else
    echo -e "${YELLOW}⚠${NC} Fichier .env non trouvé (sera créé à partir de ENV_PRODUCTION.txt)"
    ((WARNINGS++))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "🎨 VÉRIFICATION DU FRONTEND"
echo "═══════════════════════════════════════════════════════════════════"

check_dir_exists "frontend/.next" "Dossier .next/ compilé"
check_dir_exists "frontend/node_modules" "Dossier node_modules/"
check_dir_exists "frontend/public" "Dossier public/"

check_exists "frontend/package.json" "Fichier package.json"
check_exists "frontend/package-lock.json" "Fichier package-lock.json"
check_exists "frontend/next.config.js" "Fichier next.config.js"
check_exists "frontend/ecosystem.config.js" "Fichier ecosystem.config.js"
check_exists "frontend/ENV_PRODUCTION.txt" "Fichier ENV_PRODUCTION.txt"

if [ -f "frontend/.env.production" ]; then
    check_file_contains "frontend/.env.production" "NEXT_PUBLIC_API_URL" ".env.production contient NEXT_PUBLIC_API_URL"
else
    echo -e "${YELLOW}⚠${NC} Fichier .env.production non trouvé (sera créé à partir de ENV_PRODUCTION.txt)"
    ((WARNINGS++))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "📄 VÉRIFICATION DE LA DOCUMENTATION"
echo "═══════════════════════════════════════════════════════════════════"

check_exists "DEMARRAGE_RAPIDE.md" "Guide de démarrage rapide"
check_exists "README_DEPLOIEMENT_FTP.md" "Guide de déploiement FTP"
check_exists "GUIDE_DEPLOIEMENT.md" "Guide de déploiement complet"
check_exists "FICHIERS_A_TRANSFERER.txt" "Liste des fichiers à transférer"
check_exists "STRUCTURE_COMPLETE.txt" "Structure complète du projet"
check_exists "install-server.sh" "Script d'installation serveur"
check_exists "prepare-deploy.sh" "Script de préparation (Linux/Mac)"
check_exists "prepare-deploy.ps1" "Script de préparation (Windows)"
check_exists "nginx.conf" "Configuration Nginx"

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "📊 RÉSUMÉ"
echo "═══════════════════════════════════════════════════════════════════"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ PARFAIT !${NC} Tous les fichiers sont prêts pour le déploiement."
    echo ""
    echo "🚀 Prochaines étapes :"
    echo "   1. Exécutez 'prepare-deploy.sh' pour compiler le projet"
    echo "   2. Suivez le guide DEMARRAGE_RAPIDE.md"
    echo "   3. Transférez les fichiers via FTP"
    echo "   4. Exécutez install-server.sh sur le serveur"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ ATTENTION :${NC} $WARNINGS avertissement(s)"
    echo "Le déploiement est possible, mais vérifiez les avertissements ci-dessus."
    echo ""
    echo "💡 Conseil : Exécutez 'prepare-deploy.sh' pour créer les fichiers manquants."
else
    echo -e "${RED}❌ ERREUR :${NC} $ERRORS erreur(s) et $WARNINGS avertissement(s)"
    echo "Vous devez corriger les erreurs avant de déployer."
    echo ""
    echo "🔧 Actions à faire :"
    if [ ! -d "backend/dist" ]; then
        echo "   - Compilez le backend : cd backend && npm run build"
    fi
    if [ ! -d "frontend/.next" ]; then
        echo "   - Compilez le frontend : cd frontend && npm run build"
    fi
    if [ ! -d "backend/node_modules" ]; then
        echo "   - Installez les dépendances backend : cd backend && npm install"
    fi
    if [ ! -d "frontend/node_modules" ]; then
        echo "   - Installez les dépendances frontend : cd frontend && npm install"
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "📋 INFORMATIONS DE CONNEXION"
echo "═══════════════════════════════════════════════════════════════════"

echo "🖥️  Serveur FTP/SSH"
echo "   Hôte : vps116108.serveur-vps.net"
echo "   User : root"
echo "   Pass : U9p0j2o8Y2h2C7C"
echo ""
echo "🗄️  Base de données"
echo "   Nom  : c0ann5434"
echo "   User : c0ann5434"
echo "   Pass : \$J-ZFr!Huo))_"
echo ""
echo "🌐 Domaine"
echo "   Site : annonceauto.ci"
echo "   API  : api.annonceauto.ci"

echo ""
echo "═══════════════════════════════════════════════════════════════════"

exit $ERRORS



