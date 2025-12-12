# Script de test du déploiement
# Usage: .\test-deployment.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TEST DE DEPLOIEMENT - Voiture Annonces" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$BackendURL = "https://voiture-annonces-production.up.railway.app/api"
$FrontendURL = "https://www.annonceauto.ci"

# Fonction pour tester une URL
function Test-Endpoint {
    param (
        [string]$Name,
        [string]$URL,
        [string]$ExpectedContent = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "URL: $URL" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $URL -TimeoutSec 10 -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ SUCCESS - Status: $($response.StatusCode)" -ForegroundColor Green
            
            if ($ExpectedContent -and $response.Content -match $ExpectedContent) {
                Write-Host "   ✅ Content validation passed" -ForegroundColor Green
            }
            
            return $true
        } else {
            Write-Host "⚠️  WARNING - Status: $($response.StatusCode)" -ForegroundColor Yellow
            return $false
        }
    }
    catch {
        Write-Host "❌ FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    finally {
        Write-Host ""
    }
}

# Tests
Write-Host "1️⃣  BACKEND TESTS" -ForegroundColor Magenta
Write-Host "==================" -ForegroundColor Magenta
Write-Host ""

$backendHealthOK = Test-Endpoint -Name "Backend Health Check" -URL "$BackendURL/health" -ExpectedContent "ok"
$backendListingsOK = Test-Endpoint -Name "Backend Listings API" -URL "$BackendURL/listings?page=1&limit=1" -ExpectedContent "listings"

Write-Host ""
Write-Host "2️⃣  FRONTEND TESTS" -ForegroundColor Magenta
Write-Host "==================" -ForegroundColor Magenta
Write-Host ""

$frontendHomeOK = Test-Endpoint -Name "Frontend Home Page" -URL $FrontendURL
$frontendLoginOK = Test-Endpoint -Name "Frontend Login Page" -URL "$FrontendURL/auth/login"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           RESULTATS FINAUX" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$totalTests = 4
$passedTests = 0

if ($backendHealthOK) { $passedTests++ }
if ($backendListingsOK) { $passedTests++ }
if ($frontendHomeOK) { $passedTests++ }
if ($frontendLoginOK) { $passedTests++ }

Write-Host "Tests réussis: $passedTests / $totalTests" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })
Write-Host ""

if ($passedTests -eq $totalTests) {
    Write-Host "🎉 TOUS LES TESTS SONT PASSES !" -ForegroundColor Green
    Write-Host "✅ Votre plateforme est opérationnelle." -ForegroundColor Green
} elseif ($passedTests -gt 0) {
    Write-Host "⚠️  CERTAINS TESTS ONT ECHOUE" -ForegroundColor Yellow
    Write-Host "Consultez les guides de résolution :" -ForegroundColor Yellow
    if (-not $backendHealthOK -or -not $backendListingsOK) {
        Write-Host "  - GUIDE_CORRECTION_RAILWAY.md (pour le backend)" -ForegroundColor Yellow
    }
    if (-not $frontendHomeOK -or -not $frontendLoginOK) {
        Write-Host "  - GUIDE_CONFIGURATION_VERCEL.md (pour le frontend)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ TOUS LES TESTS ONT ECHOUE" -ForegroundColor Red
    Write-Host "Vérifiez que les services sont déployés :" -ForegroundColor Red
    Write-Host "  1. Railway: https://railway.app/" -ForegroundColor Red
    Write-Host "  2. Vercel: https://vercel.com/" -ForegroundColor Red
}

Write-Host ""
Write-Host "Pour plus de détails, consultez VERIFICATION_RAPIDE.md" -ForegroundColor Cyan
Write-Host ""

# Test détaillé avec Invoke-RestMethod pour voir le JSON
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DETAILS DE LA REPONSE API HEALTH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    $healthData = Invoke-RestMethod -Uri "$BackendURL/health" -Method Get -TimeoutSec 10
    Write-Host "Response Data:" -ForegroundColor Green
    $healthData | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "Impossible de récupérer les données: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

