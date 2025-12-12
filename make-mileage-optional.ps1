# Script pour rendre le kilométrage optionnel
# Usage: .\make-mileage-optional.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RENDRE KILOMÉTRAGE OPTIONNEL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Modifications appliquées :" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ✅ Backend - schema.prisma : mileageKm devient nullable (Int?)" -ForegroundColor Green
Write-Host "  ✅ Backend - DTO : @IsOptional() ajouté sur mileageKm" -ForegroundColor Green
Write-Host "  ✅ Frontend - Création : required retiré + placeholder modifié" -ForegroundColor Green
Write-Host "  ✅ Frontend - Édition : required retiré + placeholder modifié" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  IMPORTANT : Migration de base de données nécessaire !" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔧 ÉTAPES À SUIVRE :" -ForegroundColor Magenta
Write-Host ""

Write-Host "1️⃣  Créer la migration Prisma" -ForegroundColor Yellow
Write-Host ""

$createMigration = Read-Host "Voulez-vous créer la migration maintenant ? (O/n)"

if ($createMigration -ne 'n' -and $createMigration -ne 'N') {
    Write-Host ""
    Write-Host "📦 Création de la migration..." -ForegroundColor Cyan
    
    cd backend
    
    # Générer le client Prisma
    Write-Host "Génération du client Prisma..." -ForegroundColor Gray
    npx prisma generate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Client Prisma généré" -ForegroundColor Green
        
        # Créer la migration
        Write-Host ""
        Write-Host "Création de la migration..." -ForegroundColor Gray
        npx prisma migrate dev --name make_mileage_optional
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Migration créée avec succès !" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Erreur lors de la création de la migration" -ForegroundColor Red
            Write-Host "⚠️  Essayez manuellement :" -ForegroundColor Yellow
            Write-Host "   cd backend" -ForegroundColor White
            Write-Host "   npx prisma migrate dev --name make_mileage_optional" -ForegroundColor White
        }
    } else {
        Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    }
    
    cd ..
} else {
    Write-Host ""
    Write-Host "ℹ️  Commandes à exécuter manuellement :" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "cd backend" -ForegroundColor White
    Write-Host "npx prisma generate" -ForegroundColor White
    Write-Host "npx prisma migrate dev --name make_mileage_optional" -ForegroundColor White
    Write-Host "cd .." -ForegroundColor White
}

Write-Host ""
Write-Host "2️⃣  Commit et push les modifications" -ForegroundColor Yellow
Write-Host ""

$commitChanges = Read-Host "Voulez-vous commit et push maintenant ? (O/n)"

if ($commitChanges -ne 'n' -and $commitChanges -ne 'N') {
    Write-Host ""
    Write-Host "📦 Git add..." -ForegroundColor Cyan
    
    git add backend/prisma/schema.prisma `
           backend/src/listings/dto/create-listing.dto.ts `
           frontend/src/app/dashboard/listings/create/page.tsx `
           frontend/src/app/dashboard/listings/[id]/edit/page.tsx `
           backend/prisma/migrations `
           make-mileage-optional.ps1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Fichiers ajoutés" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "📝 Git commit..." -ForegroundColor Cyan
        git commit -m "feat(listings): rendre le kilométrage optionnel

- Schema Prisma : mileageKm devient nullable (Int?)
- DTO backend : @IsOptional() ajouté
- Frontend création : required retiré + placeholder mis à jour
- Frontend édition : required retiré + placeholder mis à jour
- Migration Prisma créée : make_mileage_optional"
        
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
                Write-Host "Railway et Vercel vont redéployer automatiquement." -ForegroundColor Cyan
                Write-Host "Attendez 3-5 minutes puis testez." -ForegroundColor Cyan
            } else {
                Write-Host "❌ Erreur lors du push" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Erreur lors du commit" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Erreur lors du git add" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Commandes Git à exécuter manuellement :" -ForegroundColor Yellow
    Write-Host ""
    Write-Host 'git add backend/prisma/schema.prisma backend/src/listings/dto/create-listing.dto.ts frontend/src/app/dashboard/listings/create/page.tsx frontend/src/app/dashboard/listings/[id]/edit/page.tsx backend/prisma/migrations make-mileage-optional.ps1' -ForegroundColor White
    Write-Host 'git commit -m "feat(listings): rendre le kilométrage optionnel"' -ForegroundColor White
    Write-Host "git push origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   VÉRIFICATIONS POST-DÉPLOIEMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Tests à effectuer :" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Créer une annonce SANS kilométrage" -ForegroundColor White
Write-Host "   → Devrait fonctionner" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Créer une annonce AVEC kilométrage" -ForegroundColor White
Write-Host "   → Devrait fonctionner aussi" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Éditer une annonce existante" -ForegroundColor White
Write-Host "   → Kilométrage devrait être optionnel" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Vérifier l'affichage sur les pages de liste" -ForegroundColor White
Write-Host "   → Les annonces sans kilométrage doivent s'afficher correctement" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 Modifications détaillées :" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend :" -ForegroundColor Yellow
Write-Host "  - schema.prisma ligne 146 : mileageKm Int? @map(`"mileage_km`")" -ForegroundColor Gray
Write-Host "  - create-listing.dto.ts ligne 46 : @IsOptional() ajouté" -ForegroundColor Gray
Write-Host ""
Write-Host "Frontend :" -ForegroundColor Yellow
Write-Host "  - create/page.tsx ligne 358-367 : required retiré, label sans *" -ForegroundColor Gray
Write-Host "  - [id]/edit/page.tsx ligne 406-415 : required retiré, label sans *" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Script terminé" -ForegroundColor Green
Write-Host ""

