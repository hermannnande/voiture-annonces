# Script de vérification des JWT secrets Railway
# Usage: .\verifier-jwt-secrets.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   VERIFICATION JWT SECRETS RAILWAY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔍 Vérification des secrets JWT..." -ForegroundColor Yellow
Write-Host ""

Write-Host "⚠️  IMPORTANT : JWT_SECRET et JWT_REFRESH_SECRET doivent :" -ForegroundColor Yellow
Write-Host "  1. Être configurés sur Railway" -ForegroundColor Gray
Write-Host "  2. JAMAIS changer entre les déploiements" -ForegroundColor Gray
Write-Host "  3. Être longs (32+ caractères)" -ForegroundColor Gray
Write-Host "  4. Être différents l'un de l'autre" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Étapes de vérification :" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  Allez sur Railway Dashboard" -ForegroundColor Yellow
Write-Host "   https://railway.app/" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  Cliquez sur votre projet 'voiture-annonces'" -ForegroundColor Yellow
Write-Host ""

Write-Host "3️⃣  Cliquez sur 'Variables'" -ForegroundColor Yellow
Write-Host ""

Write-Host "4️⃣  Vérifiez ces variables :" -ForegroundColor Yellow
Write-Host ""

Write-Host "   JWT_SECRET" -ForegroundColor Cyan
Write-Host "   └─ Valeur : [Doit être fixe, long, sécurisé]" -ForegroundColor Gray
Write-Host "   └─ Si manquant, générez-en un ci-dessous" -ForegroundColor Gray
Write-Host ""

Write-Host "   JWT_REFRESH_SECRET" -ForegroundColor Cyan
Write-Host "   └─ Valeur : [Différent de JWT_SECRET]" -ForegroundColor Gray
Write-Host "   └─ Si manquant, générez-en un ci-dessous" -ForegroundColor Gray
Write-Host ""

Write-Host "   JWT_EXPIRATION" -ForegroundColor Cyan
Write-Host "   └─ Valeur recommandée : 30d" -ForegroundColor Green
Write-Host ""

Write-Host "   JWT_REFRESH_EXPIRATION" -ForegroundColor Cyan
Write-Host "   └─ Valeur recommandée : 90d" -ForegroundColor Green
Write-Host ""

$generate = Read-Host "Voulez-vous générer de nouveaux secrets JWT ? (O/n)"

if ($generate -ne 'n' -and $generate -ne 'N') {
    Write-Host ""
    Write-Host "🔐 Génération de secrets sécurisés..." -ForegroundColor Cyan
    Write-Host ""
    
    # Vérifier si Node.js est disponible
    $nodeVersion = node --version 2>$null
    
    if ($nodeVersion) {
        Write-Host "JWT_SECRET :" -ForegroundColor Green
        $jwtSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        Write-Host $jwtSecret -ForegroundColor White
        Write-Host ""
        
        Write-Host "JWT_REFRESH_SECRET :" -ForegroundColor Green
        $jwtRefreshSecret = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
        Write-Host $jwtRefreshSecret -ForegroundColor White
        Write-Host ""
        
        Write-Host "⚠️  COPIEZ ces valeurs dans Railway Variables !" -ForegroundColor Yellow
        Write-Host "⚠️  NE commitez JAMAIS ces secrets dans Git !" -ForegroundColor Red
        Write-Host ""
        
        $save = Read-Host "Voulez-vous sauvegarder ces secrets localement (fichier .secrets.txt) ? (O/n)"
        
        if ($save -ne 'n' -and $save -ne 'N') {
            $content = @"
# JWT Secrets - NE PAS COMMITER !
# Date de génération : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

JWT_SECRET=$jwtSecret
JWT_REFRESH_SECRET=$jwtRefreshSecret
JWT_EXPIRATION=30d
JWT_REFRESH_EXPIRATION=90d

# IMPORTANT :
# 1. Copiez ces valeurs dans Railway > Variables
# 2. Ne changez JAMAIS ces valeurs après déploiement
# 3. Gardez ce fichier en sécurité
# 4. Ce fichier est dans .gitignore
"@
            
            $content | Out-File -FilePath ".secrets.txt" -Encoding UTF8
            
            Write-Host "✅ Secrets sauvegardés dans .secrets.txt" -ForegroundColor Green
            Write-Host "⚠️  Ce fichier est ignoré par Git (.gitignore)" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "❌ Node.js non trouvé !" -ForegroundColor Red
        Write-Host ""
        Write-Host "Alternative - Générez les secrets en ligne :" -ForegroundColor Yellow
        Write-Host "https://generate-secret.vercel.app/32" -ForegroundColor White
        Write-Host ""
        Write-Host "Ou installez Node.js :" -ForegroundColor Yellow
        Write-Host "https://nodejs.org/" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CHECKLIST FINALE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ À vérifier :" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [ ] JWT_SECRET configuré sur Railway" -ForegroundColor White
Write-Host "  [ ] JWT_REFRESH_SECRET configuré sur Railway" -ForegroundColor White
Write-Host "  [ ] JWT_EXPIRATION = 30d" -ForegroundColor White
Write-Host "  [ ] JWT_REFRESH_EXPIRATION = 90d" -ForegroundColor White
Write-Host "  [ ] Les 2 secrets sont DIFFÉRENTS" -ForegroundColor White
Write-Host "  [ ] Les secrets sont LONGS (32+ caractères)" -ForegroundColor White
Write-Host "  [ ] Backup des secrets créé (local, sécurisé)" -ForegroundColor White
Write-Host ""

Write-Host "🔒 Sécurité :" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✅ NE PAS commiter les secrets dans Git" -ForegroundColor Green
Write-Host "  ✅ NE PAS partager les secrets publiquement" -ForegroundColor Green
Write-Host "  ✅ NE PAS changer les secrets en production" -ForegroundColor Green
Write-Host "  ✅ Garder une backup sécurisée" -ForegroundColor Green
Write-Host ""

Write-Host "📚 Documentation complète :" -ForegroundColor Cyan
Write-Host "   CORRECTION_SESSION_PERSISTANTE.md" -ForegroundColor White
Write-Host ""

$openRailway = Read-Host "Ouvrir Railway Dashboard maintenant ? (O/n)"

if ($openRailway -ne 'n' -and $openRailway -ne 'N') {
    Start-Process "https://railway.app/"
    Write-Host "✅ Railway Dashboard ouvert" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Script terminé" -ForegroundColor Green
Write-Host ""

