# ⚡ Démarrage Rapide - Système Wallet

## 🎯 Testez le Système en 5 Minutes

### 1️⃣ Connexion Vendeur

```
URL: http://localhost:3000/auth/login
Email: vendeur1@gmail.com
Mot de passe: seller123
```

### 2️⃣ Voir Mon Wallet

**Accès**: http://localhost:3000/dashboard/wallet

Vous verrez :
- ✅ **Solde**: 100 crédits (créés par le seed)
- ✅ Bouton "Acheter des crédits"
- ✅ Historique vide (pour l'instant)

### 3️⃣ Simuler un Achat de Crédits

1. Cliquer sur "Acheter des crédits"
2. Entrer "50" comme montant souhaité
3. Cliquer "Contacter via WhatsApp"
4. WhatsApp s'ouvre avec message pré-rempli ✅

### 4️⃣ Acheter un Boost avec Crédits

1. Aller sur http://localhost:3000/dashboard/listings
2. Cliquer "Booster" sur une annonce
3. Voir les 3 packs avec **prix en crédits**:
   - Top de liste 7j : **50 crédits**
   - Priorité recherche 14j : **90 crédits**
   - Home Premium 7j : **120 crédits**
4. Cliquer "Acheter en crédits" (pas WhatsApp)
5. Confirmer l'achat
6. ✅ **Annonce boostée instantanément !**
7. Retour sur wallet : Solde = 50 crédits (100 - 50)
8. Historique montre la transaction

---

### 5️⃣ Test Admin - Créditer un Wallet

**Connexion Admin**:
```
URL: http://localhost:3000/auth/login
Email: admin@voiture.com
Mot de passe: admin123
```

**Créditer**:
1. Aller sur http://localhost:3000/admin/wallets
2. Chercher "vendeur1" ou voir liste complète
3. Cliquer bouton vert "Créditer"
4. Entrer:
   - Montant: **100**
   - Motif: "Recharge suite paiement Orange Money - 10 000 FCFA"
5. Valider
6. ✅ **Wallet crédité instantanément !**

**Vérification**:
1. Se déconnecter
2. Se reconnecter comme vendeur1
3. Aller sur wallet
4. Solde = 150 crédits (50 + 100) ✅
5. Historique montre :
   - ↓ Débit 50 crédits (achat boost)
   - ↑ Crédit 100 crédits (admin)

---

## 📋 Checklist de Test Complet

### Vendeur

- [ ] Voir mon wallet et solde initial (100 crédits)
- [ ] Cliquer "Acheter des crédits" → Modal s'ouvre
- [ ] Cliquer WhatsApp → S'ouvre avec message
- [ ] Acheter un boost de 50 crédits
- [ ] Vérifier solde devient 50
- [ ] Voir l'historique avec la transaction
- [ ] Vérifier annonce a badge "Sponsorisé"

### Admin

- [ ] Voir liste des wallets
- [ ] Chercher un vendeur par nom/email
- [ ] Créditer 100 crédits avec motif
- [ ] Vérifier le crédit apparaît instantanément
- [ ] Débiter 10 crédits (pour test correction)
- [ ] Voir toutes les transactions

---

## 🚨 Points Clés

### ✅ Fonctionnalités Actives

1. **Achat de crédits**: Validation manuelle via WhatsApp
2. **Achat de boost**: Automatique avec débit instant
3. **Crédit admin**: Instantané après paiement reçu
4. **Historique**: Complet et traçable
5. **Solde**: Mis à jour en temps réel

### ⚠️ Important

- Le **solde ne peut jamais être négatif**
- Les **transactions sont atomiques** (tout ou rien)
- Chaque action est **tracée dans l'audit log**
- L'admin doit **toujours indiquer un motif**

---

## 💡 Cas d'Usage Réels

### Scénario 1: Nouveau Vendeur

```
1. Vendeur s'inscrit
2. Wallet créé automatiquement (solde = 0)
3. Vendeur veut booster → Solde insuffisant
4. Vendeur clique "Acheter des crédits"
5. WhatsApp s'ouvre → Vendeur contacte admin
6. Vendeur paie 10 000 FCFA via Orange Money
7. Vendeur envoie capture d'écran
8. Admin crédite 100 crédits
9. Vendeur achète pack 50 crédits
10. Annonce boostée ✅
```

### Scénario 2: Vendeur Régulier

```
1. Vendeur a 30 crédits restants
2. Vendeur veut pack Premium (120 crédits)
3. Solde insuffisant → Message clair
4. Vendeur achète 100 crédits supplémentaires
5. Admin crédite après paiement
6. Vendeur a maintenant 130 crédits
7. Vendeur achète pack 120 crédits
8. Reste 10 crédits pour prochain boost
```

### Scénario 3: Admin Reçoit Paiement

```
1. Vendeur envoie capture Orange Money
2. Admin vérifie réception 15 000 FCFA
3. Admin va sur /admin/wallets
4. Admin cherche le vendeur
5. Admin clique "Créditer"
6. Admin entre:
   - Montant: 150
   - Motif: "Recharge 15 000 FCFA Orange Money - Transaction #ABC123"
7. Admin valide
8. Vendeur reçoit 150 crédits instantanément ✅
```

---

## 📞 Support

**Admin WhatsApp**: +225 07 78 03 00 75

**Documentation complète**: Voir `WALLET_SYSTEM.md`

---

## 🎉 C'est Prêt !

Le système de Wallet est maintenant **100% opérationnel** et prêt pour la production.

**Testez dès maintenant** avec les comptes ci-dessus ! 🚀





