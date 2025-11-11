# 💰 Système de Wallet de Crédits - Documentation Complète

## ✅ Implémentation Terminée

Le système de Wallet de crédits est maintenant **100% opérationnel** avec validation manuelle via WhatsApp.

---

## 📊 Architecture du Système

### Base de Données (Prisma)

#### 1. Table `wallets`
```prisma
model Wallet {
  id             String       @id @default(uuid())
  userId         String       @unique
  balanceCredits BigInt       @default(0)  // Solde en crédits
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  
  user           User
  transactions   WalletTransaction[]
}
```

#### 2. Table `wallet_transactions`
```prisma
model WalletTransaction {
  id                String                 @id @default(uuid())
  walletId          String
  type              CREDIT | DEBIT
  amount            BigInt                 // Toujours positif
  reason            String?                // Motif de la transaction
  relatedEntityType String?                // 'PACK' | 'BOOST' | 'ADMIN_OP'
  relatedEntityId   String?
  actorId           String?                // Qui a effectué l'action
  createdAt         DateTime
  
  wallet Wallet
  actor  User?
}
```

#### 3. Table `boost_products` (mise à jour)
```prisma
model BoostProduct {
  id           Int
  name         String
  description  String?
  durationDays Int
  priority     Int
  priceFcfa    BigInt                    // Ancien système (WhatsApp)
  creditsCost  BigInt @default(0)        // NOUVEAU: Prix en crédits
  effect       BoostEffect               // TOP | SEARCH_PRIORITY | HOME_PREMIUM
  isActive     Boolean
  features     Json?
}
```

#### 4. Table `boosts` (mise à jour)
```prisma
model Boost {
  id              String
  listingId       String
  boostProductId  Int
  buyerId         String?                 // NOUVEAU: Qui a acheté
  startsAt        DateTime
  endsAt          DateTime
  paymentStatus   String
  paymentAmount   BigInt
  paymentProvider String?                 // 'credits' | 'whatsapp'
  createdAt       DateTime
}
```

---

## 🔧 Backend - Services & Endpoints

### WalletService

#### Méthodes disponibles :

1. **`getOrCreateWallet(userId)`**
   - Obtient ou crée automatiquement le wallet d'un utilisateur
   
2. **`getWalletTransactions(userId, page, limit)`**
   - Récupère l'historique paginé des transactions

3. **`creditWallet(userId, amount, reason, actorId, ip?)`**
   - Crédite un wallet (Super Admin uniquement)
   - Transaction atomique avec audit log

4. **`debitWallet(userId, amount, reason, actorId, ip?)`**
   - Débite un wallet (Super Admin uniquement, pour corrections)

5. **`debitForBoost(userId, amount, boostProductId, boostId)`**
   - Débite le wallet lors d'un achat de pack boost
   - Transaction atomique

6. **`getAllWallets(page, limit, searchQuery?)`**
   - Liste tous les wallets avec recherche (Admin)

7. **`getWalletByUserId(userId)`**
   - Détails d'un wallet spécifique avec historique (Admin)

### BoostsService

#### Nouvelles méthodes :

1. **`purchaseBoostWithCredits(userId, listingId, boostProductId, ip?)`**
   - Achète un pack boost avec des crédits
   - Vérifie le solde
   - Transaction atomique : créer boost + débiter wallet + mettre à jour annonce
   - Crée un log d'audit

2. **`purchaseBoost(...)` (mise à jour)**
   - Ancien système WhatsApp conservé pour rétrocompatibilité
   - Ajoute maintenant le `buyerId`

### Endpoints API

#### Vendeur

```
GET    /api/wallet/me                              // Mon wallet
GET    /api/wallet/me/transactions?page=1&limit=20 // Mon historique
POST   /api/boosts/purchase-with-credits           // Acheter avec crédits
       body: { listingId, boostProductId }
```

#### Super Admin

```
GET    /api/wallet/admin/all?query=...&page=1       // Tous les wallets
GET    /api/wallet/admin/:userId                    // Wallet spécifique
POST   /api/wallet/admin/:userId/credit             // Créditer
       body: { amount: "100", reason: "..." }
POST   /api/wallet/admin/:userId/debit              // Débiter
       body: { amount: "50", reason: "..." }
```

---

## 🎨 Frontend - Pages Créées

### 1. Page Vendeur - Mon Wallet

**URL**: `http://localhost:3000/dashboard/wallet`

**Fonctionnalités**:
- ✅ Affichage du solde en crédits (grand + design gradient)
- ✅ Bouton "Acheter des crédits" → Modal
- ✅ Modal avec:
  - Champ montant souhaité (informatif)
  - Liste des moyens de paiement (Orange, Wave, MTN, Moov)
  - Bouton WhatsApp pour contacter l'admin
  - Numéro WhatsApp affiché : +225 07 78 03 00 75
- ✅ Historique des transactions (tableau paginé)
  - Type (Crédit ↑ vert / Débit ↓ rouge)
  - Montant avec signe + ou -
  - Motif
  - Date

