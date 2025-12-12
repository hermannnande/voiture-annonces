# Diagnostic complet de la plateforme
# Usage: .\diagnostic-complet.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DIAGNOSTIC COMPLET" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$BackendURL = "https://voiture-annonces-production.up.railway.app/api"
$FrontendURL = "https://www.annonceauto.ci"

Write-Host "1️⃣  Test Backend Health" -ForegroundColor Yellow
Write-Host ""

try {
    $health = Invoke-RestMethod -Uri "$BackendURL/health" -Method Get -TimeoutSec 10
    
    Write-Host "✅ Backend accessible" -ForegroundColor Green
    Write-Host "Status   : $($health.status)" -ForegroundColor Cyan
    Write-Host "Database : $($health.database)" -ForegroundColor Cyan
    
    if ($health.timestamp) {
        Write-Host "Timestamp: $($health.timestamp)" -ForegroundColor Cyan
    }
    
    $backendOK = $true
    
} catch {
    Write-Host "❌ Backend NON accessible" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        Write-Host "Code erreur : $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 502) {
            Write-Host ""
            Write-Host "⚠️  Erreur 502 : Application failed to respond" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Causes possibles :" -ForegroundColor Cyan
            Write-Host "  1. Backend en train de demarrer (attendez 2-3 min)" -ForegroundColor Gray
            Write-Host "  2. Backend a crashe au demarrage" -ForegroundColor Gray
            Write-Host "  3. Erreur dans le code" -ForegroundColor Gray
            Write-Host ""
            Write-Host "Solutions :" -ForegroundColor Cyan
            Write-Host "  • Consultez Railway Dashboard > Logs" -ForegroundColor White
            Write-Host "  • Attendez 2-3 minutes si deploy en cours" -ForegroundColor White
            Write-Host "  • Verifiez variables d'environnement Railway" -ForegroundColor White
        }
    }
    
    $backendOK = $false
}

Write-Host ""
Write-Host "2️⃣  Test Frontend" -ForegroundColor Yellow
Write-Host ""

try {
    $frontend = Invoke-WebRequest -Uri $FrontendURL -Method Get -TimeoutSec 10 -UseBasicParsing
    Write-Host "✅ Frontend accessible (Status: $($frontend.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend NON accessible" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RESULTATS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($backendOK) {
    Write-Host "✅ Backend fonctionne" -ForegroundColor Green
    Write-Host "✅ Vous pouvez vous connecter" -ForegroundColor Green
    Write-Host ""
    
    $tryLogin = Read-Host "Voulez-vous tester la connexion ? (O/n)"
    
    if ($tryLogin -ne 'n' -and $tryLogin -ne 'N') {
        Write-Host ""
        & .\test-login.ps1
    }
    
} else {
    Write-Host "❌ Backend ne fonctionne pas" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Actions recommandees :" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Ouvrir Railway Dashboard" -ForegroundColor White
    Write-Host "   https://railway.app/" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Verifier le status du service" -ForegroundColor White
    Write-Host "   • Active (vert) = OK" -ForegroundColor Gray
    Write-Host "   • Building (orange) = Attendez" -ForegroundColor Gray
    Write-Host "   • Crashed (rouge) = Probleme" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Consulter les logs" -ForegroundColor White
    Write-Host "   Deployments > View Logs" -ForegroundColor Gray
    Write-Host "   Cherchez les erreurs en rouge" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Verifier les variables d'environnement" -ForegroundColor White
    Write-Host "   Variables > Verifier que tout est configure" -ForegroundColor Gray
    Write-Host ""
    
    $openRailway = Read-Host "Ouvrir Railway Dashboard maintenant ? (O/n)"
    
    if ($openRailway -ne 'n' -and $openRailway -ne 'N') {
        Start-Process "https://railway.app/"
        Write-Host "✅ Railway Dashboard ouvert" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TIMING" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Si Railway est en train de deployer :" -ForegroundColor Yellow
Write-Host "  • Build Docker    : ~3 minutes" -ForegroundColor Gray
Write-Host "  • Prisma db push  : ~30 secondes" -ForegroundColor Gray
Write-Host "  • Demarrage       : ~30 secondes" -ForegroundColor Gray
Write-Host "  • Total           : ~4-5 minutes" -ForegroundColor White
Write-Host ""

Write-Host "⏰ Dernier push : Il y a quelques minutes" -ForegroundColor Cyan
Write-Host "⏰ Attendez encore 2-3 minutes puis reessayez" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Script termine" -ForegroundColor Green
Write-Host ""

