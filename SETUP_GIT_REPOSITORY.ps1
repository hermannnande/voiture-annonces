# =====================================================
# Script de Configuration Git Repository
# =====================================================

Write-Host "🚀 Démarrage de la configuration Git..." -ForegroundColor Cyan
Write-Host ""

# Étape 1 : Vérifier que nous sommes dans le bon dossier
$currentPath = Get-Location
Write-Host "📁 Dossier actuel : $currentPath" -ForegroundColor Yellow

# Étape 2 : Initialiser Git dans le dossier actuel
Write-Host ""
Write-Host "📦 Initialisation de Git..." -ForegroundColor Cyan

# Trouver le chemin de Git (installé avec GitHub Desktop)
$gitPath = ""
$possiblePaths = @(
    "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe",
    "C:\Program Files\Git\cmd\git.exe",
    "$env:ProgramFiles\Git\cmd\git.exe"
)

foreach ($path in $possiblePaths) {
    $found = Get-ChildItem -Path (Split-Path $path -Parent) -Filter "git.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $gitPath = $found.FullName
        break
    }
}

# Si Git n'est pas trouvé via les chemins, chercher dans GitHub Desktop
if (-not $gitPath) {
    $githubDesktopPath = "$env:LOCALAPPDATA\GitHubDesktop"
    if (Test-Path $githubDesktopPath) {
        $gitExe = Get-ChildItem -Path $githubDesktopPath -Filter "git.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($gitExe) {
            $gitPath = $gitExe.FullName
        }
    }
}

if (-not $gitPath) {
    Write-Host "❌ Git n'est pas trouvé. Veuillez installer Git ou GitHub Desktop." -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Téléchargez Git : https://git-scm.com/downloads" -ForegroundColor Yellow
    Write-Host "📥 Ou GitHub Desktop : https://desktop.github.com/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⏸️  Appuyez sur une touche pour continuer quand Git sera installé..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "✅ Git trouvé : $gitPath" -ForegroundColor Green

# Créer un alias pour git
function Invoke-Git {
    & $gitPath @args
}

# Étape 3 : Initialiser le repository
Write-Host ""
Write-Host "🔧 Initialisation du repository Git..." -ForegroundColor Cyan

if (Test-Path ".git") {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
} else {
    Invoke-Git init
    Write-Host "✅ Repository Git initialisé" -ForegroundColor Green
}

# Étape 4 : Ajouter le remote GitHub
Write-Host ""
Write-Host "🌐 Configuration du remote GitHub..." -ForegroundColor Cyan

$remoteUrl = "https://github.com/hermannmande/voiture-annonces.git"
$existingRemote = Invoke-Git remote get-url origin 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Remote 'origin' déjà configuré : $existingRemote" -ForegroundColor Green
} else {
    Invoke-Git remote add origin $remoteUrl
    Write-Host "✅ Remote 'origin' ajouté : $remoteUrl" -ForegroundColor Green
}

# Étape 5 : Fetch depuis GitHub
Write-Host ""
Write-Host "📡 Récupération des données depuis GitHub..." -ForegroundColor Cyan
Invoke-Git fetch origin

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Données récupérées" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erreur lors du fetch (c'est peut-être normal si c'est la première fois)" -ForegroundColor Yellow
}

# Étape 6 : Configurer la branche main
Write-Host ""
Write-Host "🌿 Configuration de la branche..." -ForegroundColor Cyan

$currentBranch = Invoke-Git branch --show-current 2>&1
if (-not $currentBranch) {
    # Pas de branche, on est sur un nouveau repo
    Invoke-Git checkout -b main
    Write-Host "✅ Branche 'main' créée" -ForegroundColor Green
} else {
    Write-Host "✅ Branche actuelle : $currentBranch" -ForegroundColor Green
}

# Étape 7 : Configurer l'upstream
Write-Host ""
Write-Host "⬆️  Configuration de l'upstream..." -ForegroundColor Cyan
Invoke-Git branch --set-upstream-to=origin/main main 2>&1 | Out-Null

# Étape 8 : Afficher le statut
Write-Host ""
Write-Host "📊 Statut du repository :" -ForegroundColor Cyan
Invoke-Git status --short

Write-Host ""
Write-Host "✅ Configuration terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Yellow
Write-Host "   1. Ouvrez GitHub Desktop" -ForegroundColor White
Write-Host "   2. Sélectionnez le repository 'voiture-annonces'" -ForegroundColor White
Write-Host "   3. Vous devriez voir tous les fichiers modifiés" -ForegroundColor White
Write-Host "   4. Commitez et poussez les changements !" -ForegroundColor White
Write-Host ""
Write-Host "⏸️  Appuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

