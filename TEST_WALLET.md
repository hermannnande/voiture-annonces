# 🧪 Guide de Test - Système Wallet

## ⚠️ Instructions Importantes

**Si votre compte se déconnecte tout seul** : C'est souvent dû à un problème de token JWT expiré. Suivez ces étapes :

1. **Déconnectez-vous complètement** : Cliquez sur "Déconnexion" dans le menu
2. **Fermez tous les onglets** du site
3. **Reconnectez-vous** avec vos identifiants

---

## 🔑 Comptes de Test

### Vendeur
```
URL: http://localhost:3000/auth/login
Email: vendeur1@gmail.com
Mot de passe: seller123
```

### Admin
```
URL: http://localhost:3000/auth/login
Email: admin@voiture.com
Mot de passe: admin123
```

---

## ✅ Tests à Effectuer

### Test 1️⃣ : Connexion Vendeur

1. Allez sur http://localhost:3000/auth/login
2. Connectez-vous avec `vendeur1@gmail.com` / `seller123`
3. Vous devez être redirigé vers le dashboard
4. ✅ Vous devriez voir **5 cartes** maintenant :
   - Nouvelle annonce
   - Mes annonces
   - Messages
   - Booster
   - **Mon Wallet** (NOUVEAU ✨)

### Test 2️⃣ : Page Mon Wallet (Vendeur)

