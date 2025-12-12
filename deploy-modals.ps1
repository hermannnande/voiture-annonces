# Script de déploiement des modals professionnels
# Usage: .\deploy-modals.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DEPLOIEMENT MODALS PROFESSIONNELS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Modifications appliquées :" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ✅ Nouveau composant Modal réutilisable" -ForegroundColor Green
Write-Host "     frontend/src/components/common/Modal.tsx" -ForegroundColor Gray
Write-Host ""
Write-Host "  ✅ Page Boosts mise à jour" -ForegroundColor Green
Write-Host "     frontend/src/app/dashboard/boosts/page.tsx" -ForegroundColor Gray
Write-Host "     - 4 modals ajoutés (warning, confirm, success, error)" -ForegroundColor Gray
Write-Host "     - alert() et confirm() remplacés" -ForegroundColor Gray
Write-Host ""
Write-Host "  ✅ Documentation complète" -ForegroundColor Green
Write-Host "     GUIDE_MODALS_PROFESSIONNELS.md" -ForegroundColor Gray
Write-Host ""

Write-Host "🎨 Fonctionnalités :" -ForegroundColor Magenta
Write-Host "  • Design moderne et professionnel" -ForegroundColor Gray
Write-Host "  • 5 types de modals (success, error, warning, info, confirm)" -ForegroundColor Gray
Write-Host "  • Icônes adaptées selon le type" -ForegroundColor Gray
Write-Host "  • Animations fluides" -ForegroundColor Gray
Write-Host "  • Backdrop avec effet blur" -ForegroundColor Gray
Write-Host "  • Responsive mobile/desktop" -ForegroundColor Gray
Write-Host "  • Réutilisable dans toute l'application" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Voulez-vous déployer ces changements ? (O/n)"

if ($confirm -ne 'n' -and $confirm -ne 'N') {
    Write-Host ""
    Write-Host "📦 Git add..." -ForegroundColor Cyan
    
    cd "C:\Users\nande\Desktop\voiture annonces"
    
    git add frontend/src/components/common/Modal.tsx `
           frontend/src/app/dashboard/boosts/page.tsx `
           GUIDE_MODALS_PROFESSIONNELS.md `
           deploy-modals.ps1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Fichiers ajoutés" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "📝 Git commit..." -ForegroundColor Cyan
        git commit -m "feat(ui): modals professionnels pour boosts

- Nouveau composant Modal réutilisable
- 5 types : success, error, warning, info, confirm
- Design moderne avec icônes et animations
- Remplace alert() et confirm() basiques
- Responsive et accessible
- Documentation complète"
        
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
                
                Write-Host "📊 Vercel va redéployer automatiquement" -ForegroundColor Cyan
                Write-Host "   Temps estimé : 2-3 minutes" -ForegroundColor Gray
                Write-Host ""
                
                Write-Host "🔍 Tests à effectuer (après 3 minutes) :" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "1. Modal Warning (sélection requise)" -ForegroundColor White
                Write-Host "   - Aller sur /dashboard/boosts" -ForegroundColor Gray
                Write-Host "   - Cliquer sur 'Choisir ce pack' sans sélectionner d'annonce" -ForegroundColor Gray
                Write-Host "   - Vérifier modal jaune avec icône warning" -ForegroundColor Gray
                Write-Host ""
                Write-Host "2. Modal Confirmation" -ForegroundColor White
                Write-Host "   - Sélectionner une annonce" -ForegroundColor Gray
                Write-Host "   - Cliquer sur 'Choisir ce pack'" -ForegroundColor Gray
                Write-Host "   - Vérifier modal bleu avec 2 boutons" -ForegroundColor Gray
                Write-Host ""
                Write-Host "3. Modal Succès" -ForegroundColor White
                Write-Host "   - Confirmer l'achat" -ForegroundColor Gray
                Write-Host "   - Vérifier modal vert avec icône check" -ForegroundColor Gray
                Write-Host ""
                
                Write-Host "🌐 URL à tester :" -ForegroundColor Cyan
                Write-Host "   https://www.annonceauto.ci/dashboard/boosts" -ForegroundColor White
                Write-Host ""
                
                $openSite = Read-Host "Ouvrir le site maintenant ? (O/n)"
                if ($openSite -ne 'n' -and $openSite -ne 'N') {
                    Start-Process "https://www.annonceauto.ci/dashboard/boosts"
                    Start-Process "https://vercel.com/dashboard"
                    Write-Host "✅ Site et dashboard Vercel ouverts" -ForegroundColor Green
                }
                
            } else {
                Write-Host ""
                Write-Host "❌ Erreur lors du push" -ForegroundColor Red
            }
        } else {
            Write-Host ""
            Write-Host "❌ Erreur lors du commit" -ForegroundColor Red
        }
    } else {
        Write-Host ""
        Write-Host "❌ Erreur lors du git add" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Déploiement annulé" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour déployer manuellement :" -ForegroundColor Gray
    Write-Host '  git add frontend/src/components/common/Modal.tsx frontend/src/app/dashboard/boosts/page.tsx GUIDE_MODALS_PROFESSIONNELS.md' -ForegroundColor White
    Write-Host '  git commit -m "feat(ui): modals professionnels"' -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AVANT/APRÈS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "AVANT :" -ForegroundColor Red
Write-Host "  [OK] annonceauto.ci indique" -ForegroundColor Gray
Write-Host "  Confirmer l'achat de boost ?" -ForegroundColor Gray
Write-Host "  [ OK ] [ Annuler ]" -ForegroundColor Gray
Write-Host ""

Write-Host "APRÈS :" -ForegroundColor Green
Write-Host "  ┌─────────────────────────────┐" -ForegroundColor Gray
Write-Host "  │        ℹ️ (icône)          │" -ForegroundColor Gray
Write-Host "  │                             │" -ForegroundColor Gray
Write-Host "  │   Confirmer l'achat         │" -ForegroundColor Gray
Write-Host "  │                             │" -ForegroundColor Gray
Write-Host "  │ Êtes-vous sûr de vouloir... │" -ForegroundColor Gray
Write-Host "  │                             │" -ForegroundColor Gray
Write-Host "  │  [ Annuler ] [ Acheter ]    │" -ForegroundColor Gray
Write-Host "  └─────────────────────────────┘" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Script terminé" -ForegroundColor Green
Write-Host ""

