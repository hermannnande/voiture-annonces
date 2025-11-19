# Script de Déploiement Automatique pour Windows
# Exécuter ce script pour préparer les fichiers pour le déploiement

Write-Host "🚀 Préparation du déploiement pour annonceauto.ci" -ForegroundColor Green

# Backend
Write-Host "`n📦 Compilation du Backend..." -ForegroundColor Yellow
Set-Location -Path ".\backend"

# Copier le fichier d'environnement
Copy-Item "ENV_PRODUCTION.txt" ".env"

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Compiler le projet
npm run build

Write-Host "✅ Backend compilé avec succès!" -ForegroundColor Green

# Frontend
Write-Host "`n📦 Compilation du Frontend..." -ForegroundColor Yellow
Set-Location -Path "..\frontend"

# Copier le fichier d'environnement
Copy-Item "ENV_PRODUCTION.txt" ".env.production"

# Installer les dépendances
npm install

# Compiler le projet
npm run build

Write-Host "✅ Frontend compilé avec succès!" -ForegroundColor Green

Set-Location -Path ".."

Write-Host "`n✨ Compilation terminée!" -ForegroundColor Green
Write-Host "`n📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Connectez-vous à votre serveur FTP (FileZilla, WinSCP, etc.)" -ForegroundColor White
Write-Host "2. Transférez les dossiers suivants:" -ForegroundColor White
Write-Host "   - backend/dist/ -> /home/annonceauto/backend/dist/" -ForegroundColor White
Write-Host "   - backend/node_modules/ -> /home/annonceauto/backend/node_modules/" -ForegroundColor White
Write-Host "   - backend/prisma/ -> /home/annonceauto/backend/prisma/" -ForegroundColor White
Write-Host "   - backend/package*.json -> /home/annonceauto/backend/" -ForegroundColor White
Write-Host "   - backend/.env -> /home/annonceauto/backend/.env" -ForegroundColor White
Write-Host "   - backend/ecosystem.config.js -> /home/annonceauto/backend/" -ForegroundColor White
Write-Host "   - frontend/.next/ -> /home/annonceauto/frontend/.next/" -ForegroundColor White
Write-Host "   - frontend/node_modules/ -> /home/annonceauto/frontend/node_modules/" -ForegroundColor White
Write-Host "   - frontend/public/ -> /home/annonceauto/frontend/public/" -ForegroundColor White
Write-Host "   - frontend/package*.json -> /home/annonceauto/frontend/" -ForegroundColor White
Write-Host "   - frontend/.env.production -> /home/annonceauto/frontend/" -ForegroundColor White
Write-Host "   - frontend/next.config.js -> /home/annonceauto/frontend/" -ForegroundColor White
Write-Host "   - frontend/ecosystem.config.js -> /home/annonceauto/frontend/" -ForegroundColor White
Write-Host "`n3. Suivez le guide GUIDE_DEPLOIEMENT.md pour la configuration du serveur" -ForegroundColor White

Write-Host "`n🔐 Informations de connexion FTP:" -ForegroundColor Cyan
Write-Host "Hôte: vps116108.serveur-vps.net" -ForegroundColor White
Write-Host "Utilisateur: root" -ForegroundColor White
Write-Host "Mot de passe: U9p0j2o8Y2h2C7C" -ForegroundColor White
Write-Host "Port: 22 (SFTP recommandé)" -ForegroundColor White



