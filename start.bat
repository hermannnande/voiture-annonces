@echo off
REM Script de démarrage automatique pour Windows

echo.
echo ===========================================
echo  Annonces Auto CI - Demarrage automatique
echo ===========================================
echo.

REM Vérifier que Docker est installé
docker --version >nul 2>&1
if errorlevel 1 (
    echo Erreur: Docker n'est pas installe.
    echo Veuillez installer Docker Desktop.
    pause
    exit /b 1
)

echo Docker detecte
echo.

REM Créer le fichier .env si nécessaire
if not exist backend\.env (
    echo Creation du fichier .env...
    copy env.example backend\.env
    echo Fichier .env cree
)

echo Demarrage des conteneurs Docker...
docker-compose up -d

echo Attente que les services soient prets (30 secondes)...
timeout /t 30 /nobreak >nul

echo Generation du client Prisma...
docker-compose exec backend npx prisma generate

echo Application des migrations...
docker-compose exec backend npx prisma migrate deploy

echo Seed de la base de donnees...
docker-compose exec backend npm run prisma:seed

echo.
echo ============================================
echo  Installation terminee avec succes !
echo ============================================
echo.
echo Services disponibles :
echo   - Frontend:      http://localhost:3000
echo   - Backend API:   http://localhost:3001/api
echo   - MailDev:       http://localhost:1080
echo.
echo Comptes de test :
echo   - Super Admin:   admin@voiture.com / admin123
echo   - Vendeur 1:     vendeur1@gmail.com / seller123
echo   - Vendeur 2:     vendeur2@gmail.com / seller123
echo.
echo Commandes utiles :
echo   - Voir les logs:           docker-compose logs -f
echo   - Arreter les services:    docker-compose down
echo   - Redemarrer:              docker-compose restart
echo   - Prisma Studio:           docker-compose exec backend npx prisma studio
echo.
pause





