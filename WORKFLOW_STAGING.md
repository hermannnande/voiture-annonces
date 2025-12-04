# 🚀 Workflow Staging - Annonces Auto CI

## 📋 Vue d'ensemble

Ce projet utilise un système de **prévisualisation automatique** avant publication en production.

---

## 🌳 Branches Git

| Branche | Utilisation | Déploiement |
|---------|-------------|-------------|
| `dev` | Développement et tests | 🧪 Preview Vercel + Railway PR |
| `main` | Production (site officiel) | 🚀 www.annonceauto.ci + api.annonceauto.ci |

---

## 🔄 Workflow de développement

### **Étape 1 : Développer sur la branche `dev`**

```bash
# Se placer sur la branche dev
git checkout dev

# Faire vos modifications...
# (éditer les fichiers dans VSCode/Cursor)

# Sauvegarder les modifications
git add .
git commit -m "Description de la modification"
git push origin dev
```

### **Étape 2 : Prévisualisation automatique**

Après `git push origin dev`, **Vercel** crée automatiquement :

- 🧪 **URL de prévisualisation** : `https://voiture-annonces-xyz.vercel.app`
- 📧 **Email de notification** avec le lien de preview
- ✅ **Visible dans le dashboard Vercel**

**Railway** peut aussi créer un environnement PR (Pull Request) pour l'API backend.

### **Étape 3 : Tester la prévisualisation**

1. Cliquez sur le lien de preview dans l'email Vercel
2. Testez toutes les fonctionnalités modifiées
3. Vérifiez qu'il n'y a pas de bugs

### **Étape 4 : Publier en production (si OK)**

```bash
# Fusionner dev dans main
git checkout main
git merge dev

# Publier en production
git push origin main
```

⚠️ **ATTENTION** : `git push origin main` déploie sur le site officiel !

---

## 🧪 Accéder aux previews

### **Frontend (Vercel)**

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet `voiture-annonces`
3. Onglet **"Deployments"**
4. Les previews sont marquées avec 🔍 et la branche `dev`

### **Backend (Railway)**

1. Allez sur https://railway.app/dashboard
2. Cliquez sur votre projet
3. Onglet **"Deployments"**
4. Les PR deployments sont listés séparément

---

## 📝 Convention de commit

Pour profiter pleinement des previews, utilisez des messages clairs :

```bash
# ✅ Bon
git commit -m "feat: Ajouter filtre par prix sur la recherche"
git commit -m "fix: Corriger bug paiement mobile"
git commit -m "style: Améliorer responsive dashboard admin"

# ❌ À éviter
git commit -m "fix"
git commit -m "update"
```

---

## 🔒 Protection de la branche `main`

Pour éviter les erreurs, la branche `main` devrait être protégée :

1. Allez sur GitHub : https://github.com/hermannnande/voiture-annonces/settings/branches
2. Cliquez sur **"Add rule"**
3. Branch name pattern : `main`
4. Cochez :
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass

---

## 🎯 Workflow simplifié

### **Pour développer une nouvelle fonctionnalité :**

```bash
git checkout dev              # 1. Aller sur dev
# ... faire modifications ...
git add .                     # 2. Sauvegarder
git commit -m "..."           # 3. Committer
git push origin dev           # 4. Push → Preview créé !
# ... tester preview ...
git checkout main             # 5. Si OK, aller sur main
git merge dev                 # 6. Fusionner
git push origin main          # 7. Publier en prod
```

### **Pour un hotfix urgent en production :**

```bash
git checkout main             # 1. Directement sur main
# ... faire la correction ...
git add .                     # 2. Sauvegarder
git commit -m "hotfix: ..."   # 3. Committer
git push origin main          # 4. Publier immédiatement
git checkout dev              # 5. Retour sur dev
git merge main                # 6. Synchroniser dev avec main
git push origin dev           # 7. Push dev
```

---

## 📊 Avantages de ce système

| Avant | Après |
|-------|-------|
| ❌ Chaque modification = site cassé | ✅ Test avant publication |
| ❌ Pas de retour en arrière facile | ✅ Rollback instantané sur Vercel |
| ❌ Stress à chaque déploiement | ✅ Sérénité : preview d'abord ! |
| ❌ Clients voient les bugs | ✅ Clients ne voient que la version stable |

---

## 🆘 Dépannage

### **Je veux annuler un déploiement production**

1. Vercel dashboard → Deployments
2. Trouvez le dernier déploiement **qui fonctionnait**
3. Cliquez sur les 3 points `...` → **"Promote to Production"**

### **Je me suis trompé de branche**

```bash
# Annuler le dernier commit (sans perdre les modifications)
git reset --soft HEAD~1

# Changer de branche
git checkout dev

# Re-committer
git add .
git commit -m "..."
```

### **Preview Vercel ne fonctionne pas**

1. Vérifiez que le build passe (onglet "Deployments")
2. Vérifiez les variables d'environnement (onglet "Settings" → "Environment Variables")
3. Les previews héritent des variables de production par défaut

---

## 🔗 Liens utiles

- **Vercel Dashboard** : https://vercel.com/dashboard
- **Railway Dashboard** : https://railway.app/dashboard
- **GitHub Repo** : https://github.com/hermannnande/voiture-annonces
- **Site Production** : https://www.annonceauto.ci
- **API Production** : https://api.annonceauto.ci

---

## 📞 Support

Pour toute question sur ce workflow, consultez ce fichier ou demandez de l'aide !

