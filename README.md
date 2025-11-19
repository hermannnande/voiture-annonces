# 🚗 Annonces Auto CI - Plateforme de Vente de Véhicules

Site d'annonces de vente de véhicules 100% en français pour la Côte d'Ivoire. Une plateforme moderne, rapide et responsive avec modération obligatoire, messagerie intégrée, et système de monétisation.

## ✨ Fonctionnalités Principales

### Pour les Visiteurs
- 🔍 Recherche et filtres avancés (marque, prix, année, kilométrage, carburant, etc.)
- 📱 Interface responsive et moderne
- 🏷️ Consultation des annonces approuvées
- 💬 Contact direct : Messagerie interne + WhatsApp + Appel téléphonique
- ⭐ Annonces Premium mises en avant
- ❤️ Système de favoris

### Pour les Vendeurs
- ✍️ Création et édition d'annonces (jusqu'à 20 images)
- 📊 Tableau de bord avec statistiques (vues, messages, favoris)
- 🚀 Système de boost pour augmenter la visibilité
- 💰 Historique des paiements et factures
- 📬 Messagerie intégrée avec acheteurs
- ✅ Marquer "Vendu" une annonce

### Pour le Super Administrateur
- ✔️ **Modération obligatoire** : Toutes les annonces doivent être approuvées avant publication
- 👥 Gestion des utilisateurs (activer/désactiver)
- 📝 Gestion des catégories et marques (CRUD + import CSV)
- 🚨 Traitement des signalements
- 💵 Configuration des produits de boost (prix, durée, priorité)
- 📊 **Statistiques complètes** :
  - Annonces (créées, en attente, approuvées, refusées, vendues)
  - Temps moyen d'approbation
  - Top catégories et marques
  - Revenus des boosts
  - Trafic de base
- 📋 **Logs d'audit** : Traçabilité complète (qui a fait quoi, quand)
- 💬 Vue globale des conversations

## 🛠️ Stack Technique

### Backend
- **NestJS** - Framework Node.js robuste et scalable
- **PostgreSQL** - Base de données relationnelle
- **Prisma** - ORM moderne pour TypeScript
- **Redis** - Cache et gestion des queues
- **JWT** - Authentification sécurisée avec refresh tokens
- **Sharp** - Traitement et optimisation d'images
- **Bcrypt** - Hashage sécurisé des mots de passe

### Frontend
- **Next.js 14** - Framework React avec SSR/SSG
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Zustand** - Gestion d'état légère
- **Axios** - Client HTTP
- **Lucide Icons** - Icônes modernes

### DevOps
- **Docker & Docker Compose** - Conteneurisation
- **MailDev** - Serveur email de test local

## 📋 Prérequis

- **Node.js** >= 20.x
- **Docker** >= 24.x
- **Docker Compose** >= 2.x
- **npm** >= 10.x

## 🚀 Installation et Démarrage

### 1. Cloner le Projet

