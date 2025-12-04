# 🚀 Script de déploiement en production
# Usage: .\deploy-to-production.ps1

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🚀  DÉPLOIEMENT EN PRODUCTION" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Vérifier qu'on est sur la branche dev
$currentBranch = git branch --show-current
if ($currentBranch -ne "dev") {
    Write-Host "⚠️  ATTENTION : Vous n'êtes pas sur la branche 'dev'" -ForegroundColor Yellow
    Write-Host "   Branche actuelle : $currentBranch" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Voulez-vous continuer quand même ? (o/N)"
    if ($continue -ne "o" -and $continue -ne "O") {
        Write-Host "❌ Déploiement annulé" -ForegroundColor Red
        exit 1
    }
}

# Afficher les derniers commits
Write-Host "📋 Derniers commits sur dev :" -ForegroundColor Cyan
git log --oneline -5 dev
Write-Host ""

# Demander confirmation
Write-Host "⚠️  ATTENTION : Ces modifications vont être déployées sur www.annonceauto.ci" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Êtes-vous sûr de vouloir continuer ? (o/N)"

if ($confirm -ne "o" -and $confirm -ne "O") {
    Write-Host "❌ Déploiement annulé" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔄 Déploiement en cours..." -ForegroundColor Cyan
Write-Host ""

# Sauvegarder les modifications non committées sur dev
Write-Host "1️⃣  Sauvegarde des modifications sur dev..." -ForegroundColor Blue
git add .
git commit -m "chore: Préparation déploiement production" 2>$null
git push origin dev

# Passer sur main
Write-Host "2️⃣  Passage sur la branche main..." -ForegroundColor Blue
git checkout main

# Fusionner dev dans main
Write-Host "3️⃣  Fusion de dev dans main..." -ForegroundColor Blue
$mergeResult = git merge dev --no-edit 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERREUR : Conflit de fusion détecté !" -ForegroundColor Red
    Write-Host "   Résolvez les conflits manuellement puis :" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Yellow
    Write-Host "   git commit -m 'Merge dev into main'" -ForegroundColor Yellow
    Write-Host "   git push origin main" -ForegroundColor Yellow
    exit 1
}

# Pousser sur main (déclenche le déploiement production)
Write-Host "4️⃣  Déploiement sur production..." -ForegroundColor Blue
git push origin main

# Retourner sur dev
Write-Host "5️⃣  Retour sur la branche dev..." -ForegroundColor Blue
git checkout dev

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅  DÉPLOIEMENT RÉUSSI !" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Frontend : https://www.annonceauto.ci" -ForegroundColor Blue
Write-Host "🔧 Backend  : https://api.annonceauto.ci" -ForegroundColor Blue
Write-Host ""
Write-Host "⏳ Vercel et Railway déploient... (2-5 minutes)" -ForegroundColor Yellow
Write-Host ""
Write-Host "📊 Suivez le déploiement :" -ForegroundColor Cyan
Write-Host "   - Vercel  : https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "   - Railway : https://railway.app/dashboard" -ForegroundColor Gray
Write-Host ""

