# 🎯 DÉPLOIEMENT RAPIDE - annonceauto.ci
# Suivez ces étapes dans l'ordre !

## ✅ ÉTAPE 1 : PRÉPARER LES FICHIERS (Sur votre ordinateur)

### Windows :
```powershell
.\prepare-deploy.ps1
```

### Mac/Linux :
```bash
chmod +x prepare-deploy.sh
./prepare-deploy.sh
```

---

## ✅ ÉTAPE 2 : SE CONNECTER AU FTP

### Télécharger FileZilla
👉 https://filezilla-project.org/

### Configuration :
- Hôte : `sftp://vps116108.serveur-vps.net`
- Utilisateur : `root`
- Mot de passe : `U9p0j2o8Y2h2C7C`
- Port : `22`

---

## ✅ ÉTAPE 3 : TRANSFÉRER LES FICHIERS

Créer les dossiers sur le serveur (côté droit dans FileZilla) :
```
/home/annonceauto/
/home/annonceauto/backend/
/home/annonceauto/frontend/
```

### Transférer depuis votre ordinateur (gauche) vers le serveur (droite) :

#### Backend :
```
backend/dist/              → /home/annonceauto/backend/dist/
backend/node_modules/      → /home/annonceauto/backend/node_modules/
backend/prisma/            → /home/annonceauto/backend/prisma/
backend/package.json       → /home/annonceauto/backend/
backend/package-lock.json  → /home/annonceauto/backend/
backend/.env               → /home/annonceauto/backend/
backend/ecosystem.config.js → /home/annonceauto/backend/
```

#### Frontend :
```
frontend/.next/            → /home/annonceauto/frontend/.next/
frontend/node_modules/     → /home/annonceauto/frontend/node_modules/
frontend/public/           → /home/annonceauto/frontend/public/
frontend/package.json      → /home/annonceauto/frontend/
frontend/package-lock.json → /home/annonceauto/frontend/
frontend/.env.production   → /home/annonceauto/frontend/
frontend/next.config.js    → /home/annonceauto/frontend/
frontend/ecosystem.config.js → /home/annonceauto/frontend/
```

#### Script d'installation :
```
install-server.sh          → /home/annonceauto/install-server.sh
```

⚠️ **ATTENTION** : Le transfert peut prendre 30 minutes à 1 heure !

---

## ✅ ÉTAPE 4 : SE CONNECTER EN SSH

### Télécharger PuTTY (Windows)
👉 https://www.putty.org/

### Ou utiliser le terminal (Mac/Linux) :
```bash
ssh root@vps116108.serveur-vps.net
```

**Mot de passe** : `U9p0j2o8Y2h2C7C`

---

## ✅ ÉTAPE 5 : INSTALLER ET DÉMARRER (Dans le terminal SSH)

```bash
# Aller dans le dossier
cd /home/annonceauto

# Rendre le script exécutable
chmod +x install-server.sh

# Exécuter le script d'installation
./install-server.sh
```

Le script va :
- ✅ Installer Node.js
- ✅ Installer PM2
- ✅ Installer Nginx
- ✅ Configurer la base de données
- ✅ Démarrer les applications
- ✅ Tout configurer automatiquement

---

## ✅ ÉTAPE 6 : INSTALLER LE SSL (HTTPS)

Toujours dans le terminal SSH :

```bash
certbot --nginx -d annonceauto.ci -d www.annonceauto.ci -d api.annonceauto.ci
```

Suivre les instructions et accepter la redirection automatique vers HTTPS.

---

## ✅ ÉTAPE 7 : CONFIGURER LE DNS

Se connecter au panneau de gestion de votre domaine et ajouter :

```
Type    Nom     Valeur                          TTL
A       @       [IP de votre VPS]               3600
A       www     [IP de votre VPS]               3600
A       api     [IP de votre VPS]               3600
```

Pour trouver l'IP du VPS (dans le terminal SSH) :
```bash
curl ifconfig.me
```

---

## ✅ ÉTAPE 8 : VÉRIFIER QUE TOUT FONCTIONNE

### Dans le terminal SSH :
```bash
# Vérifier le statut des applications
pm2 status

# Voir les logs
pm2 logs

# Vérifier Nginx
systemctl status nginx
```

### Dans votre navigateur :
- 🌐 **Frontend** : https://annonceauto.ci
- 🔧 **Backend API** : https://api.annonceauto.ci/api

---

## 🎉 C'EST TERMINÉ !

Votre site est maintenant en ligne ! 🚀

---

## 📝 COMMANDES UTILES

### Redémarrer les applications
```bash
pm2 restart all
```

### Voir les logs en temps réel
```bash
pm2 logs
```

### Arrêter les applications
```bash
pm2 stop all
```

---

## 🆘 EN CAS DE PROBLÈME

1. Vérifier les logs : `pm2 logs`
2. Consulter le guide complet : `README_DEPLOIEMENT_FTP.md`
3. Vérifier Nginx : `systemctl status nginx`
4. Vérifier la base de données sur PhpMyAdmin :
   👉 https://vps116108.serveur-vps.net:8080/phpmyadmin

---

## 📞 INFORMATIONS IMPORTANTES

### Serveur
- **Hôte** : vps116108.serveur-vps.net
- **Mot de passe root** : U9p0j2o8Y2h2C7C

### Base de données
- **Nom** : c0ann5434
- **Utilisateur** : c0ann5434
- **Mot de passe** : $J-ZFr!Huo))_
- **PhpMyAdmin** : https://vps116108.serveur-vps.net:8080/phpmyadmin
  - User : root
  - Pass : U9p0j2o8Y2h2C7C

### Email
- **Email** : admin@annonceauto.ci
- **Mot de passe** : Y_LrJsjuYMOlN
- **Webmail** : https://vps116108.serveur-vps.net/webmail



