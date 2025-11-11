# Script de correction automatique - JWT Expiration
Write-Host "Script de correction JWT Expiration" -ForegroundColor Cyan
Write-Host ""

$backendEnvPath = "backend\.env"

# Verifier si le fichier existe
if (-not (Test-Path $backendEnvPath)) {
    Write-Host "Fichier backend\.env introuvable !" -ForegroundColor Red
    exit 1
}

Write-Host "Lecture du fichier .env..." -ForegroundColor Yellow
$envContent = Get-Content $backendEnvPath -Raw

# Verifier si JWT_EXPIRATION existe deja
if ($envContent -match "JWT_EXPIRATION=") {
    Write-Host "JWT_EXPIRATION trouve, mise a jour..." -ForegroundColor Green
    $envContent = $envContent -replace "JWT_EXPIRATION=.*", "JWT_EXPIRATION=24h"
} else {
    Write-Host "JWT_EXPIRATION non trouve, ajout..." -ForegroundColor Yellow
    # Ajouter apres JWT_SECRET
    if ($envContent -match "JWT_SECRET=.*\r?\n") {
        $envContent = $envContent -replace "(JWT_SECRET=.*\r?\n)", "`$1JWT_EXPIRATION=24h`r`n"
    } else {
        # Si JWT_SECRET n'existe pas, ajouter a la fin
        $envContent += "`r`nJWT_EXPIRATION=24h`r`n"
    }
}

# Sauvegarder
Write-Host "Sauvegarde du fichier .env..." -ForegroundColor Yellow
Set-Content -Path $backendEnvPath -Value $envContent -NoNewline

Write-Host "Fichier .env mis a jour !" -ForegroundColor Green
Write-Host ""

# Afficher la configuration JWT
Write-Host "Configuration JWT actuelle :" -ForegroundColor Cyan
Get-Content $backendEnvPath | Select-String "JWT" | ForEach-Object {
    Write-Host "   $_" -ForegroundColor White
}
Write-Host ""

# Redemarrer le backend
Write-Host "Redemarrage du backend..." -ForegroundColor Yellow
docker-compose restart backend

Write-Host ""
Write-Host "Attente du redemarrage (10 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verifier que le backend est demarre
Write-Host ""
Write-Host "Verification du statut..." -ForegroundColor Yellow
docker-compose ps | Select-String "backend"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "CORRECTION TERMINEE !" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "PROCHAINES ETAPES :" -ForegroundColor Yellow
Write-Host "   1. Ouvrez votre navigateur (F12)" -ForegroundColor White
Write-Host "   2. Console -> Tapez : localStorage.clear()" -ForegroundColor White
Write-Host "   3. Rechargez la page (F5)" -ForegroundColor White
Write-Host "   4. Reconnectez-vous avec :" -ForegroundColor White
Write-Host "      Email: vendeur1@gmail.com" -ForegroundColor Cyan
Write-Host "      Mot de passe: seller123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Vous resterez maintenant connecte pendant 24 heures !" -ForegroundColor Green
Write-Host ""
