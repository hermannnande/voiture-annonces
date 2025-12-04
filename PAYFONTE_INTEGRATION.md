# 🚀 Guide Complet d'Intégration Payfonte

## 📋 Vue d'ensemble

**Payfonte** est une solution de paiement qui permet d'accepter plusieurs moyens de paiement en Afrique (Mobile Money, cartes bancaires, etc.) avec des credentials `client-id` + `client-secret`.

## 🔑 Configuration

### 1. Variables d'environnement à ajouter sur Railway

```env
# CREDENTIALS PAYFONTE (OBLIGATOIRE)
PAYFONTE_CLIENT_ID=obrille
PAYFONTE_CLIENT_SECRET=live_9f5277a5321bc90eb182aabc135789ece5ac903fd52475ca00

# URLs (déjà configurées normalement)
BACKEND_URL=https://api.annonceauto.ci/api
FRONTEND_URL=https://www.annonceauto.ci
```

**Note** : Le secret commence par `live_`, donc le système détecte automatiquement l'environnement **PRODUCTION**.

---

## 🔄 Flow de paiement complet

### Étape 1 : Client veut acheter des crédits

Le frontend appelle :
```typescript
POST /api/payments/initialize-credits
Headers: Authorization: Bearer <JWT_TOKEN>
Body: {
  "creditsAmount": 5,
  "packName": "Starter"
}
```

### Étape 2 : Backend initialise le paiement Payfonte

Le backend :
1. ✅ Récupère les infos de l'utilisateur
2. ✅ Calcule le prix en FCFA (ex: 5 crédits = 500 FCFA)
3. ✅ Génère une référence unique : `CREDIT_<userId>_<timestamp>`
4. ✅ Appelle l'API Payfonte `/checkouts` avec :
   ```json
   {
     "reference": "CREDIT_xxx_1733137200000",
     "amount": 500,
     "currency": "XOF",
     "country": "CI",
     "redirectURL": "https://api.annonceauto.ci/api/payments/payfonte/callback",
     "webhook": "https://api.annonceauto.ci/api/payments/webhook/payfonte",
     "user": {
       "email": "user@example.com",
       "phoneNumber": "+2250778030075",
       "name": "Client Nom"
     },
     "narration": "Achat de 5 crédits - Pack Starter"
   }
   ```
5. ✅ Enregistre la transaction en base (status: PENDING)
6. ✅ Retourne le `shortURL` Payfonte au frontend

Réponse :
```json
{
  "purchaseId": "uuid",
  "checkoutUrl": "https://l.6bd.co/m_xxx",
  "payfontePaymentId": "644ebe614c2604002fac9d13",
  "reference": "CREDIT_xxx_1733137200000",
  "amount": 500,
  "creditsAmount": 5
}
```

### Étape 3 : Redirection vers Payfonte

Le frontend redirige le client vers `checkoutUrl` :
```typescript
window.location.href = checkoutUrl;
```

Le client :
- Choisit son moyen de paiement (MTN, Orange, Moov, Wave, etc.)
- Effectue le paiement sur la page sécurisée Payfonte

### Étape 4 : Callback après paiement

Payfonte redirige le client vers :
```
https://api.annonceauto.ci/api/payments/payfonte/callback?reference=CREDIT_xxx_1733137200000&status=success
```

Le backend :
1. ✅ Récupère la `reference` et le `status`
2. ✅ **Vérifie le statut auprès de Payfonte** (sécurité)
3. ✅ Met à jour la transaction en base
4. ✅ **Si succès** : crédite automatiquement le wallet de l'utilisateur
5. ✅ Redirige vers le frontend avec le résultat

Redirection finale :
```
https://www.annonceauto.ci/dashboard/wallet/payment-result?status=success&amount=5&reference=CREDIT_xxx_1733137200000
```

### Étape 5 : Webhook (backup & sécurité)

En parallèle du callback, Payfonte envoie aussi un webhook :
```
POST https://api.annonceauto.ci/api/payments/webhook/payfonte
Headers: Content-Type: application/json
Body: {
  "reference": "CREDIT_xxx_1733137200000",
  "status": "success",
  "amount": 500,
  "currency": "XOF",
  ...
}
```

Le backend :
1. ✅ Traite le paiement de la même manière que le callback
2. ✅ Ignore si déjà traité (idempotence)

---

## 🛡️ Sécurité

### ✅ Credentials jamais exposés au frontend
- `PAYFONTE_CLIENT_ID` et `PAYFONTE_CLIENT_SECRET` restent **toujours côté backend**
- Le frontend ne connaît que le `checkoutUrl` généré

### ✅ Vérification du statut côté serveur
- On ne fait **jamais confiance** au statut envoyé par le client
- On appelle l'API Payfonte pour vérifier le statut réel

### ✅ Idempotence
- Si un paiement est déjà `COMPLETED`, on ignore les webhooks suivants
- Évite les doubles créditations

---

## 📊 Structure de la base de données

### Table `credit_purchases`

