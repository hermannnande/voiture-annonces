# Script de Déploiement Automatique
# Ce script clone le repo Git et copie les nouveaux fichiers

Write-Host "🚀 Démarrage du déploiement automatique..." -ForegroundColor Green
Write-Host ""

# Étape 1 : Vérifier que GitHub Desktop est installé
Write-Host "📦 Vérification de GitHub Desktop..." -ForegroundColor Cyan
$githubDesktopPath = "$env:LOCALAPPDATA\GitHubDesktop"
if (!(Test-Path $githubDesktopPath)) {
    Write-Host "❌ GitHub Desktop n'est pas installé ou n'est pas trouvé" -ForegroundColor Red
    Write-Host "Veuillez installer GitHub Desktop depuis : https://desktop.github.com/" -ForegroundColor Yellow
    pause
    exit
}

# Trouver git.exe de GitHub Desktop
$gitExe = Get-ChildItem "$githubDesktopPath" -Recurse -Filter "git.exe" | Select-Object -First 1 -ExpandProperty FullName
if (!$gitExe) {
    Write-Host "❌ Git.exe non trouvé dans GitHub Desktop" -ForegroundColor Red
    pause
    exit
}

Write-Host "✅ GitHub Desktop trouvé" -ForegroundColor Green
Write-Host "   Git: $gitExe" -ForegroundColor Gray
Write-Host ""

# Étape 2 : Cloner le repository
Write-Host "📥 Clonage du repository depuis GitHub..." -ForegroundColor Cyan
$repoUrl = "https://github.com/hermannmande/voiture-annonces.git"
$cloneDir = "$PSScriptRoot\voiture-annonces-GIT"

if (Test-Path $cloneDir) {
    Write-Host "⚠️  Le dossier $cloneDir existe déjà" -ForegroundColor Yellow
    $response = Read-Host "Voulez-vous le supprimer et recommencer ? (O/N)"
    if ($response -eq "O" -or $response -eq "o") {
        Remove-Item $cloneDir -Recurse -Force
        Write-Host "✅ Dossier supprimé" -ForegroundColor Green
    } else {
        Write-Host "❌ Opération annulée" -ForegroundColor Red
        pause
        exit
    }
}

Write-Host "Clonage en cours..." -ForegroundColor Yellow
& $gitExe clone $repoUrl $cloneDir 2>&1 | Out-Null

if (!(Test-Path $cloneDir)) {
    Write-Host "❌ Échec du clonage" -ForegroundColor Red
    pause
    exit
}

Write-Host "✅ Repository cloné avec succès" -ForegroundColor Green
Write-Host ""

# Étape 3 : Copier les nouveaux fichiers
Write-Host "📂 Copie des nouveaux fichiers..." -ForegroundColor Cyan

# Copier les pages
$sourcePagesDir = "$PSScriptRoot\voiture-annonces-NOUVEAUX-FICHIERS"
$destAuthDir = "$cloneDir\frontend\src\app\auth"

if (Test-Path "$sourcePagesDir\registration-success") {
    Copy-Item "$sourcePagesDir\registration-success" "$destAuthDir\" -Recurse -Force
    Write-Host "✅ Page registration-success copiée" -ForegroundColor Green
}

if (Test-Path "$sourcePagesDir\resend-verification") {
    Copy-Item "$sourcePagesDir\resend-verification" "$destAuthDir\" -Recurse -Force
    Write-Host "✅ Page resend-verification copiée" -ForegroundColor Green
}

# Copier les fichiers markdown et txt (sauf le script lui-même)
Get-ChildItem "$sourcePagesDir\*.md" | ForEach-Object {
    Copy-Item $_.FullName "$cloneDir\" -Force
}

Get-ChildItem "$sourcePagesDir\*.txt" | Where-Object { $_.Name -ne "TEST_CHANGEMENT.txt" } | ForEach-Object {
    Copy-Item $_.FullName "$cloneDir\" -Force
}

Write-Host "✅ Documentation copiée" -ForegroundColor Green
Write-Host ""

# Étape 4 : Préparer le commit
Write-Host "📝 Vérification des fichiers ajoutés..." -ForegroundColor Cyan
Set-Location $cloneDir
& $gitExe status --short

Write-Host ""
Write-Host "✅ TERMINÉ !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Ouvrez GitHub Desktop" -ForegroundColor White
Write-Host "2. File > Add Local Repository" -ForegroundColor White
Write-Host "3. Sélectionnez : $cloneDir" -ForegroundColor Yellow
Write-Host "4. Vous verrez tous les changements" -ForegroundColor White
Write-Host "5. Commit avec le message : fix: Ajout pages inscription + correction Google OAuth" -ForegroundColor White
Write-Host "6. Push origin" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur une touche pour ouvrir GitHub Desktop..." -ForegroundColor Cyan
pause

# Ouvrir GitHub Desktop
Start-Process "github"