1. Depuis le dashboard, cliquez sur la carte **"Mon Wallet"** (jaune avec icône portefeuille)
2. OU allez directement sur : http://localhost:3000/dashboard/wallet
3. ✅ Vous devriez voir :
   - **Solde : 100 crédits** (grand badge vert)
   - Bouton "💳 Acheter des crédits"
   - Section "Historique des transactions" (vide pour l'instant)

### Test 3️⃣ : Modal Achat de Crédits

1. Sur la page wallet, cliquez sur **"💳 Acheter des crédits"**
2. ✅ Un modal doit s'ouvrir avec :
   - Titre "Acheter des Crédits"
   - Champ "Montant souhaité (crédits)"
   - Liste des moyens de paiement (Orange, Wave, MTN, Moov)
   - Bouton vert "📱 Contacter via WhatsApp"
   - Bouton "Fermer"

### Test 4️⃣ : WhatsApp Contact

1. Dans le modal, entrez `50` dans le champ montant
2. Cliquez sur **"📱 Contacter via WhatsApp"**
3. ✅ WhatsApp doit s'ouvrir avec un message pré-rempli :
   ```
   🪙 DEMANDE D'ACHAT DE CRÉDITS

   Je souhaite acheter 50 crédits pour booster mes annonces.

   Merci de me recontacter pour organiser le paiement.
   ```
4. ✅ Le numéro doit être : **+225 07 78 03 00 75**

### Test 5️⃣ : Connexion Admin

1. **Déconnectez-vous** (important !)
2. Reconnectez-vous avec `admin@voiture.com` / `admin123`
3. Allez sur http://localhost:3000/admin
4. ✅ Vous devriez voir **4 cartes** maintenant (au lieu de 3) :
   - Modération
   - Utilisateurs
   - **Wallets** (NOUVEAU ✨)
   - Logs d'Audit

### Test 6️⃣ : Page Gestion Wallets (Admin)

1. Depuis le dashboard admin, cliquez sur la carte **"Wallets"** (jaune)
2. OU allez directement sur : http://localhost:3000/admin/wallets
3. ✅ Vous devriez voir :
   - Titre "Gestion des Wallets Vendeurs"
   - Barre de recherche
   - **Tableau avec 2 wallets** :
     - vendeur1@gmail.com : **100 crédits**
     - vendeur2@gmail.com : **50 crédits**
   - Colonnes : Avatar, Vendeur, Email, Solde, Transactions, Actions
   - Boutons : **Créditer** (vert) et **Débiter** (rouge)

### Test 7️⃣ : Créditer un Wallet (Admin)

1. Sur la page /admin/wallets, trouvez le vendeur `vendeur1@gmail.com`
2. Cliquez sur le bouton vert **"Créditer"**
3. ✅ Un modal doit s'ouvrir avec :
   - Titre "Créditer le Wallet de [Nom]"
   - Champ "Montant (crédits) *"
   - Champ "Motif *"
4. Entrez :
   - Montant : `100`
   - Motif : `Recharge suite paiement Orange Money 10 000 FCFA`
5. Cliquez sur **"Créditer le wallet"**
6. ✅ Vous devriez voir :
   - Message de succès (toast ou alert)
   - Le solde du vendeur passe de **100 à 200 crédits** (rafraîchissement automatique)

### Test 8️⃣ : Vérifier le Crédit (Vendeur)

1. **Déconnectez-vous** de l'admin
2. Reconnectez-vous en tant que `vendeur1@gmail.com`
3. Allez sur http://localhost:3000/dashboard/wallet
4. ✅ Vous devriez voir :
   - **Solde : 200 crédits** (au lieu de 100)
   - Dans l'historique : **1 nouvelle transaction** :
     - Type : ↑ Crédit (vert)
     - Montant : +100 crédits
     - Motif : "Recharge suite paiement Orange Money 10 000 FCFA"
     - Date : aujourd'hui

### Test 9️⃣ : Acheter un Boost avec Crédits

1. Toujours connecté comme vendeur1
2. Allez sur http://localhost:3000/dashboard/listings
3. Cliquez sur **"Booster"** sur une de vos annonces
4. ✅ Vous devriez voir 3 packs avec **2 options de paiement** :
   - **Payer en crédits** (nouveau)
   - WhatsApp (ancien)
5. Sur le pack "Top de liste 7 jours" (50 crédits) :
   - Cliquez sur **"Acheter en crédits"**
   - Confirmez l'achat
6. ✅ Résultats attendus :
   - Message de succès
   - Redirection vers /dashboard/boosts
   - Solde wallet passe de **200 à 150 crédits**

### Test 🔟 : Vérifier l'Historique après Achat

1. Retournez sur http://localhost:3000/dashboard/wallet
2. ✅ Vous devriez voir :
   - **Solde : 150 crédits**
   - Dans l'historique : **2 transactions** :
     - ↑ Crédit +100 (par admin)
     - ↓ Débit -50 (achat pack "Top de liste 7 jours")

---

## 🚨 Problèmes Courants

### Problème : "Mon compte se déconnecte tout seul"

**Cause** : Token JWT expiré ou invalide

**Solution** :
1. Déconnectez-vous complètement
2. Fermez tous les onglets
3. Videz le cache du navigateur (Ctrl + Shift + Delete)
4. Reconnectez-vous
5. Si le problème persiste, vérifiez que le backend est bien démarré :
   ```bash
   docker-compose logs backend --tail=20
   ```

### Problème : "Erreur 401 Unauthorized"

**Cause** : Tentative d'accès à une route protégée sans être connecté

**Solution** :
1. Assurez-vous d'être bien connecté
2. Vérifiez que vous voyez votre nom dans le header (en haut à droite)
3. Si non, reconnectez-vous

### Problème : "Wallet non trouvé"

**Cause** : Le wallet n'a pas été créé pour cet utilisateur

**Solution** :
Le wallet est créé automatiquement lors du premier accès. Si ça ne fonctionne pas :
```bash
# Exécuter le seed pour créer les wallets
docker-compose exec backend npm run prisma:seed
```

### Problème : "Les pages wallet ne s'affichent pas"

**Cause** : Frontend pas à jour

**Solution** :
```bash
# Redémarrer le frontend
docker-compose restart frontend

# Attendre 10 secondes, puis vérifier
docker-compose logs frontend --tail=20
```

### Problème : "Cannot GET /api/wallet/me"

**Cause** : Backend pas à jour ou module Wallet non importé

**Solution** :
```bash
# Vérifier que le backend fonctionne
docker-compose logs backend --tail=30

# Redémarrer le backend si nécessaire
docker-compose restart backend
```

---

## 🔧 Commandes Utiles

### Vérifier les Services

```bash
# Statut de tous les services
docker-compose ps

# Logs backend
docker-compose logs backend --tail=50 --follow

# Logs frontend
docker-compose logs frontend --tail=50 --follow

# Logs base de données
docker-compose logs db --tail=20
```

### Accéder à Prisma Studio

```bash
# Ouvrir Prisma Studio (interface graphique pour la BDD)
docker-compose exec backend npx prisma studio

# Accessible sur http://localhost:5555
```

**Dans Prisma Studio, vous pouvez** :
- Voir tous les wallets
- Voir toutes les transactions
- Modifier manuellement les soldes (pour test)
- Vérifier que les données sont bien enregistrées

### Réinitialiser les Données de Test

```bash
# Supprimer et recréer la base de données
docker-compose exec backend npx prisma migrate reset

# Puis re-seed
docker-compose exec backend npm run prisma:seed
```

⚠️ **Attention** : Cela supprime TOUTES les données !

---

## 📊 Checklist Complète

- [ ] Connexion vendeur fonctionne
- [ ] Carte "Mon Wallet" visible sur dashboard vendeur
- [ ] Page /dashboard/wallet accessible
- [ ] Solde affiché correctement (100 crédits)
- [ ] Bouton "Acheter des crédits" ouvre modal
- [ ] Modal contient champ montant + WhatsApp
- [ ] WhatsApp s'ouvre avec bon message et numéro
- [ ] Connexion admin fonctionne
- [ ] Carte "Wallets" visible sur dashboard admin
- [ ] Page /admin/wallets accessible
- [ ] Liste des wallets affichée (2 vendeurs)
- [ ] Bouton "Créditer" ouvre modal
- [ ] Crédit de 100 crédits fonctionne
- [ ] Solde mis à jour immédiatement
- [ ] Vendeur voit le crédit dans son historique
- [ ] Achat de boost avec crédits fonctionne
- [ ] Solde débité après achat
- [ ] Historique complet affiché

---

## 🎯 URLs de Test Rapide

### Vendeur
- Login : http://localhost:3000/auth/login
- Dashboard : http://localhost:3000/dashboard
- **Mon Wallet** : http://localhost:3000/dashboard/wallet
- Mes Annonces : http://localhost:3000/dashboard/listings
- Booster : http://localhost:3000/dashboard/boosts

### Admin
- Login : http://localhost:3000/auth/login
- Dashboard Admin : http://localhost:3000/admin
- **Gestion Wallets** : http://localhost:3000/admin/wallets
- Utilisateurs : http://localhost:3000/admin/users
- Audit Logs : http://localhost:3000/admin/audit-logs

### Backend API (Test Direct)
- GET http://localhost:3001/api/wallet/me (nécessite token)
- GET http://localhost:3001/api/wallet/admin/all (admin seulement)

---

## ✅ Résultat Attendu

Après tous ces tests, vous devriez avoir :

1. **2 wallets créés** (vendeur1 et vendeur2)
2. **Vendeur1 avec 150 crédits** (100 initial + 100 crédité - 50 dépensé)
3. **1 boost actif** sur une annonce de vendeur1
4. **Historique complet** visible par vendeur et admin
5. **Traçabilité** : tous les événements dans audit_logs

---

## 📞 Support

Si vous rencontrez toujours des problèmes après avoir suivi ce guide :

1. Vérifiez les logs : `docker-compose logs backend frontend --tail=100`
2. Vérifiez Prisma Studio : http://localhost:5555
3. Consultez la documentation complète : `WALLET_SYSTEM.md`

**Contact Admin WhatsApp** : +225 07 78 03 00 75

---

**Bonne chance avec vos tests ! 🚀**





