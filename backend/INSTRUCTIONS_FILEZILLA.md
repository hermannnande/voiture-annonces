# 📤 INSTRUCTIONS FILEZILLA - Connexion et Transfert

## 📋 ÉTAPE 1 : SE CONNECTER

### Dans FileZilla, en haut, remplissez :

```
Hôte :         ftp.annonceauto.ci
Identifiant :  admin_annonceauto.ci
Mot de passe : *XREfL)X)*uNT
Port :         21
```

Puis cliquez sur **"Connexion rapide"**

✅ Vous devriez voir les dossiers de votre serveur s'afficher à droite.

---

## 📤 ÉTAPE 2 : NAVIGUER VERS LE BON DOSSIER

### Dans la partie DROITE (serveur distant) :

1. Cherchez le dossier `/home/` ou `/var/www/`
2. Si vous voyez `html/` ou `public_html/`, entrez dedans
3. Vous devriez être dans le dossier racine de votre site

**Note** : Le chemin exact peut être :
- `/home/admin_annonceauto.ci/public_html/`
- `/var/www/annonceauto.ci/`
- `/home/admin_annonceauto.ci/`

---

## 📤 ÉTAPE 3 : TRANSFÉRER LES FICHIERS

### Dans la partie GAUCHE (votre PC) :

1. Naviguez vers : `C:\Users\LENOVO\Desktop\voiture 5`
2. Vous devriez voir les dossiers `backend` et `frontend`

### Transférer :

1. **Glissez-déposez** le dossier `backend` de gauche vers droite
2. **Attendez** que le transfert se termine (10-15 min)
3. **Glissez-déposez** le dossier `frontend` de gauche vers droite
4. **Attendez** que le transfert se termine

✅ En bas de FileZilla, vous verrez la progression.

---

## ✅ VÉRIFICATION

Après le transfert, dans la partie DROITE (serveur), vous devriez voir :
```
📁 backend/
📁 frontend/
```

---

**Une fois le transfert terminé, passez à l'étape SSH !**



