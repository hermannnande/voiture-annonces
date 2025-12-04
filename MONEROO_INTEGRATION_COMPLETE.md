# 🚀 Guide Complet d'Intégration Moneroo

## 📋 Vue d'ensemble

**Moneroo** est un agrégateur de paiement qui permet d'accepter plusieurs moyens de paiement en Afrique (Mobile Money, cartes bancaires, etc.) avec **une seule clé API**.

## 🔑 Configuration

### 1. Variables d'environnement à ajouter sur Railway

```env
# CLÉ SECRÈTE MONEROO (OBLIGATOIRE)
MONEROO_API_KEY=pvk_z7d03z|01KBF6GA56TN9VM5PMFHMR932Q

# SECRET WEBHOOK MONEROO (OPTIONNEL mais RECOMMANDÉ)
# À récupérer dans le dashboard Moneroo > Développeur > Webhooks
MONEROO_WEBHOOK_SECRET=votre_secret_webhook_ici

# URL DU BACKEND (pour construire les URLs de callback)
BACKEND_URL=https://api.annonceauto.ci/api
```

### 2. Configuration du webhook sur Moneroo

1. Allez sur https://dashboard.moneroo.io
2. **Développeur** → **Webhooks**
3. Ajoutez une nouvelle URL de webhook :
   ```
   https://api.annonceauto.ci/api/payments/webhook/moneroo
   ```
4. **Événements à écouter** :
   - ✅ `payment.success` (paiement réussi)
   - ✅ `payment.failed` (paiement échoué)
   - ✅ `payment.cancelled` (paiement annulé)
5. Copiez le **Webhook Signing Secret** et ajoutez-le dans Railway comme `MONEROO_WEBHOOK_SECRET`

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

### Étape 2 : Backend initialise le paiement Moneroo

Le backend :
1. ✅ Récupère les infos de l'utilisateur
2. ✅ Calcule le prix en FCFA (ex: 5 crédits = 500 FCFA)
3. ✅ Appelle l'API Moneroo `/v1/payments/initialize`
4. ✅ Enregistre la transaction en base (status: PENDING)
5. ✅ Retourne le `checkout_url` Moneroo au frontend

Réponse :
```json
{
  "purchaseId": "uuid",
  "checkoutUrl": "https://checkout.moneroo.io/xxx",
  "monerooPaymentId": "xxx",
  "amount": 500,
  "creditsAmount": 5
}
```

### Étape 3 : Redirection vers Moneroo

Le frontend redirige le client vers `checkout_url` :
```typescript
window.location.href = checkoutUrl;
```

Le client :
- Choisit son moyen de paiement (MTN, Orange, Wave, etc.)
- Effectue le paiement sur la page sécurisée Moneroo

### Étape 4 : Callback après paiement

Moneroo redirige le client vers :
```
https://api.annonceauto.ci/api/payments/moneroo/callback?monerooPaymentId=xxx&monerooPaymentStatus=success
```

Le backend :
1. ✅ Récupère le `monerooPaymentId` et le `status`
2. ✅ **Vérifie le statut auprès de Moneroo** (sécurité)
3. ✅ Met à jour la transaction en base
4. ✅ **Si succès** : crédite automatiquement le wallet de l'utilisateur
5. ✅ Redirige vers le frontend avec le résultat

Redirection finale :
```
https://www.annonceauto.ci/dashboard/wallet/payment-result?status=success&amount=5&monerooPaymentId=xxx
```

### Étape 5 : Webhook (backup & sécurité)

En parallèle du callback, Moneroo envoie aussi un webhook :
```
POST https://api.annonceauto.ci/api/payments/webhook/moneroo
Headers: 
  X-Moneroo-Signature: hmac_sha256_signature
Body: {
  "id": "moneroo_payment_id",
  "status": "success",
  "amount": 500,
  "currency": "XOF",
  "metadata": { ... }
}
```

Le backend :
1. ✅ **Vérifie la signature HMAC-SHA256** (sécurité)
2. ✅ Traite le paiement de la même manière que le callback
3. ✅ Ignore si déjà traité (idempotence)

---

## 🛡️ Sécurité

### ✅ Clé API jamais exposée au frontend
- La clé `MONEROO_API_KEY` reste **toujours côté backend**
- Le frontend ne connaît que le `checkout_url` généré

### ✅ Vérification du statut côté serveur
- On ne fait **jamais confiance** au statut envoyé par le client
- On appelle toujours l'API Moneroo pour vérifier le statut réel

