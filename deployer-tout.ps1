# Script pour déployer TOUS les changements
# Usage: .\deployer-tout.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DÉPLOIEMENT DE TOUS LES CHANGEMENTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Fichiers modifiés détectés :" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔧 CORRECTIONS CRASH ADMIN/PUBLICATION :" -ForegroundColor Magenta
Write-Host "  ✅ backend/src/prisma/prisma.service.ts - Retry logic + monitoring" -ForegroundColor Green
Write-Host "  ✅ backend/src/main.ts - Shutdown hooks" -ForegroundColor Green
Write-Host "  ✅ backend/Dockerfile - Optimisations" -ForegroundColor Green
Write-Host "  ✅ backend/railway.json - Migrations auto" -ForegroundColor Green
Write-Host ""

Write-Host "📝 KILOMÉTRAGE OPTIONNEL :" -ForegroundColor Magenta
Write-Host "  ✅ backend/prisma/schema.prisma - mileageKm nullable" -ForegroundColor Green
Write-Host "  ✅ backend/src/listings/dto/create-listing.dto.ts - @IsOptional()" -ForegroundColor Green
Write-Host "  ✅ frontend/src/app/dashboard/listings/create/page.tsx - required retiré" -ForegroundColor Green
Write-Host "  ✅ frontend/src/app/dashboard/listings/[id]/edit/page.tsx - required retiré" -ForegroundColor Green
Write-Host ""

Write-Host "📚 DOCUMENTATION & GUIDES :" -ForegroundColor Magenta
Write-Host "  ✅ 13 fichiers de documentation (.md)" -ForegroundColor Green
Write-Host "  ✅ 3 scripts PowerShell (.ps1)" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  ATTENTION : Migration Prisma nécessaire !" -ForegroundColor Yellow
Write-Host ""

# Demander confirmation
$confirm = Read-Host "Voulez-vous créer la migration Prisma AVANT de commiter ? (O/n)"

if ($confirm -ne 'n' -and $confirm -ne 'N') {
    Write-Host ""
    Write-Host "📦 Création de la migration Prisma..." -ForegroundColor Cyan
    
    Push-Location backend
    
    Write-Host "Génération du client Prisma..." -ForegroundColor Gray
    npx prisma generate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Client Prisma généré" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Création de la migration..." -ForegroundColor Gray
        npx prisma migrate dev --name make_mileage_optional_and_optimize
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Migration créée avec succès !" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "⚠️  Migration échouée (normal si DB distante)" -ForegroundColor Yellow
            Write-Host "La migration sera appliquée sur Railway au déploiement" -ForegroundColor Gray
        }
    }
    
    Pop-Location
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   COMMIT ET PUSH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$deployConfirm = Read-Host "Voulez-vous commit et push TOUS les changements maintenant ? (O/n)"

