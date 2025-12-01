# 🔐 Configuration Moneroo

## Variables d'environnement à ajouter sur Railway

Allez dans **Railway** → **voiture-annonces (backend)** → **Variables** et ajoutez :

### 1. Clé Publique Moneroo
```
MONEROO_PUBLIC_KEY=pk_live_4Uy6ToxAxD57PgMBNjSa-A2g
```

### 2. Clé Secrète Moneroo
```
MONEROO_SECRET_KEY=sk_live_n5XmTG7terb50e9mYLySeNG_
```

---

## ✅ Vérification

Une fois les variables ajoutées :
1. Railway redéploiera automatiquement le backend
2. Attendez que le déploiement soit terminé (2-3 minutes)
3. Vérifiez les logs pour voir : `✅ Clés Moneroo configurées`

---

## 🔧 Configuration Webhook Moneroo

Dans le dashboard Moneroo, configurez le webhook :

**URL du webhook** :
```
https://voiture-annonces-production.up.railway.app/api/payments/webhook/moneroo
```

Ou si vous utilisez le domaine personnalisé :
```
https://api.annonceauto.ci/api/payments/webhook/moneroo
```

**Événements à écouter** :
- ✅ payment.success
- ✅ payment.failed
- ✅ payment.pending

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
6. Vous serez redirigé vers Moneroo
7. Après paiement, vous serez redirigé vers la page de résultat
8. Les crédits seront automatiquement ajoutés à votre wallet

---

## 🔒 Sécurité

⚠️ **IMPORTANT** : Les clés Moneroo sont en mode **LIVE** (production).
Tous les paiements seront réels et factureront les clients.

Si vous voulez tester, demandez des **clés de test** (sandbox) à Moneroo.

---

## 📞 Support

En cas de problème :
- **Moneroo Support** : https://moneroo.io/support
- **Téléphone** : +225 07 78 03 00 75
- **Email Admin** : hermannnande@gmail.com

