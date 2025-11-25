#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/voiture-app"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/voiture-app"

# Créer le dossier de backup
mkdir -p $BACKUP_DIR

echo "🔄 Début du backup - $DATE"

# Backup PostgreSQL
echo "📦 Backup de la base de données..."
docker-compose -f $APP_DIR/docker-compose.prod.yml exec -T postgres \
  pg_dump -U voiture_user voiture_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

if [ $? -eq 0 ]; then
    echo "✅ Base de données sauvegardée"
else
    echo "❌ Erreur lors du backup de la base de données"
fi

# Backup uploads
echo "📦 Backup des fichiers uploadés..."
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz $APP_DIR/backend/uploads

if [ $? -eq 0 ]; then
    echo "✅ Fichiers uploadés sauvegardés"
else
    echo "❌ Erreur lors du backup des fichiers"
fi

# Nettoyer les anciens backups (garder 7 jours)
echo "🧹 Nettoyage des anciens backups..."
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

# Afficher la taille des backups
echo ""
echo "📊 Backups disponibles :"
ls -lh $BACKUP_DIR | tail -10

echo ""
echo "✅ Backup terminé : $DATE"




