# Script de lancement automatique du site en local
# Exécuter : .\start-local.ps1

Write-Host "🚀 Lancement de annonceauto.ci en local..." -ForegroundColor Green
Write-Host ""

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Erreur : Ce script doit être exécuté depuis le dossier racine 'voiture 5'" -ForegroundColor Red
    Write-Host "   Dossier actuel : $PWD" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Vérification de l'environnement..." -ForegroundColor Cyan

# Vérifier si .env existe dans backend
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Fichier backend\.env non trouvé" -ForegroundColor Yellow
    Write-Host "   Création d'un fichier .env basique..." -ForegroundColor Yellow
    
    @"
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev_secret_123"
JWT_REFRESH_SECRET="dev_refresh_secret_123"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
FRONTEND_URL="http://localhost:3000"
BACKEND_PORT=3001
NODE_ENV=development
UPLOAD_PATH="./uploads"
"@ | Out-File -FilePath "backend\.env" -Encoding utf8
    
    Write-Host "   ✅ Fichier .env créé avec SQLite" -ForegroundColor Green
}

# Vérifier si .env.local existe dans frontend
if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "⚠️  Fichier frontend\.env.local non trouvé" -ForegroundColor Yellow
    Write-Host "   Création du fichier..." -ForegroundColor Yellow
    
    @"
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
"@ | Out-File -FilePath "frontend\.env.local" -Encoding utf8
    
    Write-Host "   ✅ Fichier .env.local créé" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Lancement du BACKEND (port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🔧 BACKEND - http://localhost:3001/api' -ForegroundColor Green; npm run start:dev"

Write-Host "⏳ Attente du démarrage du backend (10 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🎨 Lancement du FRONTEND (port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '🎨 FRONTEND - http://localhost:3000' -ForegroundColor Green; npm run dev"

Write-Host "⏳ Attente du démarrage du frontend (15 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "🌐 Ouverture du navigateur..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                              ║" -ForegroundColor Green
Write-Host "║           ✅ Site lancé avec succès !                        ║" -ForegroundColor Green
Write-Host "║                                                              ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs :" -ForegroundColor Cyan
Write-Host "   Frontend : http://localhost:3000" -ForegroundColor White
Write-Host "   Backend  : http://localhost:3001/api" -ForegroundColor White
Write-Host ""
Write-Host "💡 Conseils :" -ForegroundColor Cyan
Write-Host "   - Gardez les deux fenêtres PowerShell ouvertes" -ForegroundColor White
Write-Host "   - Pour arrêter : CTRL+C dans chaque fenêtre" -ForegroundColor White
Write-Host "   - Les modifications sont détectées automatiquement" -ForegroundColor White
Write-Host ""
Write-Host "🗄️  Base de données :" -ForegroundColor Cyan
Write-Host "   Pour voir les données : cd backend && npx prisma studio" -ForegroundColor White
Write-Host ""
Write-Host "Bon développement ! 🚀" -ForegroundColor Green