if ($deployConfirm -ne 'n' -and $deployConfirm -ne 'N') {
    Write-Host ""
    Write-Host "📦 Git add..." -ForegroundColor Cyan
    
    git add .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Tous les fichiers ajoutés" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "📝 Git commit..." -ForegroundColor Cyan
        
        $commitMessage = @"
fix(backend+frontend): corrections crash admin + kilométrage optionnel

🔧 CORRECTIONS CRASH ADMIN/PUBLICATION:
- PrismaService: retry logic (3 tentatives) + monitoring requêtes lentes
- main.ts: shutdown hooks Prisma activés
- Dockerfile: optimisations build + healthcheck
- railway.json: migrations Prisma automatiques

📝 KILOMÉTRAGE OPTIONNEL:
- Schema Prisma: mileageKm devient nullable (Int?)
- DTO backend: @IsOptional() ajouté sur mileageKm
- Frontend création: champ required retiré + placeholder mis à jour
- Frontend édition: champ required retiré + placeholder mis à jour

📚 DOCUMENTATION:
- 13 guides complets (.md) pour déploiement et configuration
- 4 scripts PowerShell (.ps1) d'automatisation
- Diagnostics détaillés et solutions de problèmes

🎯 IMPACT:
- Backend plus stable (retry logic + monitoring)
- Kilométrage maintenant optionnel lors création annonce
- Documentation complète pour maintenance future
"@
        
        git commit -m "$commitMessage"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Commit créé" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "🚀 Git push..." -ForegroundColor Cyan
            git push origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "========================================" -ForegroundColor Green
                Write-Host "   ✅ PUSH RÉUSSI !" -ForegroundColor Green
                Write-Host "========================================" -ForegroundColor Green
                Write-Host ""
                
                Write-Host "📊 DÉPLOIEMENTS AUTOMATIQUES EN COURS :" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "  🚂 Railway Backend:" -ForegroundColor Yellow
                Write-Host "     - Détection du push: 30 secondes" -ForegroundColor Gray
                Write-Host "     - Build Docker: 2-3 minutes" -ForegroundColor Gray
                Write-Host "     - Déploiement: 1 minute" -ForegroundColor Gray
                Write-Host "     - Total: ~4-5 minutes" -ForegroundColor White
                Write-Host ""
                Write-Host "  ▲ Vercel Frontend:" -ForegroundColor Yellow
                Write-Host "     - Détection du push: 10 secondes" -ForegroundColor Gray
                Write-Host "     - Build Next.js: 1-2 minutes" -ForegroundColor Gray
                Write-Host "     - Déploiement: 30 secondes" -ForegroundColor Gray
                Write-Host "     - Total: ~2-3 minutes" -ForegroundColor White
                Write-Host ""
                
                Write-Host "⏰ Attendez environ 5 minutes puis testez !" -ForegroundColor Cyan
                Write-Host ""
                
                Write-Host "========================================" -ForegroundColor Cyan
                Write-Host "   LIENS UTILES" -ForegroundColor Cyan
                Write-Host "========================================" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "Railway Dashboard:" -ForegroundColor Yellow
                Write-Host "  https://railway.app/" -ForegroundColor White
                Write-Host ""
                Write-Host "Vercel Dashboard:" -ForegroundColor Yellow
                Write-Host "  https://vercel.com/dashboard" -ForegroundColor White
                Write-Host ""
                Write-Host "Votre site:" -ForegroundColor Yellow
                Write-Host "  https://www.annonceauto.ci" -ForegroundColor White
                Write-Host ""
                
            } else {
                Write-Host ""
                Write-Host "❌ ERREUR lors du push" -ForegroundColor Red
                Write-Host ""
                Write-Host "Causes possibles:" -ForegroundColor Yellow
                Write-Host "  1. Pas d'accès internet" -ForegroundColor Gray
                Write-Host "  2. Pas authentifié sur GitHub (git config)" -ForegroundColor Gray
                Write-Host "  3. Pas de droits sur le repository" -ForegroundColor Gray
                Write-Host ""
                Write-Host "Solution:" -ForegroundColor Yellow
                Write-Host "  git push origin main" -ForegroundColor White
            }
        } else {
            Write-Host ""
            Write-Host "❌ ERREUR lors du commit" -ForegroundColor Red
        }
    } else {
        Write-Host ""
        Write-Host "❌ ERREUR lors du git add" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Déploiement annulé" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour déployer manuellement:" -ForegroundColor Gray
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m `"fix: corrections crash + kilométrage optionnel`"" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TESTS POST-DÉPLOIEMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Checklist à vérifier (après 5 minutes):" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Railway Backend:" -ForegroundColor White
Write-Host "   [ ] Status: Active (vert)" -ForegroundColor Gray
Write-Host "   [ ] Logs: '✅ Connexion à la base de données réussie'" -ForegroundColor Gray
Write-Host "   [ ] API Health: https://votre-backend.railway.app/api/health" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Vercel Frontend:" -ForegroundColor White
Write-Host "   [ ] Status: Ready (vert)" -ForegroundColor Gray
Write-Host "   [ ] Site accessible: https://www.annonceauto.ci" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Tests Fonctionnels:" -ForegroundColor White
Write-Host "   [ ] Connexion admin fonctionne (pas de crash)" -ForegroundColor Gray
Write-Host "   [ ] Création annonce AVEC kilométrage fonctionne" -ForegroundColor Gray
Write-Host "   [ ] Création annonce SANS kilométrage fonctionne" -ForegroundColor Gray
Write-Host ""

Write-Host "🔍 Pour tester automatiquement:" -ForegroundColor Cyan
Write-Host "  .\test-deployment.ps1" -ForegroundColor White
Write-Host ""

Write-Host "📚 Documentation complète:" -ForegroundColor Cyan
Write-Host "  - DEMARRAGE_ICI.md - Guide principal" -ForegroundColor Gray
Write-Host "  - ACTIONS_URGENTES_CRASH.md - Crash admin" -ForegroundColor Gray
Write-Host "  - GUIDE_KILOMETRAGE_OPTIONNEL.md - Kilométrage" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Script terminé" -ForegroundColor Green
Write-Host ""

# Demander si l'utilisateur veut ouvrir les dashboards
$openDashboards = Read-Host "Ouvrir les dashboards Railway et Vercel ? (O/n)"

if ($openDashboards -ne 'n' -and $openDashboards -ne 'N') {
    Start-Process "https://railway.app/"
    Start-Process "https://vercel.com/dashboard"
    Write-Host "✅ Dashboards ouverts dans le navigateur" -ForegroundColor Green
}