\`\`\`bash
git clone <url-du-repo>
cd voiture-5
\`\`\`

### 2. Configuration des Variables d'Environnement

Copier le fichier d'exemple :

\`\`\`bash
cp env.example backend/.env
\`\`\`

Le fichier \`.env\` par défaut est configuré pour fonctionner avec Docker Compose.

### 3. Démarrage avec Docker Compose

**Démarrer tous les services** (PostgreSQL, Redis, MailDev, Backend, Frontend) :

\`\`\`bash
docker-compose up -d
\`\`\`

**Attendre que tous les services soient prêts** (environ 1-2 minutes la première fois).

### 4. Initialiser la Base de Données

**Générer le client Prisma et lancer les migrations** :

\`\`\`bash
cd backend
docker-compose exec backend npx prisma migrate dev --name init
\`\`\`

**Seed de la base de données** (catégories, marques, comptes test, annonces de démo) :

\`\`\`bash
docker-compose exec backend npm run prisma:seed
\`\`\`

### 5. Accéder à l'Application

Une fois tous les services démarrés :

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur |
| **Backend API** | http://localhost:3001/api | API REST |
| **MailDev** | http://localhost:1080 | Interface emails de test |
| **Prisma Studio** | http://localhost:5555 | Interface admin DB (optionnel) |

Pour lancer Prisma Studio :

\`\`\`bash
docker-compose exec backend npx prisma studio
\`\`\`

## 👤 Comptes de Test

Après le seed, vous pouvez vous connecter avec :

### Super Administrateur
- **Email** : admin@voiture.com
- **Mot de passe** : admin123
- **Accès** : Dashboard Admin complet, modération, statistiques

### Vendeur 1
- **Email** : vendeur1@gmail.com
- **Mot de passe** : seller123
- **Accès** : Création d'annonces, dashboard vendeur

### Vendeur 2
- **Email** : vendeur2@gmail.com
- **Mot de passe** : seller123
- **Accès** : Création d'annonces, dashboard vendeur

## 📊 Données de Démonstration

Le seed crée automatiquement :

- ✅ **36 marques** de véhicules (Toyota, Nissan, BMW, Mercedes, etc.)
- ✅ **8 catégories** (Berlines, SUV, Transport, Luxe, etc.)
- ✅ **4 produits de boost** (différentes durées et prix)
- ✅ **5 annonces** de démonstration :
  - 2 approuvées (dont 1 sponsorisée)
  - 1 en attente de modération
  - 1 vendue
  - 1 véhicule de luxe

## 🗂️ Structure du Projet

\`\`\`
voiture-5/
├── backend/                 # API NestJS
│   ├── prisma/
│   │   ├── schema.prisma   # Schéma de base de données
│   │   └── seed.ts         # Script de seed
│   ├── src/
│   │   ├── auth/           # Authentification JWT
│   │   ├── users/          # Gestion utilisateurs
│   │   ├── listings/       # Annonces
│   │   ├── brands/         # Marques et modèles
│   │   ├── categories/     # Catégories
│   │   ├── messages/       # Messagerie
│   │   ├── boosts/         # Monétisation
│   │   ├── admin/          # Dashboard admin
│   │   ├── uploads/        # Gestion fichiers
│   │   └── audit/          # Logs de traçabilité
│   └── uploads/            # Images uploadées
├── frontend/               # Application Next.js
│   ├── src/
│   │   ├── app/           # Pages et routing
│   │   ├── components/    # Composants React
│   │   ├── lib/           # Utilitaires
│   │   └── stores/        # State management
│   └── public/            # Assets statiques
├── docker-compose.yml     # Orchestration Docker
└── README.md             # Ce fichier
\`\`\`

## 🔄 Flux de Modération (Obligatoire)

1. **Vendeur crée/modifie une annonce** → Statut = "En attente"
2. **Super Admin reçoit la demande** dans la file de modération
3. **Super Admin** peut :
   - ✅ **Approuver** → L'annonce devient publique
   - ❌ **Refuser** (avec motif obligatoire) → Vendeur notifié
4. **Toute modification majeure** repasse en attente de validation

## 💰 Système de Monétisation

### Produits de Boost Disponibles

| Produit | Durée | Prix | Avantages |
|---------|-------|------|-----------|
| Top de liste 7j | 7 jours | 5 000 FCFA | Apparaît en haut des listes |
| Top de liste 14j | 14 jours | 8 000 FCFA | Apparaît en haut des listes |
| Premium 7j | 7 jours | 10 000 FCFA | Top de liste + Page d'accueil |
| Premium 30j | 30 jours | 30 000 FCFA | Top de liste + Page d'accueil |

Les annonces boostées ont :
- 🏆 Priorité dans les résultats de recherche
- ⭐ Badge "Premium"
- 🎯 Visibilité accrue

## 🛡️ Sécurité

- ✅ Rate limiting (100 req/min)
- ✅ Validation côté serveur (class-validator)
- ✅ Protection CSRF
- ✅ Hashage bcrypt des mots de passe
- ✅ JWT avec refresh tokens
- ✅ Logs d'audit complets
- ✅ Modération obligatoire avant publication

## 📈 Performance

- ✅ Images optimisées avec Sharp (compression WebP)
- ✅ Lazy loading des images
- ✅ Pagination côté serveur
- ✅ Index DB sur colonnes critiques
- ✅ Cache Redis (si configuré)
- ✅ SSR/SSG avec Next.js

## 🧪 Commandes Utiles

### Backend

\`\`\`bash
# Générer le client Prisma
docker-compose exec backend npx prisma generate

# Créer une migration
docker-compose exec backend npx prisma migrate dev --name migration_name

# Lancer le seed
docker-compose exec backend npm run prisma:seed

# Ouvrir Prisma Studio
docker-compose exec backend npx prisma studio

# Voir les logs
docker-compose logs -f backend
\`\`\`

### Frontend

\`\`\`bash
# Voir les logs
docker-compose logs -f frontend

# Build de production
cd frontend && npm run build
\`\`\`

### Docker

\`\`\`bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer volumes (⚠️ efface la DB)
docker-compose down -v

# Reconstruire les images
docker-compose build

# Redémarrer un service
docker-compose restart backend
\`\`\`

## 📝 API Documentation

### Endpoints Principaux

#### Authentification
- \`POST /api/auth/register\` - Inscription
- \`POST /api/auth/login\` - Connexion
- \`POST /api/auth/refresh\` - Rafraîchir le token
- \`POST /api/auth/logout\` - Déconnexion

#### Annonces
- \`GET /api/listings\` - Liste des annonces (avec filtres)
- \`GET /api/listings/:id\` - Détail d'une annonce
- \`POST /api/listings\` - Créer une annonce (auth)
- \`PATCH /api/listings/:id\` - Modifier une annonce (auth)
- \`POST /api/listings/:id/mark-sold\` - Marquer vendu (auth)
- \`DELETE /api/listings/:id\` - Supprimer (auth)

#### Modération (Admin)
- \`GET /api/admin/moderation/pending\` - File d'attente
- \`POST /api/admin/moderation/:id/approve\` - Approuver
- \`POST /api/admin/moderation/:id/reject\` - Refuser
- \`POST /api/admin/moderation/bulk-approve\` - Approbation en masse

#### Statistiques (Admin)
- \`GET /api/admin/stats\` - Statistiques globales
- \`GET /api/admin/audit-logs\` - Logs de traçabilité

#### Messages
- \`GET /api/messages/threads\` - Liste des conversations
- \`POST /api/messages/threads\` - Créer une conversation
- \`POST /api/messages/threads/:id/messages\` - Envoyer un message

#### Boosts
- \`GET /api/boosts/products\` - Liste des produits
- \`POST /api/boosts/purchase\` - Acheter un boost

## 🐛 Dépannage

### Le backend ne démarre pas

\`\`\`bash
# Vérifier les logs
docker-compose logs backend

# Régénérer le client Prisma
docker-compose exec backend npx prisma generate
\`\`\`

### Erreur de connexion à la DB

\`\`\`bash
# Vérifier que PostgreSQL est prêt
docker-compose ps

# Relancer les migrations
docker-compose exec backend npx prisma migrate dev
\`\`\`

### Le frontend affiche des erreurs

\`\`\`bash
# Vérifier que le backend est accessible
curl http://localhost:3001/api

# Vérifier les variables d'env
# NEXT_PUBLIC_API_URL doit pointer vers http://localhost:3001/api
\`\`\`

## 🚀 Déploiement en Production

### Variables d'Environnement à Modifier

\`\`\`env
# Backend
NODE_ENV=production
DATABASE_URL=<votre-db-production>
JWT_SECRET=<secret-fort-et-aleatoire>
JWT_REFRESH_SECRET=<autre-secret-fort>

# SMTP pour emails réels
SMTP_HOST=<votre-smtp>
SMTP_PORT=587
SMTP_USER=<user>
SMTP_PASS=<pass>

# Frontend
NEXT_PUBLIC_API_URL=https://votre-api.com/api
\`\`\`

### Checklist de Production

- [ ] Changer les secrets JWT
- [ ] Configurer un vrai serveur SMTP
- [ ] Activer HTTPS
- [ ] Configurer un storage S3/Wasabi pour les images
- [ ] Mettre en place un CDN
- [ ] Configurer le monitoring
- [ ] Mettre en place les sauvegardes DB
- [ ] Configurer les paiements réels (Orange Money, MTN MoMo, Wave)

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Support

Pour toute question ou problème :
- 📧 Email : contact@annoncesautoci.com
- 💬 WhatsApp : +225 07 00 00 00 00

---

**Fait avec ❤️ pour la Côte d'Ivoire** 🇨🇮





