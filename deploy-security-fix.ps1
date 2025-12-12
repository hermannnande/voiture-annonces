# Script de déploiement - Correction sécurité crédits
# Usage: .\deploy-security-fix.ps1

Write-Host "========================================" -ForegroundColor Red
Write-Host "   CORRECTION CRITIQUE SECURITE" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

Write-Host "🚨 BUG CRITIQUE CORRIGE :" -ForegroundColor Yellow
Write-Host "  Les vendeurs pouvaient acheter des boosts SANS credits suffisants !" -ForegroundColor Red
Write-Host ""

Write-Host "✅ Corrections appliquees :" -ForegroundColor Green
Write-Host ""
Write-Host "Backend (boosts.service.ts) :" -ForegroundColor Cyan
Write-Host "  • Double verification du solde (avant + pendant transaction)" -ForegroundColor Gray
Write-Host "  • Protection contre race conditions (achats simultanes)" -ForegroundColor Gray
Write-Host "  • Protection contre solde negatif" -ForegroundColor Gray
Write-Host "  • Redirection automatique vers endpoint securise" -ForegroundColor Gray
Write-Host "  • Ordre securise : debit AVANT creation boost" -ForegroundColor Gray
Write-Host "  • Transaction atomique avec rollback" -ForegroundColor Gray
Write-Host ""

Write-Host "Frontend (boosts/page.tsx) :" -ForegroundColor Cyan
Write-Host "  • Utilise l'endpoint securise /purchase-with-credits" -ForegroundColor Gray
Write-Host "  • Suppression du paymentProvider: 'mock'" -ForegroundColor Gray
Write-Host "  • Gestion erreur amelioree" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Deployer ces corrections CRITIQUES maintenant ? (O/n)"

if ($confirm -ne 'n' -and $confirm -ne 'N') {
    Write-Host ""
    Write-Host "📦 Git add..." -ForegroundColor Cyan
    
    cd "C:\Users\nande\Desktop\voiture annonces"
    
    git add backend/src/boosts/boosts.service.ts `
           frontend/src/app/dashboard/boosts/page.tsx `
           CORRECTION_SECURITE_CREDITS.md `
           deploy-security-fix.ps1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Fichiers ajoutes" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "📝 Git commit..." -ForegroundColor Cyan
        
        git commit -m "fix(security): correction CRITIQUE systeme credits boosts

SECURITY FIX :
- Double verification solde (avant + pendant transaction)
- Protection race conditions (achats simultanes)
- Protection solde negatif
- Redirection auto vers endpoint securise
- Ordre securise : debit AVANT creation boost
- Transaction atomique avec rollback

BREAKING CHANGE :
- Impossible d'acheter boosts sans credits suffisants
- paymentProvider 'mock' redirige vers purchase-with-credits

IMPACT :
- Ferme la faille de securite permettant boosts gratuits
- Protege contre fraude et abus
- Assure integrite des soldes wallet"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Commit cree" -ForegroundColor Green
            
            Write-Host ""
            Write-Host "🚀 Git push..." -ForegroundColor Cyan
            git push origin main
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "========================================" -ForegroundColor Green
                Write-Host "   ✅ DEPLOY REUSSI !" -ForegroundColor Green
                Write-Host "========================================" -ForegroundColor Green
                Write-Host ""
                
                Write-Host "⏰ Deploiements en cours :" -ForegroundColor Cyan
                Write-Host "  Railway Backend  : ~4-5 minutes" -ForegroundColor Gray
                Write-Host "  Vercel Frontend  : ~2-3 minutes" -ForegroundColor Gray
                Write-Host ""
                
                Write-Host "🧪 TESTS CRITIQUES A FAIRE (apres 5 min) :" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "Test 1 : Achat avec solde insuffisant" -ForegroundColor White
                Write-Host "  1. Wallet avec 5 credits" -ForegroundColor Gray
                Write-Host "  2. Essayer d'acheter pack 10 credits" -ForegroundColor Gray
                Write-Host "  3. Attendu : Erreur 'Solde insuffisant'" -ForegroundColor Green
                Write-Host ""
                
                Write-Host "Test 2 : Achat avec solde suffisant" -ForegroundColor White
                Write-Host "  1. Wallet avec 10 credits" -ForegroundColor Gray
                Write-Host "  2. Acheter pack 10 credits" -ForegroundColor Gray
                Write-Host "  3. Attendu : Boost cree, solde = 0" -ForegroundColor Green
                Write-Host ""
                
                Write-Host "Test 3 : Verifier solde apres achat" -ForegroundColor White
                Write-Host "  1. Noter solde avant achat" -ForegroundColor Gray
                Write-Host "  2. Acheter boost" -ForegroundColor Gray
                Write-Host "  3. Verifier solde = (avant - cout pack)" -ForegroundColor Green
                Write-Host ""
                
                Write-Host "🔍 Logs a surveiller (Railway) :" -ForegroundColor Cyan
                Write-Host "  ✅ 'BOOST_PURCHASED_WITH_CREDITS'" -ForegroundColor Gray
                Write-Host "  ✅ 'newBalance: XXX'" -ForegroundColor Gray
                Write-Host "  ❌ 'Solde insuffisant' (si test 1)" -ForegroundColor Gray
                Write-Host ""
                
                $openDashboards = Read-Host "Ouvrir Railway et Vercel dashboards ? (O/n)"
                if ($openDashboards -ne 'n' -and $openDashboards -ne 'N') {
                    Start-Process "https://railway.app/"
                    Start-Process "https://vercel.com/dashboard"
                    Start-Process "https://www.annonceauto.ci/dashboard/wallet"
                    Write-Host "✅ Dashboards ouverts" -ForegroundColor Green
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
    Write-Host "⚠️  Deploiement annule" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ATTENTION : Ce bug est CRITIQUE !" -ForegroundColor Red
    Write-Host "Des vendeurs peuvent actuellement acheter des boosts GRATUITEMENT." -ForegroundColor Red
    Write-Host "Deployez ces corrections des que possible !" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RESUME TECHNIQUE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "AVANT (Vulnerable) :" -ForegroundColor Red
Write-Host "  POST /boosts/purchase + paymentProvider: 'mock'" -ForegroundColor Gray
Write-Host "  -> Aucune verification credits" -ForegroundColor Red
Write-Host "  -> Boost cree gratuitement" -ForegroundColor Red
Write-Host ""

Write-Host "APRES (Securise) :" -ForegroundColor Green
Write-Host "  POST /boosts/purchase-with-credits" -ForegroundColor Gray
Write-Host "  -> Double verification solde" -ForegroundColor Green
Write-Host "  -> Transaction atomique" -ForegroundColor Green
Write-Host "  -> Protection race condition" -ForegroundColor Green
Write-Host "  -> Impossibilite solde negatif" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Script termine" -ForegroundColor Green
Write-Host ""

