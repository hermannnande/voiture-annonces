# 🔐 IDENTIFIANTS DE CONNEXION CORRECTS

## ⚠️ ATTENTION - Identifiants Mis à Jour

Les identifiants de connexion corrects sont :

### 👑 Super Administrateur
- **Email** : `admin@voiture.com`
- **Mot de passe** : `admin123`
- **Rôle** : Super Admin (accès total)

### 👤 Vendeur 1 - Jean Kouadio
- **Email** : `vendeur1@gmail.com`
- **Mot de passe** : `seller123`
- **Rôle** : Vendeur
- **Téléphone** : +2250701020304

### 👤 Vendeur 2 - Marie Diallo
- **Email** : `vendeur2@gmail.com`
- **Mot de passe** : `seller123`
- **Rôle** : Vendeur
- **Téléphone** : +2250705060708

---

## 🔄 Anciens identifiants (INCORRECTS - NE PAS UTILISER)

❌ jean@vendeur.com / vendeur123 - **N'EXISTE PAS**  
❌ marie@vendeur.com / vendeur123 - **N'EXISTE PAS**

---

## 🌐 URLs de Connexion

- **Page de connexion** : http://localhost:3000/auth/login
- **Page d'inscription** : http://localhost:3000/auth/register

---

## ✅ Pour Tester

### Tester en tant que Super Admin
```
Email: admin@voiture.com
Mot de passe: admin123
```
Après connexion, vous aurez accès à :
- Dashboard admin
- Modération des annonces
- Gestion des utilisateurs
- Logs d'audit

### Tester en tant que Vendeur
```
Email: vendeur1@gmail.com
Mot de passe: seller123
```
Après connexion, vous aurez accès à :
- Mes annonces
- Créer une annonce
- Messages
- Boosts

---

## 🔧 Si la connexion ne fonctionne toujours pas

1. **Vider le cache du navigateur** (Ctrl+Shift+Delete)
2. **Utiliser le mode navigation privée** (Ctrl+Shift+N)
3. **Vérifier que les services sont démarrés** :
   ```bash
   docker-compose ps
   ```
   Tous doivent être "Up"

4. **Relancer le seed** (si nécessaire) :
   ```bash
   docker-compose exec backend npm run prisma:seed
   ```

---

## 📝 Prisma Studio

Pour voir tous les utilisateurs en base de données :
```bash
docker-compose exec backend npx prisma studio
```
Puis ouvrir : http://localhost:5555

Cliquer sur "User" pour voir tous les comptes créés.

---

**Utilisez maintenant les identifiants corrects ci-dessus !** ✅





