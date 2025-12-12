# Script de surveillance du backend Railway
# Usage: .\surveiller-backend.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SURVEILLANCE BACKEND RAILWAY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$BackendURL = "https://voiture-annonces-production.up.railway.app/api/health"
$maxAttempts = 20
$attempt = 0
$waitSeconds = 15

Write-Host "🔍 Surveillance du backend..." -ForegroundColor Yellow
Write-Host "URL : $BackendURL" -ForegroundColor Gray
Write-Host "Verification toutes les $waitSeconds secondes" -ForegroundColor Gray
Write-Host "Maximum $maxAttempts tentatives (~5 minutes)" -ForegroundColor Gray
Write-Host ""

while ($attempt -lt $maxAttempts) {
    $attempt++
    
    Write-Host "[$attempt/$maxAttempts] Test a $(Get-Date -Format 'HH:mm:ss')..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri $BackendURL -Method Get -TimeoutSec 10
        
        if ($response.status -eq "ok") {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "   ✅ BACKEND DEMARRE !" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Status   : $($response.status)" -ForegroundColor Cyan
            Write-Host "Database : $($response.database)" -ForegroundColor Cyan
            Write-Host ""
            
            Write-Host "✅ Vous pouvez maintenant vous connecter !" -ForegroundColor Green
            Write-Host ""
            
            $openSite = Read-Host "Ouvrir le site de connexion ? (O/n)"
            
            if ($openSite -ne 'n' -and $openSite -ne 'N') {
                Start-Process "https://www.annonceauto.ci/auth/login"
                Write-Host "✅ Site ouvert" -ForegroundColor Green
            }
            
            Write-Host ""
            $testLogin = Read-Host "Voulez-vous tester la connexion maintenant ? (O/n)"
            
            if ($testLogin -ne 'n' -and $testLogin -ne 'N') {
                Write-Host ""
                & .\test-login.ps1
            }
            
            exit 0
        }
        
    } catch {
        $statusCode = $null
        
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.Value__
        }
        
        if ($statusCode -eq 502) {
            Write-Host "  ⏳ 502 - Backend en cours de demarrage..." -ForegroundColor Yellow
        } elseif ($statusCode -eq 503) {
            Write-Host "  ⏳ 503 - Service temporairement indisponible..." -ForegroundColor Yellow
        } else {
            Write-Host "  ❌ Erreur : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    if ($attempt -lt $maxAttempts) {
        Write-Host "  Prochaine verification dans $waitSeconds secondes..." -ForegroundColor Gray
        Start-Sleep -Seconds $waitSeconds
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Red
Write-Host "   ⚠️  TIMEOUT" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

Write-Host "Le backend n'a pas demarre apres $($maxAttempts * $waitSeconds / 60) minutes." -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 Actions recommandees :" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Consulter les logs Railway" -ForegroundColor White
Write-Host "   https://railway.app/ > Deployments > View Logs" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Verifier le status du service" -ForegroundColor White
Write-Host "   • Active (vert) = OK mais pas accessible (?)" -ForegroundColor Gray
Write-Host "   • Building (orange) = Encore en build" -ForegroundColor Gray
Write-Host "   • Crashed (rouge) = Erreur au demarrage" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Verifier les variables d'environnement" -ForegroundColor White
Write-Host "   Surtout : DATABASE_URL, JWT_SECRET, PORT" -ForegroundColor Gray
Write-Host ""

$openRailway = Read-Host "Ouvrir Railway Dashboard pour diagnostiquer ? (O/n)"

if ($openRailway -ne 'n' -and $openRailway -ne 'N') {
    Start-Process "https://railway.app/"
    Write-Host "✅ Railway Dashboard ouvert" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Script termine" -ForegroundColor Green
Write-Host ""

