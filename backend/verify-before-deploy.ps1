# Script de vérification avant déploiement (Windows PowerShell)
# À exécuter localement avant de transférer les fichiers

Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                                  ║" -ForegroundColor Cyan
Write-Host "║       🔍 VÉRIFICATION AVANT DÉPLOIEMENT - annonceauto.ci        ║" -ForegroundColor Cyan
Write-Host "║                                                                  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$ERRORS = 0
$WARNINGS = 0

# Fonction de vérification
function Check-Exists {
    param($Path, $Description)
    if (Test-Path $Path) {
        Write-Host "✓ $Description" -ForegroundColor Green
    } else {
        Write-Host "✗ $Description" -ForegroundColor Red
        $script:ERRORS++
    }
}

function Check-FileContains {
    param($Path, $Pattern, $Description)
    if ((Test-Path $Path) -and (Select-String -Path $Path -Pattern $Pattern -Quiet)) {
        Write-Host "✓ $Description" -ForegroundColor Green
    } else {
        Write-Host "⚠ $Description" -ForegroundColor Yellow
        $script:WARNINGS++
    }
}

Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White
Write-Host "📦 VÉRIFICATION DU BACKEND" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White

Check-Exists "backend\dist" "Dossier dist/ compilé"
Check-Exists "backend\node_modules" "Dossier node_modules/"
Check-Exists "backend\prisma" "Dossier prisma/"
Check-Exists "backend\package.json" "Fichier package.json"
Check-Exists "backend\package-lock.json" "Fichier package-lock.json"
Check-Exists "backend\ecosystem.config.js" "Fichier ecosystem.config.js"
Check-Exists "backend\ENV_PRODUCTION.txt" "Fichier ENV_PRODUCTION.txt"

Check-FileContains "backend\prisma\schema.prisma" "provider = `"mysql`"" "Schema Prisma configuré pour MySQL"

if (Test-Path "backend\.env") {
    Check-FileContains "backend\.env" "DATABASE_URL" ".env contient DATABASE_URL"
    Check-FileContains "backend\.env" "JWT_SECRET" ".env contient JWT_SECRET"
} else {
    Write-Host "⚠ Fichier .env non trouvé (sera créé à partir de ENV_PRODUCTION.txt)" -ForegroundColor Yellow
    $WARNINGS++
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White
Write-Host "🎨 VÉRIFICATION DU FRONTEND" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White

Check-Exists "frontend\.next" "Dossier .next/ compilé"
Check-Exists "frontend\node_modules" "Dossier node_modules/"
Check-Exists "frontend\public" "Dossier public/"
Check-Exists "frontend\package.json" "Fichier package.json"
Check-Exists "frontend\package-lock.json" "Fichier package-lock.json"
Check-Exists "frontend\next.config.js" "Fichier next.config.js"
Check-Exists "frontend\ecosystem.config.js" "Fichier ecosystem.config.js"
Check-Exists "frontend\ENV_PRODUCTION.txt" "Fichier ENV_PRODUCTION.txt"

if (Test-Path "frontend\.env.production") {
    Check-FileContains "frontend\.env.production" "NEXT_PUBLIC_API_URL" ".env.production contient NEXT_PUBLIC_API_URL"
} else {
    Write-Host "⚠ Fichier .env.production non trouvé (sera créé à partir de ENV_PRODUCTION.txt)" -ForegroundColor Yellow
    $WARNINGS++
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White
Write-Host "📄 VÉRIFICATION DE LA DOCUMENTATION" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White

Check-Exists "DEMARRAGE_RAPIDE.md" "Guide de démarrage rapide"
Check-Exists "README_DEPLOIEMENT_FTP.md" "Guide de déploiement FTP"
Check-Exists "GUIDE_DEPLOIEMENT.md" "Guide de déploiement complet"
Check-Exists "FICHIERS_A_TRANSFERER.txt" "Liste des fichiers à transférer"
Check-Exists "STRUCTURE_COMPLETE.txt" "Structure complète du projet"
Check-Exists "install-server.sh" "Script d'installation serveur"
Check-Exists "prepare-deploy.sh" "Script de préparation (Linux/Mac)"
Check-Exists "prepare-deploy.ps1" "Script de préparation (Windows)"
Check-Exists "nginx.conf" "Configuration Nginx"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White
Write-Host "📊 RÉSUMÉ" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White

if ($ERRORS -eq 0 -and $WARNINGS -eq 0) {
    Write-Host "✅ PARFAIT ! Tous les fichiers sont prêts pour le déploiement." -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Prochaines étapes :" -ForegroundColor Cyan
    Write-Host "   1. Exécutez '.\prepare-deploy.ps1' pour compiler le projet" -ForegroundColor White
    Write-Host "   2. Suivez le guide DEMARRAGE_RAPIDE.md" -ForegroundColor White
    Write-Host "   3. Transférez les fichiers via FTP" -ForegroundColor White
    Write-Host "   4. Exécutez install-server.sh sur le serveur" -ForegroundColor White
} elseif ($ERRORS -eq 0) {
    Write-Host "⚠ ATTENTION : $WARNINGS avertissement(s)" -ForegroundColor Yellow
    Write-Host "Le déploiement est possible, mais vérifiez les avertissements ci-dessus." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Conseil : Exécutez '.\prepare-deploy.ps1' pour créer les fichiers manquants." -ForegroundColor Cyan
} else {
    Write-Host "❌ ERREUR : $ERRORS erreur(s) et $WARNINGS avertissement(s)" -ForegroundColor Red
    Write-Host "Vous devez corriger les erreurs avant de déployer." -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Actions à faire :" -ForegroundColor Yellow
    if (-not (Test-Path "backend\dist")) {
        Write-Host "   - Compilez le backend : cd backend && npm run build" -ForegroundColor White
    }
    if (-not (Test-Path "frontend\.next")) {
        Write-Host "   - Compilez le frontend : cd frontend && npm run build" -ForegroundColor White
    }
    if (-not (Test-Path "backend\node_modules")) {
        Write-Host "   - Installez les dépendances backend : cd backend && npm install" -ForegroundColor White
    }
    if (-not (Test-Path "frontend\node_modules")) {
        Write-Host "   - Installez les dépendances frontend : cd frontend && npm install" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White
Write-Host "📋 INFORMATIONS DE CONNEXION" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White

Write-Host "🖥️  Serveur FTP/SSH" -ForegroundColor Cyan
Write-Host "   Hôte : vps116108.serveur-vps.net" -ForegroundColor White
Write-Host "   User : root" -ForegroundColor White
Write-Host "   Pass : U9p0j2o8Y2h2C7C" -ForegroundColor White
Write-Host ""
Write-Host "🗄️  Base de données" -ForegroundColor Cyan
Write-Host "   Nom  : c0ann5434" -ForegroundColor White
Write-Host "   User : c0ann5434" -ForegroundColor White
Write-Host "   Pass : `$J-ZFr!Huo))_" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Domaine" -ForegroundColor Cyan
Write-Host "   Site : annonceauto.ci" -ForegroundColor White
Write-Host "   API  : api.annonceauto.ci" -ForegroundColor White

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor White

if ($ERRORS -gt 0) {
    exit 1
}



