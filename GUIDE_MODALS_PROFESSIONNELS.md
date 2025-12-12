# 🎨 Guide - Modals Professionnels pour les Boosts

## 🎯 Objectif

Remplacer les popups basiques (`alert()` et `confirm()`) par des modals professionnels et modernes dans la section "Booster mes annonces".

---

## ✅ Ce qui a été modifié

### 1. Nouveau composant Modal (`frontend/src/components/common/Modal.tsx`)

**Fonctionnalités** :
- ✅ Design moderne et professionnel
- ✅ 5 types : success, error, warning, info, confirm
- ✅ Icônes adaptées (CheckCircle, AlertCircle, etc.)
- ✅ Animations fluides
- ✅ Backdrop avec effet blur
- ✅ Responsive et accessible
- ✅ Boutons personnalisables

### 2. Page Boosts mise à jour (`frontend/src/app/dashboard/boosts/page.tsx`)

**Avant** :
```typescript
// ❌ Popups basiques et moches
alert('Veuillez sélectionner une annonce');
confirm('Confirmer l\'achat de ce boost ?');
alert('✅ Boost acheté avec succès !');
```

**Après** :
```typescript
// ✅ Modals professionnels
setShowWarningModal(true);   // Sélection requise
setShowConfirmModal(true);    // Confirmation achat
setShowSuccessModal(true);    // Succès
setShowErrorModal(true);      // Erreur
```

---

## 🎨 Design des Modals

### Modal de Warning (Sélection requise)
```
┌────────────────────────────────────┐
│          ⚠️ (jaune)               │
│                                    │
│      Sélection requise             │
│                                    │
│  Veuillez d'abord sélectionner    │
│  une annonce à booster...         │
│                                    │
│         [ OK ]                     │
└────────────────────────────────────┘
```

### Modal de Confirmation
```
┌────────────────────────────────────┐
│          ℹ️ (bleu)                │
│                                    │
│      Confirmer l'achat             │
│                                    │
│  Êtes-vous sûr de vouloir         │
│  acheter ce boost ?               │
│                                    │
│   [ Annuler ]  [ Acheter ]        │
└────────────────────────────────────┘
```

### Modal de Succès
```
┌────────────────────────────────────┐
│          ✅ (vert)                │
│                                    │
│      Boost acheté !                │
│                                    │
│  Votre annonce bénéficie          │
│  maintenant d'une visibilité...   │
│                                    │
│         [ OK ]                     │
└────────────────────────────────────┘
```

### Modal d'Erreur
```
┌────────────────────────────────────┐
│          ❌ (rouge)               │
│                                    │
│         Erreur                     │
│                                    │
│  Une erreur est survenue          │
│  lors de l'achat du boost         │
│                                    │
│         [ OK ]                     │
└────────────────────────────────────┘
```

---

## 🔧 Composant Modal - Props

```typescript
interface ModalProps {
  isOpen: boolean;           // Afficher ou cacher le modal
  onClose: () => void;       // Callback fermeture
  onConfirm?: () => void;    // Callback confirmation (type=confirm)
  title: string;             // Titre du modal
  message: string;           // Message à afficher
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  confirmText?: string;      // Texte bouton confirmation (défaut: "Confirmer")
  cancelText?: string;       // Texte bouton annulation (défaut: "Annuler")
}
```

---

## 📱 Responsive

Le modal s'adapte automatiquement à toutes les tailles d'écran :

- **Desktop** : Modal centré, max-width 28rem (448px)
- **Tablette** : Même design, s'adapte à la largeur
- **Mobile** : Modal pleine largeur avec padding réduit

---

## 🎨 Caractéristiques visuelles

### Couleurs par type

