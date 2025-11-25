#!/bin/bash
set -e

echo "🚀 Démarrage de la production..."

echo "📦 Génération du client Prisma..."
npx prisma generate

echo "🔄 Synchronisation de la base de données..."
npx prisma db push --accept-data-loss

echo "🌱 Exécution du seed..."
npx prisma db seed

echo "✅ Configuration terminée, démarrage du serveur..."
npm run start:prod

