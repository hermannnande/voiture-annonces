# ⚡ Test Rapide - Système de Boost par Crédits

## 🎯 Test en 3 Minutes !

---

## Test 1 : Voir son Solde de Crédits (30 secondes)

### Connexion
```
Email: vendeur1@gmail.com
Mot de passe: seller123
```

### Accès au Wallet
1. **Option 1** : Cliquer sur votre nom → "Mon Wallet"
2. **Option 2** : http://localhost:3000/dashboard/wallet

### ✅ Résultat Attendu
- Solde visible : **500 crédits**
- Historique des transactions
- Bouton "Acheter des crédits"

---

## Test 2 : Acheter un Boost avec Crédits (1 minute)

### Étapes

1. **Aller sur "Mes Annonces"**
   ```
   http://localhost:3000/dashboard/listings
   ```

2. **Cliquer sur "📈 Booster"** (bouton violet) sur une de vos annonces

3. **Vérifier l'affichage** :
   - ✅ Bandeau bleu en haut : "Solde de crédits disponible : 500 crédits"
   - ✅ Trois packs avec **prix FCFA ET crédits**
   - ✅ Messages verts : "✅ Vous avez assez de crédits"

4. **Cliquer sur "Choisir ce pack"** (Offre 1 - 50 crédits)

5. **Modal de confirmation** :
   - ✅ Deux options : Crédits / WhatsApp
   - ✅ Option "Crédits" sélectionnée (solde suffisant)
   - ✅ Affichage : "Solde: 500 crédits" | "50 crédits"

6. **Cliquer sur "Acheter avec crédits"**

### ✅ Résultat Attendu
- Message : "✅ Boost activé avec succès ! Votre annonce sera épinglée en tête de liste pendant 1 jour(s)."
- Redirection vers `/dashboard/listings`
- **Votre annonce a maintenant un badge "📌 Épinglé"** (jaune-orange, animé)

---

## Test 3 : Vérifier l'Annonce Boostée (1 minute)

### Page Publique

1. **Aller sur la page de toutes les annonces**
   ```
   http://localhost:3000/listings
   ```

2. **Vérifier** :
   - ✅ **Votre annonce boostée est EN PREMIER**
   - ✅ Badge **"📌 Épinglé"** visible (jaune-orange, animé)
   - ✅ Les autres annonces sont en dessous

### Page d'Accueil

1. **Aller sur la page d'accueil**
   ```
   http://localhost:3000
   ```

2. **Vérifier** :
   - ✅ Badge **"📌 Épinglé"** visible sur votre annonce
   - ✅ Badge attractif et animé

---

## Test 4 : Vérifier la Déduction de Crédits (30 secondes)

1. **Retourner sur "Mon Wallet"**
   ```
   http://localhost:3000/dashboard/wallet
   ```

2. **Vérifier** :
   - ✅ Solde : **450 crédits** (500 - 50)
   - ✅ **Nouvelle transaction** dans l'historique :
     - Type : DEBIT
     - Montant : -50 crédits
     - Raison : "Achat du boost [Nom du Pack]"
     - Date et heure

---

## Test 5 : Admin - Créditer un Wallet (30 secondes)

### Connexion Admin
```
Email: admin@voiture.com
Mot de passe: admin123
```

### Créditer un Wallet

1. **Aller sur "Wallets"**
   ```
   http://localhost:3000/admin/wallets
   ```

2. **Trouver un vendeur** (ex: vendeur2)

3. **Cliquer sur "Créditer"**

4. **Remplir le formulaire** :
   - Montant : 200
   - Raison : "Test de crédit"
   - Soumettre

5. **Vérifier** :
   - ✅ Solde mis à jour immédiatement
   - ✅ Message de succès

6. **Se reconnecter en vendeur2** :
   - Email: vendeur2@gmail.com
   - Mot de passe: seller123

7. **Aller sur "Mon Wallet"** :
   - ✅ Solde mis à jour (300 + 200 = 500 crédits)
   - ✅ Transaction visible dans l'historique

---

## 📊 Récapitulatif Rapide

| Test | Durée | URL | Résultat Attendu |
|------|-------|-----|------------------|
| **1. Voir Solde** | 30s | `/dashboard/wallet` | 500 crédits affichés |
| **2. Acheter Boost** | 1min | `/dashboard/listings/[id]/boost` | Boost activé, crédits débités |
| **3. Vérifier Annonce** | 1min | `/listings` | Annonce en premier, badge visible |
| **4. Vérifier Déduction** | 30s | `/dashboard/wallet` | Solde 450 crédits, transaction visible |
| **5. Admin Créditer** | 30s | `/admin/wallets` | Wallet crédité, transaction trackée |

---

## ✅ Checklist Visuelle

### Page de Boost (`/dashboard/listings/[id]/boost`)

- [ ] Bandeau bleu avec solde de crédits (grand, visible)
- [ ] Trois packs affichés
- [ ] Prix en FCFA **ET** en crédits
- [ ] Indicateurs verts/oranges selon le solde
- [ ] Modal avec deux options (Crédits / WhatsApp)
- [ ] Option correcte sélectionnée selon le solde

### Page Listings (`/listings`)

- [ ] Annonces boostées en premier
- [ ] Badge "📌 Épinglé" visible
- [ ] Badge jaune-orange avec animation pulse
- [ ] Badge sur toutes les annonces boostées

### Page Wallet (`/dashboard/wallet`)

- [ ] Solde affiché en grand
- [ ] Historique des transactions
- [ ] Type, montant, raison, date
- [ ] Bouton "Acheter des crédits"

### Page Admin Wallets (`/admin/wallets`)

- [ ] Liste de tous les wallets
- [ ] Soldes visibles
- [ ] Boutons Créditer/Débiter
- [ ] Recherche par vendeur
- [ ] Historique par wallet

---

## 🎉 Si Tous les Tests Passent

**✅ Le système de boost par crédits est 100% fonctionnel !**

Les vendeurs peuvent :
- ✅ Voir leur solde de crédits
- ✅ Acheter des boosts avec crédits
- ✅ Voir leurs annonces épinglées en tête
- ✅ Consulter l'historique de leurs transactions

Les admins peuvent :
- ✅ Créditer/Débiter des wallets
- ✅ Voir tous les wallets et historiques
- ✅ Tracer toutes les opérations

Le public voit :
- ✅ Annonces boostées en premier
- ✅ Badge attractif "📌 Épinglé"
- ✅ Meilleure visibilité pour les annonces boostées

---

## 📞 Comptes de Test

```
┌─────────────────────────────────────────┐
│ Vendeur 1                               │
│ 📧 vendeur1@gmail.com                   │
│ 🔑 seller123                            │
│ 💰 500 crédits                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Vendeur 2                               │
│ 📧 vendeur2@gmail.com                   │
│ 🔑 seller123                            │
│ 💰 300 crédits                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Admin                                   │
│ 📧 admin@voiture.com                    │
│ 🔑 admin123                             │
└─────────────────────────────────────────┘
```

---

## 🚀 Offres de Boost

| Offre | Durée | Prix FCFA | Crédits | Effet |
|-------|-------|-----------|---------|-------|
| **1** | 1 jour | 1 000 | 50 | Épinglé en tête |
| **2** | 3 jours | 2 500 | 125 | Épinglé en tête |
| **3** | 7 jours | 5 000 | 250 | Épinglé en tête |

---

**Bonne utilisation ! 🎉**




