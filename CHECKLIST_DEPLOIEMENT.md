# ✅ Checklist de Déploiement LWS

## 📋 Avant de Commencer

- [ ] J'ai un compte LWS
- [ ] J'ai un nom de domaine
- [ ] J'ai loué un VPS LWS
- [ ] J'ai l'IP du VPS : `________________`
- [ ] J'ai accès SSH au VPS

---

## 1️⃣ Configuration Initiale du VPS

- [ ] Connexion SSH réussie
- [ ] Docker installé
- [ ] Docker Compose installé
- [ ] Nginx installé
- [ ] Git installé (si utilisation de Git)

**Commande rapide** :
```bash
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh
apt install docker-compose git nginx -y
```

---

## 2️⃣ Transfert de l'Application

- [ ] Application transférée dans `/var/www/voiture-app`
- [ ] Tous les fichiers présents
- [ ] Permissions correctes

---

## 3️⃣ Configuration des Variables d'Environnement

### Backend

- [ ] Fichier `backend/.env` créé
- [ ] `DATABASE_URL` configurée avec mot de passe fort
- [ ] `JWT_SECRET` généré (32+ caractères)
- [ ] `JWT_REFRESH_SECRET` généré (32+ caractères)
- [ ] `MAIL_HOST` configuré (SMTP)
- [ ] `MAIL_USER` et `MAIL_PASSWORD` configurés
- [ ] `FRONTEND_URL` mis à jour avec le vrai domaine

**Générer des secrets** :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend

- [ ] Fichier `frontend/.env.local` créé
- [ ] `NEXT_PUBLIC_API_URL` mis à jour avec le vrai domaine API

---

## 4️⃣ Configuration Docker

- [ ] Fichier `docker-compose.prod.yml` présent
- [ ] Variable `DB_PASSWORD` définie
- [ ] Build des images réussi
- [ ] Tous les containers démarrés

**Commandes** :
```bash
export DB_PASSWORD="VOTRE_MOT_DE_PASSE_FORT"
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

---

## 5️⃣ Base de Données

- [ ] PostgreSQL démarré et accessible
- [ ] Migrations Prisma exécutées
- [ ] Seed de la base effectué
- [ ] Comptes de test créés

**Commandes** :
```bash
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
docker-compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

---

## 6️⃣ Configuration Nginx

- [ ] Fichier de config créé : `/etc/nginx/sites-available/voiture-app`
- [ ] Domaine remplacé dans la config (votre-domaine.com)
- [ ] Lien symbolique créé
- [ ] Test Nginx OK (`nginx -t`)
- [ ] Nginx rechargé

**Commandes** :
```bash
ln -s /etc/nginx/sites-available/voiture-app /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 7️⃣ Configuration DNS

### Sur Panel LWS (https://panel.lws.fr)

- [ ] Enregistrement A : `@` → IP du VPS
- [ ] Enregistrement A : `www` → IP du VPS
- [ ] Enregistrement A : `api` → IP du VPS
- [ ] Propagation DNS vérifiée (2-24h)

**Vérifier la propagation** :
```bash
nslookup votre-domaine.com
nslookup api.votre-domaine.com
```

---

## 8️⃣ SSL / HTTPS

- [ ] Certbot installé
- [ ] Certificats générés pour :
  - [ ] `votre-domaine.com`
  - [ ] `www.votre-domaine.com`
  - [ ] `api.votre-domaine.com`
- [ ] HTTPS fonctionne
- [ ] Auto-renouvellement configuré

**Commandes** :
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com -d api.votre-domaine.com
```

---

## 9️⃣ Sécurité

- [ ] Firewall UFW activé
- [ ] Ports 80 et 443 autorisés
- [ ] Port SSH autorisé (22 ou custom)
- [ ] Tous les mots de passe par défaut changés
- [ ] Clés SSH configurées (optionnel)

**Commandes** :
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## 🔟 Backups

- [ ] Script `backup.sh` créé et exécutable
- [ ] Dossier `/var/backups/voiture-app` créé
- [ ] Cron configuré pour backups quotidiens
- [ ] Test de backup effectué

**Commandes** :
```bash
chmod +x /var/www/voiture-app/backup.sh
/var/www/voiture-app/backup.sh

# Ajouter au cron :
crontab -e
# Ligne : 0 2 * * * /var/www/voiture-app/backup.sh
```

---

## 1️⃣1️⃣ Scripts de Déploiement

- [ ] Script `deploy.sh` créé et exécutable
- [ ] Test de déploiement effectué

**Commandes** :
```bash
chmod +x /var/www/voiture-app/deploy.sh
/var/www/voiture-app/deploy.sh
```

---

## 1️⃣2️⃣ Tests Post-Déploiement

### Backend API

- [ ] `curl https://api.votre-domaine.com/api/health` → `{"status":"ok"}`
- [ ] Swagger accessible : `https://api.votre-domaine.com/api/docs`

### Frontend

- [ ] `https://votre-domaine.com` charge la page d'accueil
- [ ] Tous les liens fonctionnent
- [ ] Images s'affichent

### Authentification

- [ ] Login admin fonctionne
- [ ] Login vendeur fonctionne
- [ ] JWT persiste correctement

### Fonctionnalités

- [ ] Création d'annonce fonctionne
- [ ] Upload d'images fonctionne
- [ ] Système de boost fonctionne
- [ ] Wallet fonctionne
- [ ] Messagerie fonctionne

---

## 1️⃣3️⃣ Monitoring

- [ ] Logs accessibles : `docker-compose logs -f`
- [ ] Utilisation ressources vérifiée : `docker stats`
- [ ] Espace disque suffisant : `df -h`

---

## 1️⃣4️⃣ Documentation

- [ ] Comptes admin/vendeurs notés en sécurité
- [ ] Mots de passe sauvegardés dans gestionnaire
- [ ] IP du VPS notée
- [ ] Configuration DNS sauvegardée

---

## 📊 Informations à Noter

| Information | Valeur |
|-------------|--------|
| **IP VPS** | `________________` |
| **Domaine** | `________________` |
| **DB Password** | `________________` (sécurisé) |
| **JWT Secret** | `________________` (sécurisé) |
| **Email Admin** | `________________` |
| **Pass Admin** | `________________` (sécurisé) |

---

## 🎉 Déploiement Complet !

Si toutes les cases sont cochées, votre application est déployée avec succès !

### URLs Finales

- 🌐 **Frontend** : https://votre-domaine.com
- 🔌 **API** : https://api.votre-domaine.com
- 👤 **Admin** : https://votre-domaine.com/admin
- 💼 **Swagger** : https://api.votre-domaine.com/api/docs

---

## 📞 Commandes de Maintenance

```bash
# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f

# Redémarrer
docker-compose -f docker-compose.prod.yml restart

# Backup manuel
/var/www/voiture-app/backup.sh

# Déploiement
/var/www/voiture-app/deploy.sh

# Vérifier l'état
docker-compose -f docker-compose.prod.yml ps
docker stats

# Espace disque
df -h
```

---

## 🆘 Support

- **Documentation** : `DEPLOIEMENT_LWS.md`
- **Guide rapide** : `GUIDE_RAPIDE_DEPLOIEMENT_LWS.md`
- **Support LWS** : https://aide.lws.fr/
- **Email LWS** : support@lws.fr

---

**Bravo ! Votre application est en production ! 🚀**



