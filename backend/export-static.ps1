# Script de compilation pour hébergement statique
# Utiliser quand SSH n'est pas disponible

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║     📦 COMPILATION POUR HÉBERGEMENT STATIQUE (SANS SSH)     ║" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Modifier next.config.js pour l'export statique
Write-Host "⚙️  Configuration de Next.js pour export statique..." -ForegroundColor Yellow

$nextConfigPath = "frontend\next.config.js"
$nextConfigContent = @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.annonceauto.ci/api',
    NEXT_PUBLIC_SITE_URL: 'https://annonceauto.ci',
  },
  trailingSlash: true,
};

module.exports = nextConfig;
"@

# Sauvegarder l'ancien fichier
if (Test-Path $nextConfigPath) {
    Copy-Item $nextConfigPath "$nextConfigPath.backup" -Force
    Write-Host "✅ Ancien next.config.js sauvegardé" -ForegroundColor Green
}

# Écrire la nouvelle configuration
$nextConfigContent | Out-File -FilePath $nextConfigPath -Encoding utf8 -Force
Write-Host "✅ next.config.js configuré pour export statique" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Compilation du frontend..." -ForegroundColor Yellow
cd frontend

# Installer les dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Compiler
Write-Host "🔨 Compilation en cours..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                              ║" -ForegroundColor Green
    Write-Host "║              ✅ COMPILATION RÉUSSIE !                        ║" -ForegroundColor Green
    Write-Host "║                                                              ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Le site compilé se trouve dans : frontend\out\" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📤 PROCHAINES ÉTAPES :" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1️⃣  Ouvrez FileZilla" -ForegroundColor White
    Write-Host "2️⃣  Connectez-vous à votre serveur FTP :" -ForegroundColor White
    Write-Host "     Hôte : vps116108.serveur-vps.net" -ForegroundColor Gray
    Write-Host "     User : root" -ForegroundColor Gray
    Write-Host "     Pass : U9p0j2o8Y2h2C7C" -ForegroundColor Gray
    Write-Host "3️⃣  Allez dans le dossier /public_html/ ou /www/" -ForegroundColor White
    Write-Host "4️⃣  Transférez TOUT le contenu de frontend\out\ vers ce dossier" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Fichiers à transférer :" -ForegroundColor Cyan
    Write-Host "   frontend\out\* → /public_html/" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  IMPORTANT : Transférez aussi le fichier .htaccess créé" -ForegroundColor Yellow
    Write-Host ""
    
    # Créer le fichier .htaccess
    $htaccessContent = @"
# Configuration pour annonceauto.ci
# Redirection HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Support des routes Next.js
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache des fichiers statiques
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
"@

    $htaccessContent | Out-File -FilePath "out\.htaccess" -Encoding utf8 -Force
    Write-Host "✅ Fichier .htaccess créé dans frontend\out\" -ForegroundColor Green
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors de la compilation" -ForegroundColor Red
    Write-Host "Vérifiez les erreurs ci-dessus" -ForegroundColor Yellow
    exit 1
}

cd ..

Write-Host "💡 CONSEIL : Si vous voyez des erreurs, lisez DEPLOIEMENT_SANS_SSH.md" -ForegroundColor Cyan
Write-Host ""