**Message WhatsApp auto-généré**:
```
🪙 DEMANDE D'ACHAT DE CRÉDITS

Je souhaite acheter [X] crédits pour booster mes annonces.

Merci de me recontacter pour organiser le paiement.
```

### 2. Page Admin - Gestion des Wallets

**URL**: `http://localhost:3000/admin/wallets`

**Fonctionnalités**:
- ✅ Liste de tous les wallets (tableau)
  - Avatar utilisateur
  - Nom et email
  - Solde en crédits
  - Nombre de transactions
- ✅ Barre de recherche (nom ou email)
- ✅ Boutons d'action par wallet:
  - **Créditer** (vert) : Ouvre modal
  - **Débiter** (rouge) : Ouvre modal
- ✅ Modal Créditer/Débiter:
  - Champ montant (en crédits) *
  - Champ motif (obligatoire) *
  - Bouton de validation
  - Transaction atomique + audit log

**Workflow Admin**:
```
1. Vendeur contacte via WhatsApp
2. Admin reçoit le paiement (Orange Money, Wave, MTN, Moov)
3. Admin va sur /admin/wallets
4. Admin cherche le vendeur
5. Admin clique "Créditer"
6. Admin entre le montant et le motif
7. Admin valide
8. Wallet crédité instantanément
9. Vendeur reçoit notification (optionnel, à implémenter)
```

---

## 📦 Packs de Boost Disponibles

| Pack | Durée | Prix FCFA | Prix Crédits | Effect | Priority |
|------|-------|-----------|--------------|--------|----------|
| **Top de liste** | 7 jours | 1 000 | 50 crédits | TOP | 10 |
| **Priorité recherche** | 14 jours | 2 000 | 90 crédits | SEARCH_PRIORITY | 15 |
| **Home Premium** | 7 jours | 5 000 | 120 crédits | HOME_PREMIUM | 20 |

### Effets des Boosts

- **TOP**: Annonce en haut de liste dans les résultats
- **SEARCH_PRIORITY**: Priorité dans l'algorithme de recherche
- **HOME_PREMIUM**: Mise en avant sur la page d'accueil

---

## 🔄 Workflow Complet - Achat de Boost avec Crédits

### Étape 1: Achat de Crédits (Hors ligne)

```
Vendeur → Clic "Acheter des crédits"
       → Saisie montant souhaité
       → Clic "Contacter via WhatsApp"
       → WhatsApp s'ouvre avec message pré-rempli
       → Discussion avec admin
       → Paiement via Mobile Money
       → Envoi de la capture d'écran
       
Admin  → Réception paiement
       → Connexion /admin/wallets
       → Recherche vendeur
       → Clic "Créditer"
       → Saisie montant + motif
       → Validation
       
Vendeur → Son wallet est crédité ✅
```

### Étape 2: Achat d'un Pack Boost (En ligne)

```
Vendeur → Va sur "Mes annonces"
       → Clic "Booster" sur une annonce
       → Choix d'un pack (affiche prix en crédits)
       → Clic "Acheter en crédits"
       → Confirmation
       
Système → Vérifie solde suffisant
       → Transaction atomique:
          1. Crée le boost
          2. Débite le wallet
          3. Crée transaction wallet
          4. Met à jour l'annonce (isSponsored, priority)
          5. Log d'audit
       
Annonce → Boostée immédiatement ✅
       → Badge "Sponsorisé"
       → Priorité dans résultats
       → Visible X jours selon pack
```

---

## 🧪 Données de Test (Seed)

### Comptes Créés

| Email | Mot de passe | Rôle | Solde Initial |
|-------|--------------|------|---------------|
| admin@voiture.com | admin123 | SUPER_ADMIN | - |
| vendeur1@gmail.com | seller123 | SELLER | 100 crédits |
| vendeur2@gmail.com | seller123 | SELLER | 50 crédits |

### Pour Tester

1. **Connexion vendeur**:
   ```
   Email: vendeur1@gmail.com
   Mot de passe: seller123
   ```

2. **Voir mon wallet**:
   - http://localhost:3000/dashboard/wallet
   - Solde: 100 crédits

3. **Acheter un boost**:
   - Aller sur "Mes annonces"
   - Cliquer "Booster"
   - Choisir un pack (ex: 50 crédits)
   - Confirmer
   - Solde devient: 50 crédits

4. **Connexion admin**:
   ```
   Email: admin@voiture.com
   Mot de passe: admin123
   ```

5. **Créditer un wallet**:
   - http://localhost:3000/admin/wallets
   - Chercher "vendeur1"
   - Cliquer "Créditer"
   - Montant: 100
   - Motif: "Recharge suite paiement Orange Money"
   - Valider

---

## 🔒 Sécurité & Traçabilité

### Contrôles Implémentés

1. **Vérifications Solde**:
   - Impossible d'acheter si solde insuffisant
   - Message clair: "Solde insuffisant. Vous avez X crédits, il en faut Y"

