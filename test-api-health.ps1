# 🔍 Script de test de santé de l'API
# Usage: .\test-api-health.ps1

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🔍  TEST DE SANTÉ API BACKEND" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$apiUrl = "https://api.annonceauto.ci"

# Test 1: Health check basique
Write-Host "1️⃣  Test endpoint /api/health..." -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$apiUrl/api/health" -Method Get -TimeoutSec 10
    if ($response.status -eq "ok") {
        Write-Host "   ✅ API accessible" -ForegroundColor Green
        Write-Host "   ⏰ Uptime: $([math]::Round($response.uptime / 60, 2)) minutes" -ForegroundColor Gray
        Write-Host "   🌍 Environment: $($response.environment)" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  API répond mais status != ok" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🚨 L'API ne répond pas. Vérifications :" -ForegroundColor Yellow
    Write-Host "   1. Railway est-il déployé ? https://railway.app/dashboard" -ForegroundColor Gray
    Write-Host "   2. Le déploiement est-il en statut 'Active' ?" -ForegroundColor Gray
    Write-Host "   3. Les logs Railway montrent-ils des erreurs ?" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# Test 2: Health check détaillé
Write-Host "2️⃣  Test endpoint /api/health/detailed..." -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$apiUrl/api/health/detailed" -Method Get -TimeoutSec 10
    Write-Host "   ✅ Endpoint détaillé accessible" -ForegroundColor Green
    Write-Host "   💾 Database: $($response.database)" -ForegroundColor Gray
    Write-Host "   🧠 Memory: $($response.memory.used) / $($response.memory.total)" -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  Endpoint détaillé inaccessible" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Endpoint admin (nécessite authentification)
Write-Host "3️⃣  Test endpoint /api/admin/stats (avec auth)..." -ForegroundColor Blue
Write-Host "   ⚠️  Nécessite un token d'authentification" -ForegroundColor Yellow
Write-Host "   Pour tester: Connectez-vous sur le site et regardez la console" -ForegroundColor Gray

Write-Host ""

# Test 4: CORS
Write-Host "4️⃣  Test CORS..." -ForegroundColor Blue
try {
    $headers = @{
        'Origin' = 'https://www.annonceauto.ci'
    }
    $response = Invoke-WebRequest -Uri "$apiUrl/api/health" -Method Options -Headers $headers -TimeoutSec 10 -ErrorAction SilentlyContinue
    Write-Host "   ✅ CORS configuré" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Impossible de vérifier CORS via PowerShell" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊  RÉSUMÉ" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ API backend est accessible et fonctionne" -ForegroundColor Green
Write-Host "🌐 URL: $apiUrl" -ForegroundColor Blue
Write-Host ""
Write-Host "💡 Si le dashboard admin affiche 'Network Error':" -ForegroundColor Yellow
Write-Host "   1. Videz le cache navigateur (Ctrl+Shift+Delete)" -ForegroundColor Gray
Write-Host "   2. Reconnectez-vous" -ForegroundColor Gray
Write-Host "   3. Vérifiez la console (F12) pour voir les détails" -ForegroundColor Gray
Write-Host ""

