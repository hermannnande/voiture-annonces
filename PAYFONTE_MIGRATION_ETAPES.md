# 🚀 Migration vers Payfonte - Étapes à Suivre

## ✅ Code déployé sur GitHub

La migration de **Moneroo vers Payfonte** est terminée ! Le code a été poussé sur GitHub et Railway va redéployer automatiquement.

---

## 🔧 CE QUE VOUS DEVEZ FAIRE MAINTENANT

### Étape 1 : Configurer les variables sur Railway (OBLIGATOIRE)

1. **Allez sur Railway** → Votre projet backend → **Variables**

2. **Supprimez les anciennes variables Moneroo** (optionnel) :
   - `MONEROO_API_KEY` ❌
   - `MONEROO_WEBHOOK_SECRET` ❌

3. **Ajoutez les nouvelles variables Payfonte** :

```env
PAYFONTE_CLIENT_ID=obrille
PAYFONTE_CLIENT_SECRET=live_9f5277a5321bc90eb182aabc135789ece5ac903fd52475ca00
```

4. **Railway va redéployer automatiquement** après l'ajout des variables ✅

---

### Étape 2 : Vérifier le déploiement

1. Allez sur **Railway** → **Deployments**
2. Attendez que le déploiement soit **"Active"** (cercle vert)
3. Cliquez sur **View Logs**
4. Cherchez :
   ```
   ✅ Payfonte configuré avec succès - Paiement automatique activé 🚀
   📌 Client ID: obrille
   📌 Environment: PRODUCTION
   📌 API URL: https://api.payfonte.com/payments/v1
   ```

---

### Étape 3 : TESTER ! 🧪

1. Allez sur **https://www.annonceauto.ci**
2. Connectez-vous avec votre compte
3. **Mon Wallet** → **Acheter des crédits**
4. Cliquez sur **"Pack Starter (5 crédits - 500 FCFA)"**
5. Vous serez redirigé vers la page de paiement **Payfonte**
6. **Choisissez un moyen de paiement** :
   - 📱 Mobile Money (MTN, Orange, Moov, Wave)
   - 💳 Carte bancaire
   - Etc.
7. **Effectuez le paiement**
8. Vous serez redirigé automatiquement vers le résultat
9. **Vérifiez que vos 5 crédits sont bien ajoutés** ✅

---

## 🔍 Vérifier les logs après le test

Dans les logs Railway, vous devriez voir :

```
🔄 Initialisation paiement Payfonte... { amount: 500, credits: 5, reference: 'CREDIT_xxx_1733137200000' }
✅ Paiement Payfonte créé: 644ebe614c2604002fac9d13
🔗 URL de paiement: https://l.6bd.co/m_xxx
📝 Référence: CREDIT_xxx_1733137200000
```

Après paiement :

```
🔄 Callback Payfonte reçu: { reference: 'CREDIT_xxx_1733137200000', status: 'success' }
✅ Statut vérifié auprès de Payfonte: success
📥 Webhook Payfonte reçu: {...}
✅ Paiement Payfonte réussi - 5 crédits ajoutés à votre@email.com
```

---

## 📊 Différences Moneroo vs Payfonte

| Aspect | Moneroo | Payfonte |
|--------|---------|----------|
| **Credentials** | Une clé API | client-id + client-secret |
| **Référence** | ID généré par Moneroo | Référence générée par nous |
| **Callback** | `monerooPaymentId` + `status` | `reference` + `status` |
| **Webhook** | Signature HMAC-SHA256 | Pas de signature |
| **Environnement** | Détecté par URL | Détecté par préfixe `live_` |

---

## 🎯 Flow Payfonte (résumé)

```
1. Client clique "Acheter des crédits"
   ↓
2. Frontend → Backend (/api/payments/initialize-credits)
   ↓
3. Backend → Payfonte (créer checkout)
   ↓
4. Payfonte → Backend (retourner shortURL)
   ↓
5. Backend → Frontend (retourner checkoutUrl)
   ↓
6. Frontend redirige vers checkoutUrl
   ↓
7. Client paie sur Payfonte
   ↓
8. Payfonte → Backend (/api/payments/payfonte/callback)
   ↓
9. Backend vérifie auprès de Payfonte
   ↓
10. Backend crédite le wallet (+5 crédits)
    ↓
11. Backend → Frontend (page résultat)
    ↓
12. ✅ Client voit ses crédits !
```

En parallèle :
```
Payfonte → Backend (/api/payments/webhook/payfonte)
Backend traite le webhook (backup)
```

---

## 🆘 Dépannage

### ❌ "Le système de paiement automatique n'est pas configuré"
**Solution** :
1. Vérifiez que `PAYFONTE_CLIENT_ID` et `PAYFONTE_CLIENT_SECRET` sont bien sur Railway
2. Redéployez manuellement si nécessaire
3. Vérifiez les logs

### ❌ Erreur lors de l'initialisation du paiement
**Solution** :
1. Regardez les logs Railway pour voir l'erreur exacte
2. Vérifiez que les credentials Payfonte sont corrects
3. Vérifiez que le compte Payfonte est actif

### ❌ "Erreur lors de la création du paiement"
**Solution** :
1. Vérifiez les logs Railway après avoir cliqué sur "Acheter"
2. Cherchez `❌ Erreur Payfonte:` et envoyez-moi l'erreur complète

### ❌ Les crédits ne sont pas ajoutés
**Solution** :
1. Vérifiez les logs Railway pour voir si le callback/webhook a été reçu
2. Cherchez `🔄 Callback Payfonte reçu` et `📥 Webhook Payfonte reçu`
3. Vérifiez le statut de la transaction en base de données

---

## 📝 Checklist finale

- [ ] Variables `PAYFONTE_CLIENT_ID` et `PAYFONTE_CLIENT_SECRET` ajoutées sur Railway
- [ ] Railway a redéployé automatiquement
- [ ] Logs Railway montrent "✅ Payfonte configuré avec succès"
- [ ] Logs montrent "Environment: PRODUCTION"
- [ ] Test d'achat de 5 crédits réussi
- [ ] Redirection vers Payfonte fonctionnelle
- [ ] Paiement effectué avec succès
- [ ] Crédits bien ajoutés au wallet
- [ ] Callback et webhook reçus dans les logs

---

## 🎉 Avantages de Payfonte

✅ **Plus simple** : Pas de gestion de signature webhook complexe
✅ **Plus flexible** : Références personnalisables
✅ **Bien documenté** : API claire et exemples
✅ **Multi-moyens** : MTN, Orange, Moov, Wave, cartes, etc.
✅ **Production ready** : Votre secret `live_` active automatiquement la prod

---

## 🚀 Prochaines étapes

1. ✅ **Ajoutez les variables sur Railway** (2 minutes)
2. ✅ **Attendez le redéploiement** (1-2 minutes)
3. ✅ **Testez un achat de crédits** (5 minutes)
4. ✅ **Vérifiez que tout fonctionne** ✨

---

**⏳ Allez sur Railway, ajoutez les variables Payfonte, et testez ! 🎯**