2. **Transactions Atomiques**:
   - Tout ou rien : si une étape échoue, tout est annulé
   - Pas de perte de crédits ni de boosts orphelins

3. **Audit Logs**:
   - Chaque crédit/débit enregistré
   - Chaque achat de boost tracé
   - Actor ID (qui a fait quoi)
   - IP address sauvegardée

4. **Rôles & Permissions**:
   - Seul SUPER_ADMIN peut créditer/débiter
   - Vendeur peut seulement voir son wallet et acheter

5. **Validation**:
   - Montants toujours positifs
   - Motif obligatoire pour admin
   - Listing doit appartenir à l'acheteur

### Journal d'Audit

```typescript
// Exemples d'events trackés
WALLET_CREDITED         // Admin crédite un wallet
WALLET_DEBITED          // Admin débite un wallet
BOOST_PURCHASED_WITH_CREDITS  // Vendeur achète un boost
```

---

## 📱 Moyens de Paiement

Pour l'achat de crédits (hors ligne):

- 🧡 **Orange Money**
- 💙 **Wave**
- 💛 **MTN Money**
- 💜 **Moov Money**

**Contact Admin**: +225 07 78 03 00 75 (WhatsApp)

---

## 🚀 Fonctionnalités Prêtes à l'Emploi

### ✅ Implémenté

- [x] Base de données complète (Wallet, WalletTransaction, BoostProduct, Boost)
- [x] Services backend (WalletService, BoostsService)
- [x] Endpoints API (vendeur + admin)
- [x] Page "Mon Wallet" vendeur avec historique
- [x] Page "Gestion Wallets" admin
- [x] Achat de boost avec crédits
- [x] Transactions atomiques
- [x] Audit logs complets
- [x] Validation manuelle via WhatsApp
- [x] Affichage des prix en crédits sur les packs
- [x] Seed avec données de test (wallets + crédits)

### 🔄 À Implémenter (Optionnel)

- [ ] Notifications in-app quand wallet crédité
- [ ] Email de confirmation après crédit
- [ ] Historique des boosts actifs dans page wallet
- [ ] Graphiques d'utilisation des crédits (dashboard vendeur)
- [ ] Export CSV des transactions (admin)
- [ ] Page de détail d'un wallet spécifique (admin)
- [ ] Packs de crédits prédéfinis (ex: 100 crédits = X FCFA)
- [ ] Système de promo/coupons de réduction
- [ ] Passerelle de paiement en ligne (futur)

---

## 🎯 URLs Principales

### Vendeur

| Page | URL |
|------|-----|
| Mon Wallet | http://localhost:3000/dashboard/wallet |
| Mes Annonces | http://localhost:3000/dashboard/listings |
| Booster une annonce | http://localhost:3000/dashboard/listings/[id]/boost |
| Mes Boosts | http://localhost:3000/dashboard/boosts |

### Admin

| Page | URL |
|------|-----|
| Gestion Wallets | http://localhost:3000/admin/wallets |
| Dashboard Admin | http://localhost:3000/admin |
| Gestion Utilisateurs | http://localhost:3000/admin/users |
| Logs d'Audit | http://localhost:3000/admin/audit-logs |

---

## 📊 Statistiques & Monitoring

### Métriques à Suivre

1. **Wallets**:
   - Nombre total de wallets créés
   - Solde moyen
   - Nombre de wallets actifs (solde > 0)

2. **Transactions**:
   - Volume total de crédits ajoutés
   - Volume total de crédits dépensés
   - Nombre de transactions par jour

3. **Boosts**:
   - Packs les plus populaires
   - Taux de conversion (crédits achetés vs dépensés)
   - Revenus générés (estimés)

---

## 🐛 Troubleshooting

### Problème: Wallet non créé

**Solution**: Les wallets sont créés automatiquement au premier accès. Si problème, exécuter:
```bash
docker-compose exec backend npx prisma studio
```
Puis créer manuellement un wallet pour l'utilisateur.

### Problème: Solde insuffisant mais crédits visibles

**Solution**: Vérifier que le type de `balanceCredits` est `BigInt` et que la conversion `toString()` est faite dans l'API.

### Problème: Transaction non enregistrée

**Solution**: Vérifier les logs d'audit:
```bash
docker-compose logs backend | grep WALLET
```

---

## 🎉 Résumé des Accomplissements

✅ **Système complet de Wallet de crédits opérationnel**  
✅ **Validation manuelle via WhatsApp intégrée**  
✅ **3 packs de boost configurés avec prix en crédits**  
✅ **Interface vendeur pour voir solde et acheter crédits**  
✅ **Interface admin pour créditer/débiter les wallets**  
✅ **Transactions atomiques et traçabilité complète**  
✅ **Seed avec données de test (100 et 50 crédits)**  
✅ **Documentation complète**  

---

## 📞 Contact & Support

**Admin WhatsApp**: +225 07 78 03 00 75

**Environnement de test**:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api
- Prisma Studio: http://localhost:5555

---

**Le système est maintenant prêt à être testé et déployé en production !** 🚀





