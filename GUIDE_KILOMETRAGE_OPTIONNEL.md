# 📋 Guide - Kilométrage Optionnel

## 🎯 Objectif

Rendre le champ **Kilométrage (km)** optionnel lors de la création et modification d'annonces.

---

## ✅ Modifications appliquées

### Backend

#### 1. Schema Prisma (`backend/prisma/schema.prisma`)

**AVANT** :
```prisma
mileageKm         Int           @map("mileage_km")
```

**APRÈS** :
```prisma
mileageKm         Int?          @map("mileage_km")
```

Le `?` rend le champ nullable dans la base de données.

#### 2. DTO de création (`backend/src/listings/dto/create-listing.dto.ts`)

**AVANT** :
```typescript
@IsNumber({}, { message: 'Le kilométrage doit être un nombre' })
@Min(0, { message: 'Le kilométrage doit être positif' })
@Type(() => Number)
mileageKm: number;
```

**APRÈS** :
```typescript
@IsOptional()
@IsNumber({}, { message: 'Le kilométrage doit être un nombre' })
@Min(0, { message: 'Le kilométrage doit être positif' })
@Type(() => Number)
mileageKm?: number;
```

- `@IsOptional()` : Validation optionnelle
- `?` dans `mileageKm?: number` : TypeScript optionnel

---

### Frontend

#### 1. Page de création (`frontend/src/app/dashboard/listings/create/page.tsx`)

**AVANT** :
```tsx
<label className="block text-sm font-medium text-gray-700 mb-2">
  Kilométrage (km) *
</label>
<input
  type="number"
  required
  value={formData.mileageKm}
  onChange={(e) => setFormData({ ...formData, mileageKm: e.target.value })}
  className="input"
  placeholder="68000"
/>
```

**APRÈS** :
```tsx
<label className="block text-sm font-medium text-gray-700 mb-2">
  Kilométrage (km)
</label>
<input
  type="number"
  value={formData.mileageKm}
  onChange={(e) => setFormData({ ...formData, mileageKm: e.target.value })}
  className="input"
  placeholder="68000 (optionnel)"
/>
```

- Astérisque `*` retirée du label
- Attribut `required` retiré de l'input
- Placeholder mis à jour pour indiquer "(optionnel)"

#### 2. Page d'édition (`frontend/src/app/dashboard/listings/[id]/edit/page.tsx`)

Mêmes modifications que pour la page de création.

---

## 🚀 Déploiement

### Étape 1 : Migration de la base de données

```powershell
cd backend
npx prisma generate
npx prisma migrate dev --name make_mileage_optional
cd ..
```

Cette migration va :
1. Modifier la colonne `mileage_km` pour accepter NULL
2. Créer un fichier de migration dans `backend/prisma/migrations/`

### Étape 2 : Commit et Push

**Option A - Script automatique** (recommandé) :
```powershell
.\make-mileage-optional.ps1
```

**Option B - Manuellement** :
```powershell
git add backend/prisma/schema.prisma `
       backend/src/listings/dto/create-listing.dto.ts `
       frontend/src/app/dashboard/listings/create/page.tsx `
       frontend/src/app/dashboard/listings/[id]/edit/page.tsx `
       backend/prisma/migrations `
       make-mileage-optional.ps1 `
       GUIDE_KILOMETRAGE_OPTIONNEL.md

git commit -m "feat(listings): rendre le kilométrage optionnel"
git push origin main
```

### Étape 3 : Attendre le redéploiement

- **Railway** : 3-5 minutes
- **Vercel** : 2-3 minutes

---

## ✅ Tests à effectuer

### Test 1 : Création sans kilométrage

1. Allez sur `https://www.annonceauto.ci/dashboard/listings/create`
2. Remplissez le formulaire **SANS** le kilométrage
3. Publiez l'annonce
4. **Résultat attendu** : Annonce créée avec succès

### Test 2 : Création avec kilométrage

1. Créez une nouvelle annonce
2. Remplissez le kilométrage (ex: 50000)
3. Publiez l'annonce
4. **Résultat attendu** : Annonce créée avec le kilométrage

