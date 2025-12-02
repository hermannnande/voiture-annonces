# 🔄 Migration vers Moneroo (Clé Unique)

## ✅ Migration de FedaPay vers Moneroo effectuée !

Le système utilise maintenant **Moneroo** avec une seule clé API.

---

## 🔧 Configuration sur Railway

### 1. Supprimer les anciennes variables FedaPay

Allez sur **Railway** → **voiture-annonces (backend)** → **Variables**

**Supprimez** :
- `FEDAPAY_PUBLIC_KEY` (ou `MONEROO_PUBLIC_KEY`)
- `FEDAPAY_SECRET_KEY` (ou `MONEROO_SECRET_KEY`)

### 2. Ajouter la nouvelle variable Moneroo

**Créez une nouvelle variable** :

```
MONEROO_API_KEY=pvk_lo1e36|01KBDSV919H5ADRD0CHR272ZP4
```

### 3. Redéployer

Railway redémarrera automatiquement après avoir ajouté la variable.

---

## 📋 Vérification des logs

Une fois Railway redémarré, vous devriez voir dans les logs :

```
✅ Moneroo configuré avec succès - Paiement automatique activé 🚀
📌 API Key: pvk_lo1e36|01K...
```

---

## 🔧 Configuration Webhook Moneroo

Dans votre dashboard Moneroo, configurez le webhook :

**URL du webhook** :
```
https://voiture-annonces-production.up.railway.app/api/payments/webhook/moneroo
```

Ou si vous utilisez le domaine personnalisé :
```
https://api.annonceauto.ci/api/payments/webhook/moneroo
```

**Événements à écouter** :
- ✅ `payment.success` / `payment.successful` / `payment.completed`
- ✅ `payment.failed` / `payment.error`
- ✅ `payment.cancelled` / `payment.canceled`

---

## 💳 Pack de test configuré

**Pack Starter (pour vos tests)** :
- **5 crédits**
- **500 FCFA**
- Description : "Pack Test"

---

## 🧪 Tester le paiement

1. **Allez sur** : https://www.annonceauto.ci
2. **Connectez-vous** comme vendeur
3. **Allez dans** : Dashboard → Mon Wallet
4. **Cliquez sur** : "Acheter des crédits"
5. **Sélectionnez** : Pack Starter (5 crédits - 500 FCFA)
6. **Cliquez sur** : "Payer 500 FCFA maintenant"
7. **Vous serez redirigé** vers Moneroo
8. **Payez 500 FCFA** avec votre mobile money
9. **Vérifiez** que les 5 crédits sont ajoutés automatiquement ! 🎉

---

## 📌 Différences clés entre FedaPay et Moneroo

| Aspect | FedaPay | Moneroo |
|--------|---------|---------|
| Clés API | 2 clés (Public + Secret) | 1 clé unique |
| URL API | `https://api.fedapay.com/v1` | `https://api.moneroo.io/v1` |
| Format réponse | `v1/transaction` | Direct `data` |
| Statuts succès | `approved`, `transferred` | `success`, `successful`, `completed` |

---

## 🎯 Remettre les vrais prix

Une fois vos tests terminés, dites-le moi et je remettrai :
- Pack Starter : 50 crédits - 5 000 FCFA
- Pack Standard : 100 crédits - 9 500 FCFA
- Pack Premium : 500 crédits - 45 000 FCFA

---

## 📞 Support

En cas de problème :
- **Moneroo Support** : https://moneroo.io/support
- **Documentation** : https://docs.moneroo.io
- **Email Admin** : hermannnande@gmail.com


