# Script de correction du crash admin/publication
# Usage: .\fix-crash-admin.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CORRECTION CRASH ADMIN/PUBLICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Modifications appliquées :" -ForegroundColor Yellow
Write-Host "  1. ✅ PrismaService optimisé avec retry logic" -ForegroundColor Green
Write-Host "  2. ✅ Logger des requêtes lentes ajouté" -ForegroundColor Green
Write-Host "  3. ✅ Shutdown hooks activés dans main.ts" -ForegroundColor Green
Write-Host ""

Write-Host "🔧 ÉTAPES SUIVANTES :" -ForegroundColor Magenta
Write-Host ""

Write-Host "1️⃣  Modifier DATABASE_URL sur Railway" -ForegroundColor Yellow
Write-Host "   Allez sur Railway Dashboard > Variables" -ForegroundColor Gray
Write-Host "   Cliquez sur DATABASE_URL > Edit" -ForegroundColor Gray
Write-Host "   Ajoutez à la fin de l'URL :" -ForegroundColor Gray
Write-Host "   ?connection_limit=5&pool_timeout=10&connect_timeout=30" -ForegroundColor White
Write-Host ""

Write-Host "   Exemple :" -ForegroundColor Gray
Write-Host "   postgresql://user:pass@host:5432/db?connection_limit=5&pool_timeout=10&connect_timeout=30" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  Commit et push les modifications" -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "Voulez-vous commit et push maintenant ? (O/n)"

if ($response -ne 'n' -and $response -ne 'N') {
    Write-Host ""
    Write-Host "📦 Git add..." -ForegroundColor Cyan
    git add backend/src/prisma/prisma.service.ts backend/src/main.ts DIAGNOSTIC_CRASH_SPECIFIQUE.md fix-crash-admin.ps1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Fichiers ajoutés" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "📝 Git commit..." -ForegroundColor Cyan
        git commit -m "fix(backend): optimisation Prisma pour éviter crash admin/publication

- Ajout retry logic connexion DB
- Logger requêtes lentes (>1s)
- Shutdown hooks Prisma activés
- Configuration optimisée PrismaService"
        
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
                Write-Host "Railway va maintenant redéployer automatiquement." -ForegroundColor Cyan
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
    Write-Host "ℹ️  Commandes à exécuter manuellement :" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "git add backend/src/prisma/prisma.service.ts backend/src/main.ts DIAGNOSTIC_CRASH_SPECIFIQUE.md fix-crash-admin.ps1" -ForegroundColor White
    Write-Host 'git commit -m "fix(backend): optimisation Prisma crash admin/publication"' -ForegroundColor White
    Write-Host "git push origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ACTIONS POST-DÉPLOIEMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Modifier DATABASE_URL sur Railway (ajoutez les paramètres)" -ForegroundColor Yellow
Write-Host "2. Attendre le redéploiement (3-5 min)" -ForegroundColor Yellow
Write-Host "3. Tester connexion admin" -ForegroundColor Yellow
Write-Host "4. Tester création d'annonce" -ForegroundColor Yellow
Write-Host "5. Consulter les logs pour vérifier" -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 Documentation complète : DIAGNOSTIC_CRASH_SPECIFIQUE.md" -ForegroundColor Cyan
Write-Host ""

# Ouvrir le guide si demandé
$openGuide = Read-Host "Ouvrir le guide complet ? (O/n)"
if ($openGuide -ne 'n' -and $openGuide -ne 'N') {
    Start-Process "DIAGNOSTIC_CRASH_SPECIFIQUE.md"
}

Write-Host ""
Write-Host "✅ Script terminé" -ForegroundColor Green
Write-Host ""

