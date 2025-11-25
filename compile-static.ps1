Write-Host "Compilation du site en version statique..." -ForegroundColor Green
Write-Host ""

# Modifier next.config.js
Write-Host "Configuration de Next.js..." -ForegroundColor Yellow

$configContent = @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
'@

Set-Content -Path "frontend\next.config.js" -Value $configContent -Encoding UTF8

Write-Host "Configuration OK" -ForegroundColor Green
Write-Host ""
Write-Host "Compilation du frontend..." -ForegroundColor Yellow

Set-Location "frontend"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "COMPILATION REUSSIE !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Le site compile se trouve dans : frontend\out\" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "PROCHAINE ETAPE :" -ForegroundColor Yellow
    Write-Host "1. Ouvrez FileZilla" -ForegroundColor White
    Write-Host "2. Connectez-vous au serveur FTP" -ForegroundColor White
    Write-Host "3. Transferez TOUT le contenu de frontend\out\ vers /public_html/" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "ERREUR lors de la compilation" -ForegroundColor Red
}

Set-Location ".."