### ✅ Signature des webhooks
- Les webhooks sont signés avec HMAC-SHA256
- Le backend vérifie la signature avant de traiter

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
  monerooPaymentId   String    @unique // ID de transaction Moneroo
  amount             BigInt    // Montant en FCFA
  creditsAmount      BigInt    // Nombre de crédits
  currency           String    @default("XOF")
  status             String    @default("PENDING") // PENDING, COMPLETED, FAILED, CANCELLED
  customerEmail      String?
  customerPhone      String?
  returnUrl          String?
  checkoutUrl        String?
  metadata           Json?
  createdAt          DateTime  @default(now())
  completedAt        DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("credit_purchases")
}
```

---

## 🧪 Tests

### Test 1 : Achat de crédits
1. Connectez-vous sur https://www.annonceauto.ci
2. Allez dans **Mon Wallet**
3. Cliquez sur **Pack Starter (5 crédits - 500 FCFA)**
4. Vous serez redirigé vers Moneroo
5. Choisissez un moyen de paiement test
6. Complétez le paiement
7. Vous serez redirigé vers la page de résultat
8. Vérifiez que les crédits sont bien ajoutés

### Test 2 : Webhook
1. Dans le dashboard Moneroo, testez l'envoi d'un webhook
2. Vérifiez les logs Railway :
   ```
   📥 Webhook Moneroo reçu: {...}
   ✅ Paiement Moneroo réussi - 5 crédits ajoutés à user@example.com
   ```

### Test 3 : Annulation
1. Initiez un paiement
2. **Annulez** sur la page Moneroo
3. Vérifiez que le statut est bien `CANCELLED` en base

---

## 🎯 Endpoints API

### Backend

| Méthode | URL | Description | Auth |
|---------|-----|-------------|------|
| POST | `/api/payments/initialize-credits` | Initialiser un paiement | JWT ✅ |
| GET | `/api/payments/moneroo/callback` | Callback après paiement | Public |
| POST | `/api/payments/webhook/moneroo` | Webhook Moneroo | Public |
| GET | `/api/payments/verify/:id` | Vérifier un paiement | JWT ✅ |
| GET | `/api/payments/my-purchases` | Historique des achats | JWT ✅ |

### Frontend

| Page | URL | Description |
|------|-----|-------------|
| Wallet | `/dashboard/wallet` | Acheter des crédits |
| Résultat | `/dashboard/wallet/payment-result` | Afficher le résultat du paiement |

---

## 🔧 Maintenance

### Vérifier les paiements en attente

Si un webhook rate ou un callback échoue, vous pouvez vérifier manuellement :

```typescript
POST /api/payments/check-and-complete/:purchaseId
```

Cela va :
1. Vérifier le statut auprès de Moneroo
2. Créditer le wallet si le paiement a réussi

### Logs à surveiller

```bash
# Railway logs
✅ Moneroo configuré avec succès
🔄 Initialisation paiement Moneroo...
✅ Paiement Moneroo créé: xxx
📥 Webhook Moneroo reçu: {...}
✅ Paiement Moneroo réussi - 5 crédits ajoutés
```

---

## 📚 Documentation Moneroo

- **API Docs** : https://docs.moneroo.io
- **Dashboard** : https://dashboard.moneroo.io
- **Standard Integration** : https://docs.moneroo.io/standard-integration
- **Webhooks** : https://docs.moneroo.io/webhooks

---

## ✅ Checklist de déploiement

- [ ] `MONEROO_API_KEY` ajoutée sur Railway
- [ ] `MONEROO_WEBHOOK_SECRET` ajoutée sur Railway (optionnel)
- [ ] `BACKEND_URL` ajoutée sur Railway
- [ ] URL webhook configurée sur le dashboard Moneroo
- [ ] Test d'achat de crédits réussi
- [ ] Webhook reçu et traité correctement
- [ ] Annulation de paiement testée

---

## 🆘 Dépannage

### ❌ "Le système de paiement automatique n'est pas configuré"
→ Ajoutez `MONEROO_API_KEY` sur Railway et redéployez

### ❌ "Erreur lors de l'initialisation du paiement"
→ Vérifiez les logs Railway pour voir la réponse exacte de Moneroo

### ❌ "Signature webhook invalide"
→ Vérifiez que `MONEROO_WEBHOOK_SECRET` correspond au secret du dashboard

### ❌ Les crédits ne sont pas ajoutés après paiement
→ Vérifiez les logs pour voir si le webhook a été reçu
→ Appelez `/api/payments/check-and-complete/:purchaseId` manuellement

---

**🎉 Intégration Moneroo complète et sécurisée !**



