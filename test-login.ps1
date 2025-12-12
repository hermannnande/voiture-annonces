# Script de test de connexion
# Usage: .\test-login.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TEST DE CONNEXION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$BackendURL = "https://voiture-annonces-production.up.railway.app/api"
$Email = Read-Host "Email"
$Password = Read-Host "Mot de passe" -AsSecureString
$PasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password))

Write-Host ""
Write-Host "🔍 Test de connexion..." -ForegroundColor Yellow
Write-Host "Email : $Email" -ForegroundColor Gray
Write-Host "Backend : $BackendURL" -ForegroundColor Gray
Write-Host ""

try {
    $body = @{
        email = $Email
        password = $PasswordPlain
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BackendURL/auth/login" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   ✅ CONNEXION REUSSIE !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "User ID     : $($response.user.id)" -ForegroundColor Cyan
    Write-Host "Nom         : $($response.user.name)" -ForegroundColor Cyan
    Write-Host "Email       : $($response.user.email)" -ForegroundColor Cyan
    Write-Host "Role        : $($response.user.role)" -ForegroundColor Cyan
    Write-Host "Access Token: $($response.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "   ❌ CONNEXION ECHOUEE" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    
    $errorMessage = $_.Exception.Message
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        
        try {
            $errorData = $responseBody | ConvertFrom-Json
            Write-Host "Erreur : $($errorData.message)" -ForegroundColor Red
        } catch {
            Write-Host "Erreur : $errorMessage" -ForegroundColor Red
        }
    } else {
        Write-Host "Erreur : $errorMessage" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "📋 Causes possibles :" -ForegroundColor Yellow
    Write-Host "  1. Email incorrect (verifiez les fautes de frappe)" -ForegroundColor Gray
    Write-Host "  2. Mot de passe incorrect" -ForegroundColor Gray
    Write-Host "  3. Compte n'existe pas" -ForegroundColor Gray
    Write-Host "  4. Backend inaccessible" -ForegroundColor Gray
    Write-Host ""
    
    $createAccount = Read-Host "Voulez-vous creer un nouveau compte ? (O/n)"
    
    if ($createAccount -ne 'n' -and $createAccount -ne 'N') {
        Write-Host ""
        Write-Host "📝 Creation de compte..." -ForegroundColor Cyan
        
        $name = Read-Host "Nom complet"
        $phone = Read-Host "Telephone (ex: +2250700000000)"
        
        try {
            $registerBody = @{
                email = $Email
                password = $PasswordPlain
                name = $name
                phone = $phone
            } | ConvertTo-Json
            
            $registerResponse = Invoke-RestMethod -Uri "$BackendURL/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
            
            Write-Host ""
            Write-Host "✅ Compte cree avec succes !" -ForegroundColor Green
            Write-Host "Vous pouvez maintenant vous connecter." -ForegroundColor Cyan
            Write-Host ""
            
        } catch {
            Write-Host ""
            Write-Host "❌ Erreur lors de la creation du compte" -ForegroundColor Red
            
            if ($_.Exception.Response) {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                
                try {
                    $errorData = $responseBody | ConvertFrom-Json
                    Write-Host "Erreur : $($errorData.message)" -ForegroundColor Red
                } catch {
                    Write-Host $responseBody -ForegroundColor Red
                }
            }
        }
    }
}

Write-Host ""
Write-Host "✅ Script termine" -ForegroundColor Green
Write-Host ""

