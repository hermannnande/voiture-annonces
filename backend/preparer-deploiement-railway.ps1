# Script de préparation pour le déploiement sur Railway

Write-Host "`n=== PREPARATION DEPLOIEMENT RAILWAY ===" -ForegroundColor Cyan
Write-Host "Ce script va preparer votre projet pour Railway" -ForegroundColor White

# 1. Créer .gitignore
Write-Host "`n1. Creation du fichier .gitignore..." -ForegroundColor Yellow

$gitignoreContent = @"
# Node modules
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.production

# Database
*.db
*.db-journal
dev.db
prisma/dev.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Temp
tmp/
temp/

# Deployment files
*.ps1
*.sh
*.md
"@

Set-Content -Path ".gitignore" -Value $gitignoreContent
Write-Host "   ✅ .gitignore cree" -ForegroundColor Green

# 2. Créer railway.json
Write-Host "`n2. Creation du fichier railway.json..." -ForegroundColor Yellow

$railwayConfig = @"
{
  "`$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm install && npx prisma generate && npx prisma migrate deploy && npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
"@

Set-Content -Path "railway.json" -Value $railwayConfig
Write-Host "   ✅ railway.json cree" -ForegroundColor Green

# 3. Vérifier si Git est initialisé
Write-Host "`n3. Verification de Git..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "   ✅ Git deja initialise" -ForegroundColor Green
} else {
    Write-Host "   Git n'est pas initialise" -ForegroundColor Red
    Write-Host "   Initialisation de Git..." -ForegroundColor Yellow
    git init
    Write-Host "   ✅ Git initialise" -ForegroundColor Green
}

# 4. Modifier le schema Prisma pour PostgreSQL
Write-Host "`n4. Configuration Prisma pour PostgreSQL..." -ForegroundColor Yellow

$schemaPath = "backend\prisma\schema.prisma"
$schemaContent = Get-Content $schemaPath -Raw

if ($schemaContent -match 'provider = "sqlite"') {
    Write-Host "   Changement de SQLite vers PostgreSQL..." -ForegroundColor Yellow
    $schemaContent = $schemaContent -replace 'provider = "sqlite"', 'provider = "postgresql"'
    
    # Rajouter @db.Text pour les champs String longs
    $schemaContent = $schemaContent -replace '(\s+description\s+String)(?!\s+@db\.Text)', '$1 @db.Text'
    $schemaContent = $schemaContent -replace '(\s+rejectionReason\s+String\?)(?!\s+@db\.Text)', '$1 @db.Text'
    $schemaContent = $schemaContent -replace '(\s+body\s+String)(?!\s+@db\.Text)', '$1 @db.Text'
    $schemaContent = $schemaContent -replace '(\s+reason\s+String)(?!\s+@db\.Text)', '$1 @db.Text'
    $schemaContent = $schemaContent -replace '(\s+adminNote\s+String\?)(?!\s+@db\.Text)', '$1 @db.Text'
    
    Set-Content -Path $schemaPath -Value $schemaContent
    Write-Host "   ✅ Schema Prisma configure pour PostgreSQL" -ForegroundColor Green
} else {
    Write-Host "   ✅ Schema Prisma deja configure pour PostgreSQL" -ForegroundColor Green
}

# 5. Créer .env.example pour Railway
Write-Host "`n5. Creation de .env.example..." -ForegroundColor Yellow

$envExample = @"
# Database (Railway fournira automatiquement DATABASE_URL)
DATABASE_URL=postgresql://user:password@host:port/database

# JWT Secrets (CHANGEZ CES VALEURS !)
JWT_SECRET=votre_secret_jwt_super_securise_production_2024
JWT_REFRESH_SECRET=votre_refresh_secret_ultra_securise_production_2024
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Application
NODE_ENV=production
PORT=3001
"@

Set-Content -Path "backend\.env.example" -Value $envExample
Write-Host "   ✅ .env.example cree" -ForegroundColor Green

# 6. Afficher les instructions finales
Write-Host "`n=== PREPARATION TERMINEE ! ===" -ForegroundColor Green

Write-Host "`n📋 PROCHAINES ETAPES :" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Creez un repository sur GitHub :" -ForegroundColor White
Write-Host "   https://github.com/new" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Ajoutez vos fichiers a Git :" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Yellow
Write-Host "   git commit -m 'Initial commit - AnnonceAuto CI'" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Liez votre repository GitHub :" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/VOTRE_USERNAME/annonceauto-ci.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Deploiement sur Railway :" -ForegroundColor White
Write-Host "   - Allez sur https://railway.app" -ForegroundColor Yellow
Write-Host "   - Connectez-vous avec GitHub" -ForegroundColor Yellow
Write-Host "   - Cliquez 'New Project' > 'Deploy from GitHub repo'" -ForegroundColor Yellow
Write-Host "   - Selectionnez votre repository" -ForegroundColor Yellow
Write-Host "   - Ajoutez une base PostgreSQL (+ New > Database > PostgreSQL)" -ForegroundColor Yellow
Write-Host "   - Configurez les variables d'environnement (voir .env.example)" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Deploiement du Frontend sur Vercel :" -ForegroundColor White
Write-Host "   - Allez sur https://vercel.com" -ForegroundColor Yellow
Write-Host "   - Connectez-vous avec GitHub" -ForegroundColor Yellow
Write-Host "   - Add New Project > Selectionnez votre repo" -ForegroundColor Yellow
Write-Host "   - Root Directory: 'frontend'" -ForegroundColor Yellow
Write-Host "   - Ajoutez les variables d'environnement" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 Guide complet : DEPLOIEMENT_RAILWAY.md" -ForegroundColor Cyan
Write-Host "📊 Comparaison des solutions : COMPARAISON_HEBERGEURS.md" -ForegroundColor Cyan
Write-Host ""



