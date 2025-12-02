# 🔐 Configuration FedaPay

## ✅ Variables d'environnement à RENOMMER sur Railway

Allez dans **Railway** → **voiture-annonces (backend)** → **Variables**

### 1. Renommer les variables

| Ancien nom | Nouveau nom | Valeur |
|------------|-------------|---------|
| `MONEROO_PUBLIC_KEY` | `FEDAPAY_PUBLIC_KEY` | `pk_live_4Uy6ToxAxD57PgMBNjSa-A2g` |
| `MONEROO_SECRET_KEY` | `FEDAPAY_SECRET_KEY` | `sk_live_n5XmTG7terb50e9mYLySeNG_` |

**OU** gardez les noms actuels, le code prend les deux en compte ! 😊

---

## 🔧 Configuration Webhook FedaPay

Dans le dashboard FedaPay, configurez le webhook :

**URL du webhook** :
```
https://voiture-annonces-production.up.railway.app/api/payments/webhook/moneroo
```

Ou si vous utilisez le domaine personnalisé :
```
https://api.annonceauto.ci/api/payments/webhook/moneroo
```

**Événements à écouter** :
- ✅ `transaction.approved`
- ✅ `transaction.canceled`
- ✅ `transaction.declined`

---

## 💳 Packs de crédits configurés

| Pack | Crédits | Prix | Prix/crédit |
|------|---------|------|-------------|
| Starter | 50 | 5 000 FCFA | 100 FCFA |
| Standard | 100 | 9 500 FCFA | 95 FCFA (-5%) |
| Premium | 500 | 45 000 FCFA | 90 FCFA (-10%) |

---

## 🧪 Test du système

1. Connectez-vous en tant que vendeur
2. Allez dans "Mon Wallet"
3. Cliquez sur "Acheter des crédits"
4. Sélectionnez un pack
5. Cliquez sur "Payer maintenant"
6. Vous serez redirigé vers FedaPay
7. Choisissez votre moyen de paiement
8. Après paiement, retour automatique + crédits ajoutés ! ✅

---

## 💰 Moyens de paiement FedaPay

- 🧡 **Orange Money**
- 💙 **Wave**
- 💛 **MTN Money**
- 💜 **Moov Money**  
- 💳 **Cartes bancaires** (Visa, Mastercard)

---

## 🔒 Sécurité

⚠️ **IMPORTANT** : Les clés sont en mode **LIVE** (production).
Tous les paiements seront réels et factureront les clients.

Si vous voulez tester, demandez des **clés de test** (sandbox) à FedaPay.

---

## 📞 Support

En cas de problème :
- **FedaPay Support** : https://fedapay.com/support
- **Documentation** : https://docs.fedapay.com
- **Téléphone** : +225 07 78 03 00 75
- **Email Admin** : hermannnande@gmail.com