```prisma
model CreditPurchase {
  id                 String    @id @default(uuid())
  userId             String
  monerooPaymentId   String    @unique // On stocke la référence Payfonte ici
  amount             BigInt    // Montant en FCFA
  creditsAmount      BigInt    // Nombre de crédits
  currency           String    @default("XOF")
  status             String    @default("PENDING") // PENDING, COMPLETED, FAILED, CANCELLED
  customerEmail      String?
  customerPhone      String?
  returnUrl          String?
  checkoutUrl        String?
  metadata           Json?     // Contient payfonte_payment_id, payfonte_reference, etc.
  createdAt          DateTime  @default(now())
  completedAt        DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("credit_purchases")
}
```

**Note** : On réutilise le champ `monerooPaymentId` pour stocker la référence Payfonte (pas besoin de migration).

---

## 🧪 Tests

### Test 1 : Achat de crédits
1. Connectez-vous sur https://www.annonceauto.ci
2. Allez dans **Mon Wallet**
3. Cliquez sur **Pack Starter (5 crédits - 500 FCFA)**
4. Vous serez redirigé vers Payfonte
5. Choisissez un moyen de paiement
6. Complétez le paiement
7. Vous serez redirigé vers la page de résultat
8. Vérifiez que les crédits sont bien ajoutés

### Test 2 : Webhook
1. Effectuez un paiement
2. Vérifiez les logs Railway :
   ```
   📥 Webhook Payfonte reçu: {...}
   ✅ Paiement Payfonte réussi - 5 crédits ajoutés à user@example.com
   ```

### Test 3 : Annulation
1. Initiez un paiement
2. **Annulez** sur la page Payfonte
3. Vérifiez que le statut est bien `CANCELLED` en base

---

## 🎯 Endpoints API

### Backend

| Méthode | URL | Description | Auth |
|---------|-----|-------------|------|
| POST | `/api/payments/initialize-credits` | Initialiser un paiement | JWT ✅ |
| GET | `/api/payments/payfonte/callback` | Callback après paiement | Public |
| POST | `/api/payments/webhook/payfonte` | Webhook Payfonte | Public |
| GET | `/api/payments/verify/:reference` | Vérifier un paiement | JWT ✅ |
| GET | `/api/payments/my-purchases` | Historique des achats | JWT ✅ |

### Frontend

| Page | URL | Description |
|------|-----|-------------|
| Wallet | `/dashboard/wallet` | Acheter des crédits |
| Résultat | `/dashboard/wallet/payment-result` | Afficher le résultat du paiement |

---

## 🔧 Détection automatique de l'environnement

Le système détecte automatiquement l'environnement selon le secret :

```typescript
const isProduction = this.payfonteClientSecret.startsWith('live_');

this.payfonteApiUrl = isProduction
  ? 'https://api.payfonte.com/payments/v1'           // PRODUCTION
  : 'https://sandbox-api.payfonte.com/payments/v1';  // SANDBOX
```

Avec votre secret `live_9f5277a5321bc90eb182aabc135789ece5ac903fd52475ca00`, le système utilise **automatiquement l'API de PRODUCTION**.

---

## 📚 Documentation Payfonte

- **Getting Started** : https://docs.payfonte.com/guides/introductions/getting-started
- **Authorization** : https://docs.payfonte.com/guides/introductions/authorization
- **Standard Checkout** : https://docs.payfonte.com/guides/collections/standard
- **Verify Payment** : https://docs.payfonte.com/guides/collections/verify-payment

---

## ✅ Checklist de déploiement

- [ ] `PAYFONTE_CLIENT_ID` ajoutée sur Railway
- [ ] `PAYFONTE_CLIENT_SECRET` ajoutée sur Railway
- [ ] Railway a redéployé automatiquement
- [ ] Logs Railway montrent "✅ Payfonte configuré avec succès"
- [ ] Test d'achat de crédits réussi
- [ ] Crédits bien ajoutés au wallet
- [ ] Webhook reçu et traité correctement
- [ ] Annulation de paiement testée

---

## 🆘 Dépannage

### ❌ "Le système de paiement automatique n'est pas configuré"
→ Ajoutez `PAYFONTE_CLIENT_ID` et `PAYFONTE_CLIENT_SECRET` sur Railway et redéployez

### ❌ "Erreur lors de l'initialisation du paiement"
→ Vérifiez les logs Railway pour voir la réponse exacte de Payfonte
→ Vérifiez que les credentials sont corrects

### ❌ Les crédits ne sont pas ajoutés après paiement
→ Vérifiez les logs pour voir si le webhook/callback a été reçu
→ Appelez `/api/payments/check-and-complete/:purchaseId` manuellement

---

## 🎉 Avantages de Payfonte

- ✅ Très simple à intégrer
- ✅ Supporte de nombreux moyens de paiement
- ✅ Callback ET webhook pour double sécurité
- ✅ API claire et bien documentée
- ✅ Détection auto de l'environnement (sandbox/production)
- ✅ Références personnalisables pour traçabilité

---

**🚀 Intégration Payfonte complète et sécurisée !**



