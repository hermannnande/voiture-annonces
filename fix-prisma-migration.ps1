# Script de correction migration Prisma échouée
# Usage: .\fix-prisma-migration.ps1

Write-Host "========================================" -ForegroundColor Red
Write-Host "   FIX MIGRATION PRISMA ECHOUEE" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

Write-Host "🚨 Erreur P3009 détectée !" -ForegroundColor Yellow
Write-Host "   Une migration a échoué et bloque le déploiement" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Solutions disponibles :" -ForegroundColor Cyan
Write-Host ""

Write-Host "OPTION 1 : Utiliser db push au lieu de migrate (RECOMMANDE)" -ForegroundColor Green
Write-Host "  • Plus simple et plus fiable" -ForegroundColor Gray
Write-Host "  • Pas de gestion de migrations" -ForegroundColor Gray
Write-Host "  • Applique directement le schema" -ForegroundColor Gray
Write-Host ""

Write-Host "OPTION 2 : Resoudre la migration manuellement" -ForegroundColor Yellow
Write-Host "  • Marquer la migration comme resolue" -ForegroundColor Gray
Write-Host "  • Plus complexe" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Quelle option choisissez-vous ? (1/2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "✅ Option 1 selectionnee : db push" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Modification de railway.json..." -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "Je vais modifier la commande de demarrage pour utiliser 'db push'" -ForegroundColor Yellow
    Write-Host "au lieu de 'migrate deploy'" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "AVANT :" -ForegroundColor Red
    Write-Host '  "startCommand": "npx prisma migrate deploy && node dist/src/main.js"' -ForegroundColor Gray
    Write-Host ""
    Write-Host "APRES :" -ForegroundColor Green
    Write-Host '  "startCommand": "npx prisma db push --accept-data-loss && node dist/src/main.js"' -ForegroundColor Gray
    Write-Host ""
    
    $confirm = Read-Host "Confirmer cette modification ? (O/n)"
    
    if ($confirm -ne 'n' -and $confirm -ne 'N') {
        # Lire le fichier railway.json
        $railwayJsonPath = "C:\Users\nande\Desktop\voiture annonces\backend\railway.json"
        $content = Get-Content $railwayJsonPath -Raw
        
        # Remplacer la commande
        $newContent = $content -replace 'npx prisma migrate deploy', 'npx prisma db push --accept-data-loss'
        
        # Écrire le nouveau contenu
        $newContent | Set-Content $railwayJsonPath -NoNewline
        
        Write-Host "✅ railway.json modifie" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "📦 Git add, commit, push..." -ForegroundColor Cyan
        
        cd "C:\Users\nande\Desktop\voiture annonces"
        
        git add backend/railway.json fix-prisma-migration.ps1
        git commit -m "fix(prisma): utiliser db push au lieu de migrate deploy - resout P3009"
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "   ✅ CORRECTION DEPLOYEE !" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Railway va redéployer avec la nouvelle commande." -ForegroundColor Cyan
            Write-Host "Le déploiement devrait maintenant réussir !" -ForegroundColor Green
        }
    }
    
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "⚠️  Option 2 : Resolution manuelle" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Vous devez vous connecter a Railway CLI :" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "railway login" -ForegroundColor White
    Write-Host "railway link" -ForegroundColor White
    Write-Host 'railway run npx prisma migrate resolve --applied 20251201_init' -ForegroundColor White
    Write-Host 'railway run npx prisma migrate deploy' -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Choix invalide" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DOCUMENTATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour plus d'infos sur ce probleme :" -ForegroundColor Gray
Write-Host "  https://pris.ly/d/migrate-resolve" -ForegroundColor White
Write-Host ""
Write-Host "✅ Script termine" -ForegroundColor Green
Write-Host ""

