# 🚀 Guide de Démarrage Rapide

## Installation en 3 étapes

### Option 1 : Script Automatique (Recommandé)

#### Sur Linux/Mac :
\`\`\`bash
chmod +x start.sh
./start.sh
\`\`\`

#### Sur Windows :
Double-cliquez sur `start.bat` ou exécutez dans PowerShell :
\`\`\`powershell
.\start.bat
\`\`\`

### Option 2 : Manuel

\`\`\`bash
# 1. Démarrer Docker Compose
docker-compose up -d

# 2. Attendre 30 secondes que tout démarre

# 3. Initialiser la base de données
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run prisma:seed
\`\`\`

## 🌐 Accéder à l'Application

Une fois démarré :

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001/api
- **MailDev** (emails de test) : http://localhost:1080

## 👤 Comptes de Test

### Super Administrateur
- **Email** : `admin@voiture.com`
- **Mot de passe** : `admin123`
- **Accès** : Modération, statistiques, gestion complète

### Vendeur 1
- **Email** : `vendeur1@gmail.com`
- **Mot de passe** : `seller123`
- **Accès** : Créer et gérer ses annonces

### Vendeur 2
- **Email** : `vendeur2@gmail.com`
- **Mot de passe** : `seller123`
- **Accès** : Créer et gérer ses annonces

## 🎯 Tester les Fonctionnalités

### 1. Côté Public (Sans Connexion)
1. Aller sur http://localhost:3000
2. Parcourir les annonces de démonstration
3. Utiliser les filtres (marque, prix, année, etc.)
4. Voir une fiche annonce détaillée

### 2. Côté Vendeur
1. Se connecter avec `vendeur1@gmail.com` / `seller123`
2. Créer une nouvelle annonce
3. Uploader des images (simulation)
4. Attendre l'approbation de l'admin

### 3. Côté Administrateur
1. Se connecter avec `admin@voiture.com` / `admin123`
2. Aller dans "Administration"
3. Voir la file de modération
4. Approuver ou refuser des annonces
5. Consulter les statistiques
6. Voir les logs d'audit

## 📊 Données de Démonstration

Le seed crée automatiquement :
- ✅ 36 marques de véhicules
- ✅ 8 catégories
- ✅ 4 produits de boost
- ✅ 5 annonces (approuvées, en attente, vendues)

## 🔧 Commandes Utiles

\`\`\`bash
# Voir les logs en temps réel
docker-compose logs -f backend
docker-compose logs -f frontend

# Arrêter tous les services
docker-compose down

# Redémarrer un service
docker-compose restart backend

# Ouvrir Prisma Studio (interface DB)
docker-compose exec backend npx prisma studio
# Puis ouvrir http://localhost:5555

# Réinitialiser complètement (⚠️ efface les données)
docker-compose down -v
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run prisma:seed
\`\`\`

## ❓ Problèmes Courants

### Le frontend ne se connecte pas au backend
- Vérifier que le backend est bien démarré : `docker-compose ps`
- Vérifier les logs : `docker-compose logs backend`
- L'URL de l'API doit être http://localhost:3001/api

### Erreur Prisma "Client not generated"
\`\`\`bash
docker-compose exec backend npx prisma generate
docker-compose restart backend
\`\`\`

### La base de données est vide
\`\`\`bash
docker-compose exec backend npm run prisma:seed
\`\`\`

### Port déjà utilisé
Si les ports 3000, 3001 ou 5432 sont déjà utilisés :
1. Modifier les ports dans `docker-compose.yml`
2. Redémarrer : `docker-compose down && docker-compose up -d`

## 🎉 C'est Parti !

Vous êtes prêt à utiliser la plateforme ! Explorez les différentes fonctionnalités :

1. 🔍 **Recherche avancée** avec filtres multiples
2. 💬 **Messagerie intégrée** entre acheteurs et vendeurs
3. 📱 **Contact WhatsApp** en un clic
4. ⭐ **Système de boost** pour mettre en avant les annonces
5. ✅ **Modération obligatoire** avant publication
6. 📊 **Statistiques complètes** pour l'admin
7. 📝 **Logs d'audit** pour la traçabilité

## 📚 Documentation Complète

Pour plus de détails, consultez le **README.md** principal.

---

**Questions ?** Consultez la section Dépannage du README ou vérifiez les logs Docker.





