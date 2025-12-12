# Script pour créer un compte admin directement
# Usage: .\creer-compte-admin.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CREATION COMPTE ADMIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$BackendURL = "https://voiture-annonces-production.up.railway.app/api"

Write-Host "📝 Informations du compte admin :" -ForegroundColor Yellow
Write-Host ""

$Email = Read-Host "Email"
$Password = Read-Host "Mot de passe" -AsSecureString
$PasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password))
$Name = Read-Host "Nom complet"
$Phone = Read-Host "Telephone (ex: +2250778030075)"

Write-Host ""
Write-Host "🔍 Creation du compte..." -ForegroundColor Cyan
Write-Host ""

try {
    # Créer le compte
    $registerBody = @{
        email = $Email
        password = $PasswordPlain
        name = $Name
        phone = $Phone
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BackendURL/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    
    Write-Host "✅ Compte utilisateur cree !" -ForegroundColor Green
    Write-Host ""
    Write-Host "User ID : $($response.user.id)" -ForegroundColor Cyan
    Write-Host "Email   : $($response.user.email)" -ForegroundColor Cyan
    Write-Host "Role    : $($response.user.role)" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "⚠️  ATTENTION : Le compte est cree comme SELLER (vendeur)" -ForegroundColor Yellow
    Write-Host "Pour le passer en SUPER_ADMIN, utilisez Railway CLI :" -ForegroundColor Yellow
    Write-Host ""
    Write-Host 'railway run npx prisma studio' -ForegroundColor White
    Write-Host "Puis modifiez le champ 'role' de SELLER vers SUPER_ADMIN" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Ou via SQL :" -ForegroundColor Yellow
    Write-Host "UPDATE users SET role = 'SUPER_ADMIN' WHERE email = '$Email';" -ForegroundColor White
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   ✅ COMPTE CREE !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Vous pouvez maintenant vous connecter avec :" -ForegroundColor Cyan
    Write-Host "  Email    : $Email" -ForegroundColor White
    Write-Host "  Password : [celui que vous avez entre]" -ForegroundColor White
    Write-Host ""
    
    $openSite = Read-Host "Ouvrir le site pour vous connecter ? (O/n)"
    
    if ($openSite -ne 'n' -and $openSite -ne 'N') {
        Start-Process "https://www.annonceauto.ci/auth/login"
        Write-Host "✅ Site ouvert" -ForegroundColor Green
    }
    
} catch {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "   ❌ ERREUR" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        
        try {
            $errorData = $responseBody | ConvertFrom-Json
            Write-Host "Message : $($errorData.message)" -ForegroundColor Red
            
            if ($errorData.message -like "*existe deja*") {
                Write-Host ""
                Write-Host "✅ Ce compte existe deja !" -ForegroundColor Yellow
                Write-Host "Utilisez simplement ces identifiants pour vous connecter." -ForegroundColor Cyan
                Write-Host ""
                
                $testLogin = Read-Host "Voulez-vous tester la connexion ? (O/n)"
                
                if ($testLogin -ne 'n' -and $testLogin -ne 'N') {
                    Write-Host ""
                    Write-Host "🔍 Test de connexion..." -ForegroundColor Cyan
                    
                    $loginBody = @{
                        email = $Email
                        password = $PasswordPlain
                    } | ConvertTo-Json
                    
                    try {
                        $loginResponse = Invoke-RestMethod -Uri "$BackendURL/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
                        
                        Write-Host ""
                        Write-Host "✅ CONNEXION REUSSIE !" -ForegroundColor Green
                        Write-Host "Nom  : $($loginResponse.user.name)" -ForegroundColor Cyan
                        Write-Host "Role : $($loginResponse.user.role)" -ForegroundColor Cyan
                        Write-Host ""
                        
                        Start-Process "https://www.annonceauto.ci/auth/login"
                        
                    } catch {
                        Write-Host ""
                        Write-Host "❌ Connexion echouee" -ForegroundColor Red
                        Write-Host "Le mot de passe est peut-etre different." -ForegroundColor Yellow
                        Write-Host ""
                    }
                }
            }
        } catch {
            Write-Host $responseBody -ForegroundColor Red
        }
    } else {
        Write-Host "Erreur : $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "📋 Verifications :" -ForegroundColor Yellow
    Write-Host "  1. Backend accessible ? $BackendURL/health" -ForegroundColor Gray
    Write-Host "  2. Email correct ? (pas de faute de frappe)" -ForegroundColor Gray
    Write-Host "  3. Mot de passe correct ? (majuscules/minuscules)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "✅ Script termine" -ForegroundColor Green
Write-Host ""

