#!/bin/bash

# Script de Déploiement Automatique pour Linux/Mac
# Exécuter ce script pour préparer les fichiers pour le déploiement

echo "🚀 Préparation du déploiement pour annonceauto.ci"

# Backend
echo ""
echo "📦 Compilation du Backend..."
cd ./backend

# Copier le fichier d'environnement
cp ENV_PRODUCTION.txt .env

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Compiler le projet
npm run build

echo "✅ Backend compilé avec succès!"

# Frontend
echo ""
echo "📦 Compilation du Frontend..."
cd ../frontend

# Copier le fichier d'environnement
cp ENV_PRODUCTION.txt .env.production

# Installer les dépendances
npm install

# Compiler le projet
npm run build

echo "✅ Frontend compilé avec succès!"

cd ..

echo ""
echo "✨ Compilation terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Connectez-vous à votre serveur FTP (FileZilla, WinSCP, etc.)"
echo "2. Transférez les dossiers suivants:"
echo "   - backend/dist/ -> /home/annonceauto/backend/dist/"
echo "   - backend/node_modules/ -> /home/annonceauto/backend/node_modules/"
echo "   - backend/prisma/ -> /home/annonceauto/backend/prisma/"
echo "   - backend/package*.json -> /home/annonceauto/backend/"
echo "   - backend/.env -> /home/annonceauto/backend/.env"
echo "   - backend/ecosystem.config.js -> /home/annonceauto/backend/"
echo "   - frontend/.next/ -> /home/annonceauto/frontend/.next/"
echo "   - frontend/node_modules/ -> /home/annonceauto/frontend/node_modules/"
echo "   - frontend/public/ -> /home/annonceauto/frontend/public/"
echo "   - frontend/package*.json -> /home/annonceauto/frontend/"
echo "   - frontend/.env.production -> /home/annonceauto/frontend/"
echo "   - frontend/next.config.js -> /home/annonceauto/frontend/"
echo "   - frontend/ecosystem.config.js -> /home/annonceauto/frontend/"
echo ""
echo "3. Suivez le guide GUIDE_DEPLOIEMENT.md pour la configuration du serveur"
echo ""
echo "🔐 Informations de connexion FTP:"
echo "Hôte: vps116108.serveur-vps.net"
echo "Utilisateur: root"
echo "Mot de passe: U9p0j2o8Y2h2C7C"
echo "Port: 22 (SFTP recommandé)"


