# Script de Préparation pour GitHub et Déploiement
# Côte d'Ivoire Marketplace Voiture

Write-Host "🚀 Préparation du Projet pour GitHub et Déploiement" -ForegroundColor Green
Write-Host ""

# Vérifier si on est dans le bon dossier
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis le dossier racine du projet" -ForegroundColor Red
    Write-Host "   Dossier actuel: $PWD" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Dossier du projet détecté" -ForegroundColor Green
Write-Host ""

# 1. Créer le fichier .gitignore
Write-Host "📝 Création du fichier .gitignore..." -ForegroundColor Yellow

$gitignoreContent = @"
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment files
.env
.env.local
.env.production
.env.development
backend/.env
frontend/.env.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Build outputs
dist/
build/
.next/
out/

# Uploads (ne pas commit les images)
uploads/
backend/uploads/

# Prisma
backend/prisma/migrations/*.sql

# Temp files
*.tmp
.cache/

# Docker
docker-compose.override.yml
"@

Set-Content -Path ".gitignore" -Value $gitignoreContent -Encoding UTF8
Write-Host "✅ .gitignore créé" -ForegroundColor Green
Write-Host ""

# 2. Créer le railway.json pour le backend
Write-Host "📝 Création du fichier railway.json pour le backend..." -ForegroundColor Yellow

$railwayConfig = @"
{
  "`$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
"@

Set-Content -Path "backend/railway.json" -Value $railwayConfig -Encoding UTF8
Write-Host "✅ railway.json créé" -ForegroundColor Green
Write-Host ""

# 3. Créer un README.md
Write-Host "📝 Création du fichier README.md..." -ForegroundColor Yellow

$readmeContent = @"
# 🚗 Marketplace Voiture - Côte d'Ivoire

Application de vente de voitures d'occasion en Côte d'Ivoire.

## 🚀 Technologies

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: NestJS, Prisma, PostgreSQL
- **Cache**: Redis
- **Auth**: JWT

## 📦 Structure

\`\`\`
/
├── backend/          # API NestJS
├── frontend/         # Application Next.js
└── docker-compose.yml
\`\`\`

## 🌐 Déploiement

- **Gratuit**: Railway + Vercel → Voir \`GUIDE_DEPLOIEMENT_GRATUIT_RAILWAY.md\`
- **Production**: VPS LWS → Voir \`GUIDE_RAPIDE_DEPLOIEMENT_LWS.md\`

## 🔧 Installation Locale

\`\`\`bash
# Lancer avec Docker
docker-compose up -d

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
\`\`\`

## 📚 Documentation

- \`GUIDE_DEPLOIEMENT_GRATUIT_RAILWAY.md\` - Déploiement gratuit
- \`GUIDE_RAPIDE_DEPLOIEMENT_LWS.md\` - Déploiement VPS
- \`DEPLOIEMENT_LWS.md\` - Guide complet

## 👥 Comptes de Test

- **Admin**: admin@voiture.com / admin123
- **Vendeur**: seller1@voiture.com / seller123

---

**Développé en Côte d'Ivoire 🇨🇮**
"@

Set-Content -Path "README.md" -Value $readmeContent -Encoding UTF8
Write-Host "✅ README.md créé" -ForegroundColor Green
Write-Host ""

# 4. Vérifier Git
Write-Host "🔍 Vérification de Git..." -ForegroundColor Yellow

if (-not (Test-Path ".git")) {
    Write-Host "📦 Initialisation de Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Git déjà initialisé" -ForegroundColor Green
}
Write-Host ""

# 5. Afficher le résumé
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ PRÉPARATION TERMINÉE !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Fichiers créés:" -ForegroundColor Yellow
Write-Host "   ✅ .gitignore"
Write-Host "   ✅ backend/railway.json"
Write-Host "   ✅ README.md"
Write-Host "   ✅ Git initialisé"
Write-Host ""
Write-Host "🎯 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Créer un dépôt sur GitHub:" -ForegroundColor Cyan
Write-Host "    → https://github.com/new" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Ajouter et commit vos fichiers:" -ForegroundColor Cyan
Write-Host "    git add ." -ForegroundColor White
Write-Host '    git commit -m "Initial commit - Marketplace Voiture CI"' -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  Connecter à GitHub (remplacer VOTRE_USERNAME):" -ForegroundColor Cyan
Write-Host "    git remote add origin https://github.com/VOTRE_USERNAME/voiture-marketplace.git" -ForegroundColor White
Write-Host "    git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "4️⃣  Déployer GRATUITEMENT:" -ForegroundColor Cyan
Write-Host "    → Ouvrir: GUIDE_DEPLOIEMENT_GRATUIT_RAILWAY.md" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 ASTUCE: Vous pouvez maintenant:" -ForegroundColor Yellow
Write-Host "   • Tester GRATUITEMENT sur Railway + Vercel"
Write-Host "   • Ou déployer sur un VPS LWS (15€/mois)"
Write-Host ""
Write-Host "📚 Tous les guides sont prêts dans votre dossier !" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Bon déploiement !" -ForegroundColor Green
Write-Host ""

# Pause
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


