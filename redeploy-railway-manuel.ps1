# Script pour redéployer manuellement sur Railway
# Usage: .\redeploy-railway-manuel.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   REDEPLOY MANUEL RAILWAY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  Railway n'a pas detecte le dernier push automatiquement." -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 2 MÉTHODES POUR REDÉPLOYER :" -ForegroundColor Cyan
Write-Host ""

Write-Host "──────────────────────────────────────────" -ForegroundColor Gray
Write-Host "MÉTHODE 1 : Via Railway Dashboard (Recommandé)" -ForegroundColor Green
Write-Host "──────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""
Write-Host "1. Ouvrir Railway Dashboard" -ForegroundColor White
Write-Host "   https://railway.app/" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Cliquer sur votre projet 'voiture-annonces'" -ForegroundColor White
Write-Host ""
Write-Host "3. Cliquer sur votre service backend" -ForegroundColor White
Write-Host "   (celui avec 'api.annonceauto.ci')" -ForegroundColor Gray
Write-Host ""
Write-Host "4. En haut à droite, cliquer sur les 3 points ⋮" -ForegroundColor White
Write-Host ""
Write-Host "5. Cliquer sur 'Redeploy'" -ForegroundColor White
Write-Host ""
Write-Host "6. Confirmer" -ForegroundColor White
Write-Host ""
Write-Host "7. Attendre 4-5 minutes" -ForegroundColor White
Write-Host ""

Write-Host "──────────────────────────────────────────" -ForegroundColor Gray
Write-Host "MÉTHODE 2 : Via Railway CLI (Avancé)" -ForegroundColor Yellow
Write-Host "──────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""
Write-Host "Si Railway CLI est installé :" -ForegroundColor White
Write-Host ""
Write-Host "  railway login" -ForegroundColor Gray
Write-Host "  railway link" -ForegroundColor Gray
Write-Host "  railway up" -ForegroundColor Gray
Write-Host ""
Write-Host "Si Railway CLI n'est PAS installé :" -ForegroundColor White
Write-Host ""
Write-Host "  npm install -g @railway/cli" -ForegroundColor Gray
Write-Host "  railway login" -ForegroundColor Gray
Write-Host "  railway link" -ForegroundColor Gray
Write-Host "  railway up" -ForegroundColor Gray
Write-Host ""

Write-Host "──────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Voulez-vous ouvrir Railway Dashboard maintenant ? (O/n)"

if ($choice -ne 'n' -and $choice -ne 'N') {
    Write-Host ""
    Write-Host "🌐 Ouverture de Railway Dashboard..." -ForegroundColor Cyan
    Start-Process "https://railway.app/"
    Write-Host "✅ Railway Dashboard ouvert" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 N'oubliez pas de cliquer sur 'Redeploy' !" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "──────────────────────────────────────────" -ForegroundColor Gray
Write-Host "ACTIVER LE REDÉPLOIEMENT AUTOMATIQUE" -ForegroundColor Cyan
Write-Host "──────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour que Railway redéploie automatiquement sur chaque push :" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Railway Dashboard > Votre service" -ForegroundColor White
Write-Host ""
Write-Host "2. Onglet 'Settings' (⚙️)" -ForegroundColor White
Write-Host ""
Write-Host "3. Section 'Source'" -ForegroundColor White
Write-Host ""
Write-Host "4. Vérifier que :" -ForegroundColor White
Write-Host "   ✅ Repository : hermannnande/voiture-annonces" -ForegroundColor Gray
Write-Host "   ✅ Branch : main" -ForegroundColor Gray
Write-Host "   ✅ Auto Deploy : ON (activé)" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Si 'Auto Deploy' est OFF, activez-le" -ForegroundColor White
Write-Host ""

Write-Host "──────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

Write-Host "📊 RÉSUMÉ DES CORRECTIONS PRÊTES :" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Fix migration P3009 (db push au lieu de migrate)" -ForegroundColor Green
Write-Host "✅ Optimisation Prisma" -ForegroundColor Green
Write-Host "✅ Kilométrage optionnel" -ForegroundColor Green
Write-Host "✅ Modals professionnels" -ForegroundColor Green
Write-Host "✅ Fix sécurité crédits" -ForegroundColor Green
Write-Host "✅ Sessions persistantes" -ForegroundColor Green
Write-Host "✅ Fix erreurs TypeScript" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Tout est prêt à être déployé !" -ForegroundColor Green
Write-Host ""

Write-Host "⏰ APRÈS LE REDÉPLOY (4-5 minutes) :" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Testez : curl https://voiture-annonces-production.up.railway.app/api/health" -ForegroundColor Gray
Write-Host "  Ou lancez : .\test-login.ps1" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Script terminé" -ForegroundColor Green
Write-Host ""

