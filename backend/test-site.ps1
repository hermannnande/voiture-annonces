# Script de test rapide du site

Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   TEST DU SITE ANNONCEAUTO.CI" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Test 1: Frontend
Write-Host "1. Test du Frontend (port 3000)..." -ForegroundColor Yellow
try {
    $fe = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✅ Frontend OK (Status: $($fe.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend ERROR: $_" -ForegroundColor Red
}

# Test 2: Backend API
Write-Host "`n2. Test du Backend API (port 3001)..." -ForegroundColor Yellow
try {
    $be = Invoke-WebRequest -Uri "http://localhost:3001/api/listings" -UseBasicParsing -TimeoutSec 5 -MaximumRedirection 0 -ErrorAction SilentlyContinue
    if ($be.StatusCode -eq 200) {
        $json = $be.Content | ConvertFrom-Json
        $count = if ($json.listings) { $json.listings.Count } else { 0 }
        Write-Host "   ✅ Backend OK - $count annonces trouvées" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Backend répond avec status: $($be.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Backend ERROR: $_" -ForegroundColor Red
}

# Test 3: Base de données
Write-Host "`n3. Test de la base de données..." -ForegroundColor Yellow
$dbPath = "C:\Users\LENOVO\Desktop\voiture 5\backend\prisma\dev.db"
if (Test-Path $dbPath) {
    $dbSize = (Get-Item $dbPath).Length / 1KB
    Write-Host "   ✅ Base de données trouvée ($([math]::Round($dbSize, 2)) KB)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Base de données introuvable!" -ForegroundColor Red
}

# Test 4: Prisma Studio
Write-Host "`n4. Test de Prisma Studio (port 5555)..." -ForegroundColor Yellow
try {
    $ps = Invoke-WebRequest -Uri "http://localhost:5555" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ✅ Prisma Studio OK" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Prisma Studio non accessible" -ForegroundColor Yellow
}

Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   RÉSUMÉ" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs à tester dans le navigateur:" -ForegroundColor White
Write-Host "  • Site principal: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  • API Backend:    http://localhost:3001/api/listings" -ForegroundColor Cyan
Write-Host "  • Prisma Studio:  http://localhost:5555" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si le site ne s'affiche pas correctement:" -ForegroundColor Yellow
Write-Host "  1. Ouvrez F12 dans le navigateur" -ForegroundColor White
Write-Host "  2. Vérifiez l'onglet Console pour les erreurs" -ForegroundColor White
Write-Host "  3. Testez l'URL de l'API directement" -ForegroundColor White
Write-Host ""



