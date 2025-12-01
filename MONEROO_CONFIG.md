# 🔐 Configuration FedaPay

⚠️ **Note** : Ce projet utilise **FedaPay** (passerelle de paiement intégrée à Moneroo).

## Variables d'environnement à ajouter sur Railway

Allez dans **Railway** → **voiture-annonces (backend)** → **Variables** :

### Option 1 : Garder les noms existants (rétrocompatibilité)
```
MONEROO_PUBLIC_KEY=pk_live_4Uy6ToxAxD57PgMBNjSa-A2g
MONEROO_SECRET_KEY=sk_live_n5XmTG7terb50e9mYLySeNG_
```

### Option 2 : Utiliser les noms FedaPay (recommandé)
```
FEDAPAY_PUBLIC_KEY=pk_live_4Uy6ToxAxD57PgMBNjSa-A2g
FEDAPAY_SECRET_KEY=sk_live_n5XmTG7terb50e9mYLySeNG_
```

**Ces clés sont déjà configurées sur Railway** ✅

---

## ✅ Vérification

Une fois les variables ajoutées :
1. Railway redéploiera automatiquement le backend
2. Attendez que le déploiement soit terminé (2-3 minutes)
3. Vérifiez les logs pour voir : `✅ Clés Moneroo configurées`

---

## 🔧 Configuration Webhook FedaPay

Dans le dashboard FedaPay (https://dashboard.fedapay.com), configurez le webhook :

**URL du webhook** :
```
https://voiture-annonces-production.up.railway.app/api/payments/webhook/fedapay
```

Ou si vous utilisez le domaine personnalisé :
```
https://api.annonceauto.ci/api/payments/webhook/fedapay
```

**Événements à écouter** :
- ✅ transaction.approved (paiement réussi)
- ✅ transaction.declined (paiement échoué)
- ✅ transaction.canceled (paiement annulé)

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
6. Vous serez redirigé vers **FedaPay checkout**
7. Choisissez votre moyen de paiement (Orange, Wave, MTN, Moov)
8. Payez avec votre téléphone
9. Après paiement, vous serez redirigé vers la page de résultat
10. Les crédits seront automatiquement ajoutés à votre wallet ✅

---

## 🔒 Sécurité

⚠️ **IMPORTANT** : Les clés FedaPay sont en mode **LIVE** (production).
Tous les paiements seront réels et factureront les clients.

Si vous voulez tester, utilisez des **clés de test** FedaPay :
- Mode test : `pk_sandbox_...` et `sk_sandbox_...`
- Mode production : `pk_live_...` et `sk_live_...`

---

## 📞 Support

En cas de problème :
- **FedaPay Support** : https://fedapay.com/support
- **FedaPay Docs** : https://docs.fedapay.com
- **WhatsApp Admin** : +225 07 78 03 00 75
- **Email Admin** : hermannnande@gmail.com