### Test 3 : Édition d'une annonce existante

1. Éditez une annonce
2. Supprimez le kilométrage (videz le champ)
3. Sauvegardez
4. **Résultat attendu** : Annonce mise à jour sans kilométrage

### Test 4 : Affichage sur la liste

1. Allez sur la page d'accueil
2. Vérifiez qu'une annonce sans kilométrage s'affiche correctement
3. **Résultat attendu** : Pas d'erreur, affichage normal

---

## 🔍 Impact sur l'affichage

### Frontend - Affichage du kilométrage

Si votre composant d'affichage d'annonce affiche le kilométrage, il doit gérer le cas où il est `null` :

**Exemple de modification recommandée** :

```tsx
// AVANT
<p>Kilométrage : {listing.mileageKm.toLocaleString()} km</p>

// APRÈS
<p>
  Kilométrage : {listing.mileageKm 
    ? `${listing.mileageKm.toLocaleString()} km` 
    : 'Non spécifié'
  }
</p>
```

Ou simplement ne pas afficher si absent :

```tsx
{listing.mileageKm && (
  <p>Kilométrage : {listing.mileageKm.toLocaleString()} km</p>
)}
```

---

## 📊 Base de données

### Migration SQL générée

Prisma va générer automatiquement une migration similaire à :

```sql
-- AlterTable
ALTER TABLE "listings" ALTER COLUMN "mileage_km" DROP NOT NULL;
```

Cette commande :
- Supprime la contrainte `NOT NULL` sur la colonne
- Permet de stocker `NULL` dans `mileage_km`
- Ne perd aucune donnée existante

### Annonces existantes

Les annonces déjà créées gardent leur kilométrage actuel. Seules les nouvelles annonces peuvent être créées sans kilométrage.

---

## 🐛 Résolution de problèmes

### Erreur : "mileageKm is required"

**Cause** : Le frontend ou backend n'a pas été redéployé

**Solution** :
1. Vérifiez que Railway est redéployé (status vert)
2. Vérifiez que Vercel est redéployé (status vert)
3. Videz le cache du navigateur (Ctrl+Shift+Delete)

### Erreur : "Column 'mileage_km' cannot be null"

**Cause** : La migration Prisma n'a pas été appliquée

**Solution** :
```powershell
cd backend
npx prisma migrate deploy
```

Ou sur Railway :
1. Railway Dashboard > Service
2. Variables > Vérifiez que DATABASE_URL est correcte
3. Redéployez le service

### Erreur : "migration failed"

**Cause** : Conflit avec une migration précédente

**Solution** :
```powershell
cd backend
npx prisma migrate reset
npx prisma db push
npx prisma db seed
```

⚠️ **Attention** : Reset supprime toutes les données !

---

## 📝 Checklist de déploiement

- [ ] **Backend - Schema Prisma** : `mileageKm Int?` ✅
- [ ] **Backend - DTO** : `@IsOptional()` ajouté ✅
- [ ] **Frontend - Création** : `required` retiré ✅
- [ ] **Frontend - Édition** : `required` retiré ✅
- [ ] **Migration créée** : `npx prisma migrate dev` exécuté
- [ ] **Code commité** : Git commit + push
- [ ] **Railway redéployé** : Status vert
- [ ] **Vercel redéployé** : Status vert
- [ ] **Tests effectués** : Création avec/sans kilométrage
- [ ] **Affichage vérifié** : Pas d'erreur sur la page de liste

---

## 🎯 Récapitulatif

### Avant

✅ Champs obligatoires :
- Titre *
- Description *
- Prix *
- Kilométrage * ← **Obligatoire**
- Couleur *
- etc.

### Après

✅ Champs obligatoires :
- Titre *
- Description *
- Prix *
- Kilométrage ← **Optionnel** 🎉
- Couleur *
- etc.

---

**Date** : 12 décembre 2025  
**Version** : 1.0  
**Auteur** : Support Technique