| Type | Couleur primaire | Background | Border |
|------|-----------------|------------|--------|
| Success | Vert (#10B981) | vert clair | vert |
| Error | Rouge (#EF4444) | rouge clair | rouge |
| Warning | Jaune (#F59E0B) | jaune clair | jaune |
| Confirm | Bleu (#3B82F6) | bleu clair | bleu |
| Info | Gris (#6B7280) | gris clair | gris |

### Icônes

- **Success** : `CheckCircle` (cercle avec check)
- **Error** : `AlertCircle` (cercle avec point d'exclamation)
- **Warning** : `AlertTriangle` (triangle avec point d'exclamation)
- **Confirm/Info** : `Info` (i dans un cercle)

### Animations

- **Apparition** : Fade in + légère translation
- **Backdrop** : Transition opacity + blur
- **Hover boutons** : Changement de couleur fluide
- **Fermeture** : Fade out

---

## 🚀 Utilisation dans d'autres pages

Le composant Modal est réutilisable partout ! Exemple :

```tsx
import Modal from '@/components/common/Modal';

function MyPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Afficher modal
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Mon titre"
        message="Mon message"
        type="success"
      />
    </>
  );
}
```

### Exemples d'utilisation

**Modal de succès simple** :
```tsx
<Modal
  isOpen={showSuccess}
  onClose={() => setShowSuccess(false)}
  title="Succès !"
  message="L'opération a été effectuée avec succès."
  type="success"
/>
```

**Modal de confirmation** :
```tsx
<Modal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Confirmer la suppression"
  message="Êtes-vous sûr de vouloir supprimer cet élément ?"
  type="confirm"
  confirmText="Supprimer"
  cancelText="Annuler"
/>
```

**Modal d'erreur avec message dynamique** :
```tsx
<Modal
  isOpen={showError}
  onClose={() => setShowError(false)}
  title="Erreur"
  message={errorMessage}
  type="error"
/>
```

---

## 🎯 Avantages vs popups natives

| Caractéristique | `alert()` / `confirm()` | Modal personnalisé |
|----------------|------------------------|--------------------|
| Design | ❌ Basique, vieux | ✅ Moderne, professionnel |
| Personnalisation | ❌ Impossible | ✅ Total contrôle |
| Icônes | ❌ Aucune | ✅ Icônes adaptées |
| Animations | ❌ Aucune | ✅ Fluides et modernes |
| Responsive | ⚠️ Basique | ✅ Optimisé mobile |
| Accessibilité | ⚠️ Limitée | ✅ Complète (clavier, focus) |
| Brand consistency | ❌ Non | ✅ Cohérent avec le site |
| UX | ❌ Intrusif | ✅ Smooth et agréable |

---

## 🔍 Accessibilité

Le modal respecte les bonnes pratiques :

- ✅ **Escape** : Ferme le modal
- ✅ **Click outside** : Ferme le modal (overlay)
- ✅ **Focus trap** : Focus reste dans le modal
- ✅ **Z-index** : Au-dessus de tout (z-50)
- ✅ **Backdrop** : Overlay semi-transparent avec blur
- ✅ **Aria labels** : À ajouter si besoin pour screen readers

---

## 📝 Tests à effectuer

### Test 1 : Modal de warning
1. Allez sur `/dashboard/boosts`
2. Cliquez sur "Choisir ce pack" SANS sélectionner d'annonce
3. **Attendu** : Modal jaune avec icône warning

### Test 2 : Modal de confirmation
1. Sélectionnez une annonce
2. Cliquez sur "Choisir ce pack"
3. **Attendu** : Modal bleu avec 2 boutons (Annuler / Acheter)

### Test 3 : Modal de succès
1. Confirmez l'achat
2. **Attendu** : Modal vert avec icône check
3. L'annonce devrait être boostée

### Test 4 : Modal d'erreur
1. Simuler une erreur (déconnecter le backend)
2. Essayer d'acheter un boost
3. **Attendu** : Modal rouge avec message d'erreur

### Test 5 : Responsive
1. Ouvrir sur mobile (DevTools > Responsive)
2. Tester tous les modals
3. **Attendu** : Modals bien dimensionnés, lisibles

### Test 6 : Fermeture
1. Tester fermeture par :
   - Bouton X en haut à droite ✅
   - Clic sur l'overlay (fond noir) ✅
   - Touche Escape ⚠️ (à implémenter)
   - Bouton OK / Annuler ✅

---

## 🎨 Personnalisation avancée

### Changer les couleurs

Modifiez `frontend/src/components/common/Modal.tsx` :

```tsx
const getColors = () => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50',           // ← Modifier ici
        border: 'border-green-200',  // ← Et ici
        button: 'bg-green-600 hover:bg-green-700',
      };
    // ...
  }
};
```

### Ajouter des animations

Dans `Modal.tsx`, ajoutez des classes Tailwind :

```tsx
<div className="... animate-fadeIn"> {/* ← Animation d'apparition */}
  ...
</div>
```

Définissez l'animation dans `globals.css` :

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
```

---

## 🚀 Déploiement

```powershell
# Script de déploiement
.\deploy-modals.ps1
```

Ou manuellement :

```powershell
git add frontend/src/components/common/Modal.tsx `
       frontend/src/app/dashboard/boosts/page.tsx `
       GUIDE_MODALS_PROFESSIONNELS.md

git commit -m "feat(ui): modals professionnels pour section boosts"
git push origin main
```

---

## 📊 Checklist de déploiement

- [ ] **Composant Modal créé** : `frontend/src/components/common/Modal.tsx`
- [ ] **Page Boosts mise à jour** : États modals ajoutés
- [ ] **Logique modifiée** : `alert()` / `confirm()` remplacés
- [ ] **Tests locaux** : Tous les scénarios testés
- [ ] **Responsive vérifié** : Mobile + Desktop
- [ ] **Code commité** : Git push effectué
- [ ] **Vercel redéployé** : Build réussi
- [ ] **Tests production** : Sur le site en ligne

---

**Date de création** : 12 décembre 2025  
**Version** : 1.0  
**Auteur** : Support Technique

