# 🚀 Guide Rapide - Workflow de Développement

## 📌 Deux branches principales

| Branche | Usage | Site |
|---------|-------|------|
| `dev` | Développement et tests | 🧪 Preview Vercel |
| `main` | Production officielle | 🌐 www.annonceauto.ci |

---

## 🎯 Workflow quotidien (3 étapes simples)

### **1️⃣ Développer sur `dev`**

```bash
# Vous êtes sur dev ? Vérifiez :
git branch

# Si pas sur dev :
git checkout dev

# Faites vos modifications dans VSCode/Cursor...
# Puis sauvegardez :
git add .
git commit -m "Description de la modification"
git push origin dev
```

### **2️⃣ Tester la preview**

- Vercel envoie un **email avec le lien de preview**
- Ou allez sur https://vercel.com/dashboard → Votre projet → Deployments
- **Testez toutes vos modifications** sur la preview
- ✅ Si tout fonctionne → Étape 3
- ❌ Si bug → Corrigez et recommencez étape 1

### **3️⃣ Publier en production**

**Option A : Script automatique** (recommandé) ⭐

```bash
.\deploy-to-production.ps1
```

Le script fait tout automatiquement :
- Sauvegarde vos modifications
- Fusionne dev → main
- Déploie sur www.annonceauto.ci
- Vous remet sur dev

**Option B : Manuellement**

```bash
git checkout main
git merge dev
git push origin main
git checkout dev
```

---

## ⚡ Commandes ultra-rapides

```bash
# Développer
git checkout dev
# ... modifications ...
git add . && git commit -m "feat: Ma modification" && git push origin dev

# Publier (après test preview)
.\deploy-to-production.ps1
```

---

## 🆘 Problèmes courants

### **"Je suis sur quelle branche ?"**

```bash
git branch
# * dev    ← vous êtes ici
#   main
```

### **"J'ai modifié directement sur main par erreur !"**

```bash
# Annuler le dernier commit
git reset --soft HEAD~1

# Passer sur dev
git checkout dev

# Re-committer
git add .
git commit -m "..."
git push origin dev
```

### **"Comment revenir à la version d'hier ?"**

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur "Deployments"
3. Trouvez le déploiement qui fonctionnait
4. Cliquez sur `...` → "Promote to Production"

---

## 📝 Convention de messages

```bash
# ✅ Bons messages
git commit -m "feat: Ajouter filtre par prix"
git commit -m "fix: Corriger bug paiement mobile"
git commit -m "style: Améliorer responsive admin"
git commit -m "perf: Optimiser chargement images"

# ❌ À éviter
git commit -m "update"
git commit -m "fix"
git commit -m "test"
```

---

## 🔗 Liens importants

- **Vercel Dashboard** : https://vercel.com/dashboard
- **Railway Dashboard** : https://railway.app/dashboard
- **Site Production** : https://www.annonceauto.ci
- **Site Preview** : Lien dans l'email Vercel

---

## 💡 Astuce pro

**Créez un alias pour gagner du temps :**

Ajoutez dans votre profil PowerShell (`notepad $PROFILE`) :

```powershell
# Raccourcis Git
function gdev { git checkout dev }
function gmain { git checkout main }
function gsave { 
    param($message)
    git add .
    git commit -m $message
    git push
}
function gdeploy { .\deploy-to-production.ps1 }

# Usage :
# gdev              → aller sur dev
# gsave "mon msg"   → sauvegarder et push
# gdeploy           → déployer en prod
```

---

**🎉 C'est tout ! Simple et efficace.**

Pour plus de détails, consultez `WORKFLOW_STAGING.md`.

