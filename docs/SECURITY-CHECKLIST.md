# 🔐 CHECKLIST SÉCURITÉ COMPLÈTE - PIONEER ACADEMY

## 📋 UTILISATION

Cochez chaque item **AVANT** de déployer en production.
Cette checklist suit les standards **OWASP Top 10** et les best practices de l'industrie.

---

## 🔒 SECTION 1 - AUTHENTIFICATION & AUTORISATION

### Passwords & Credentials

- [ ] **Aucun** mot de passe ou secret dans le code source
- [ ] Tous les secrets dans fichiers `.env` (jamais commités)
- [ ] `.env` ajouté au `.gitignore`
- [ ] Passwords hashés avec **bcrypt** (minimum 12 rounds)
- [ ] Politique de mots de passe forte :
  - Minimum 8 caractères
  - Au moins 1 majuscule
  - Au moins 1 minuscule
  - Au moins 1 chiffre
  - Au moins 1 caractère spécial

### JWT (JSON Web Tokens)

- [ ] **JWT_SECRET** généré aléatoirement (minimum 32 caractères)
- [ ] **JWT_REFRESH_SECRET** différent du JWT_SECRET
- [ ] Expiration token courte (15 minutes recommandé)
- [ ] Refresh token avec expiration plus longue (7 jours max)
- [ ] JWT invalidé lors du logout
- [ ] Token vérifié à chaque requête protégée

### Protection comptes

- [ ] Rate limiting sur endpoints de login (5 tentatives/15min)
- [ ] Account lockout après X tentatives échouées
- [ ] Temps de verrouillage approprié (1 heure minimum)
- [ ] Pas de révélation d'information sur existence utilisateur
- [ ] 2FA disponible pour comptes admins (bonus)

---

## 🛡️ SECTION 2 - PROTECTION DES DONNÉES

### Validation des entrées

- [ ] **Joi** ou **Zod** pour valider TOUTES les entrées utilisateur
- [ ] Validation côté backend (jamais seulement frontend)
- [ ] Whitelist des caractères autorisés
- [ ] Limite de taille des requêtes (10kb max recommandé)
- [ ] Types de données vérifiés (string, number, email, etc.)

### Sanitization

- [ ] **express-mongo-sanitize** installé (protection NoSQL injection)
- [ ] **xss-clean** installé (protection XSS)
- [ ] **hpp** installé (HTTP Parameter Pollution)
- [ ] Données encodées avant affichage (frontend)
- [ ] Pas d'exécution de code dynamique (`eval`, `Function()`)

### Données sensibles

- [ ] Passwords **JAMAIS** retournés dans les réponses API
- [ ] User model avec `.select(false)` sur password
- [ ] Données personnelles (email, tel) chiffrées si nécessaire
- [ ] GDPR compliance : droit à l'oubli implémenté
- [ ] Logs ne contiennent **aucune** donnée sensible

---

## 🌐 SECTION 3 - SÉCURITÉ RÉSEAU

### HTTPS / TLS

- [ ] Certificat SSL/TLS valide (Let's Encrypt gratuit)
- [ ] **TLS 1.3** ou minimum **TLS 1.2**
- [ ] HTTP automatiquement redirigé vers HTTPS
- [ ] **HSTS** activé (Strict-Transport-Security header)
- [ ] Certificat vérifié sur SSL Labs → **A+**

### CORS (Cross-Origin Resource Sharing)

- [ ] **CORS configuré strictement** (pas de wildcard `*` en prod)
- [ ] Liste blanche des origins autorisées
- [ ] Credentials correctement gérés
- [ ] Méthodes HTTP limitées (GET, POST, PUT, DELETE uniquement)
- [ ] Headers autorisés explicitement listés

### Rate Limiting

- [ ] **Rate limiting global** activé (100 req/15min)
- [ ] **Rate limiting auth** plus strict (5 req/15min)
- [ ] Rate limiting sur endpoints sensibles (création, modification)
- [ ] Messages d'erreur appropriés (429 Too Many Requests)
- [ ] Considérer Cloudflare pour protection DDoS avancée

### Headers de sécurité (Helmet.js)

- [ ] **Helmet.js** installé et configuré
- [ ] `X-Frame-Options: SAMEORIGIN` (anti-clickjacking)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Strict-Transport-Security` (HSTS)
- [ ] `Content-Security-Policy` configuré

---

## 🗄️ SECTION 4 - SÉCURITÉ BASE DE DONNÉES

### MongoDB Atlas Configuration

- [ ] **IP Whitelist** : IP fixe VPS uniquement (PAS 0.0.0.0/0)
- [ ] Utilisateur DB avec **permissions minimales** (readWrite seulement)
- [ ] Password DB **fort** (32+ caractères aléatoires)
- [ ] **Encryption at Rest** activée
- [ ] **TLS/SSL** forcé pour connexions
- [ ] Monitoring des accès suspects activé

### Backups

- [ ] **Backup automatique quotidien** configuré
- [ ] Backups testés et vérifiés (restauration)
- [ ] Rétention 30 jours minimum
- [ ] Point-in-time recovery activé (si budget)
- [ ] Plan de disaster recovery documenté

### Queries sécurisées

- [ ] Pas de requêtes dynamiques construites avec input utilisateur
- [ ] **Mongoose schemas** avec validation stricte
- [ ] Indexes sur champs fréquemment interrogés (performance)
- [ ] Pas de données sensibles en clair dans la DB
- [ ] Audit logs pour modifications critiques

---

## 🖥️ SECTION 5 - SÉCURITÉ SERVEUR (VPS)

### Accès SSH

- [ ] **Authentification par clé publique UNIQUEMENT**
- [ ] `PasswordAuthentication no` dans sshd_config
- [ ] `PermitRootLogin no` dans sshd_config
- [ ] Port SSH changé (optionnel mais recommandé)
- [ ] **Fail2ban** installé et configuré
- [ ] SSH accessible uniquement depuis IP autorisée (optionnel)

### Firewall

- [ ] **UFW** (ou iptables) configuré
- [ ] Deny all incoming par défaut
- [ ] Autoriser uniquement : 22 (SSH), 80 (HTTP), 443 (HTTPS)
- [ ] Port 3001 (backend) **NON** exposé publiquement
- [ ] Logs firewall activés

### Utilisateurs & Permissions

- [ ] Application tournée avec **utilisateur non-root**
- [ ] Permissions fichiers restrictives (chmod 600 pour .env)
- [ ] `sudo` requis pour commandes admin
- [ ] Audit des comptes utilisateurs actifs
- [ ] Suppression comptes inutiles

### Mises à jour

- [ ] **Automated security updates** activées
  ```bash
  sudo apt install unattended-upgrades
  ```
- [ ] Dépendances npm à jour (`npm audit fix`)
- [ ] Node.js version LTS récente
- [ ] Système d'exploitation à jour
- [ ] Monitoring des CVE critiques

---

## 📝 SECTION 6 - LOGGING & MONITORING

### Logs d'application

- [ ] **PM2** ou équivalent pour logs centralisés
- [ ] Rotation des logs configurée (max 10MB par fichier)
- [ ] Logs ne contiennent **aucune** donnée sensible
- [ ] Séparation logs error / info / debug
- [ ] Logs horodatés avec timezone

### Monitoring

- [ ] **Uptime monitoring** activé (UptimeRobot, Better Uptime)
- [ ] Alertes configurées (email/SMS) pour :
  - Server down
  - Erreurs 500 répétées
  - Pic CPU/RAM
  - Disque plein
- [ ] Dashboard monitoring accessible
- [ ] Métriques collectées (response time, req/s, etc.)

### Audit

- [ ] Logs d'authentification (login success/fail)
- [ ] Logs des actions sensibles (suppression, modification rôle)
- [ ] IP address loggée pour chaque requête
- [ ] Rétention logs minimum 90 jours
- [ ] Procédure de revue des logs définie

---

## 🚨 SECTION 7 - GESTION DES ERREURS

### Messages d'erreur

- [ ] **Jamais** de stack trace en production
- [ ] Messages génériques pour l'utilisateur ("Erreur serveur")
- [ ] Détails techniques dans logs uniquement
- [ ] Pas de révélation structure DB
- [ ] Codes HTTP appropriés (400, 401, 403, 404, 500)

### Error handling

- [ ] Middleware error handler global
- [ ] Gestion try/catch sur toutes routes async
- [ ] Validation errors interceptés
- [ ] Process crash recovery (PM2 auto-restart)
- [ ] Alerte admin sur erreurs critiques

---

## 🧪 SECTION 8 - TESTS DE SÉCURITÉ

### Tests automatisés

- [ ] `npm audit` exécuté et résolu
  ```bash
  npm audit fix
  ```
- [ ] **Snyk** scan dépendances
  ```bash
  npx snyk test
  ```
- [ ] Tests d'intrusion basiques effectués
- [ ] Scan des secrets dans Git history
  ```bash
  git secrets --scan-history
  ```

### Tests manuels

- [ ] Test injection SQL/NoSQL (échoue ✅)
- [ ] Test XSS (échoué ✅)
- [ ] Test CSRF (échoué ✅)
- [ ] Test rate limiting fonctionnel
- [ ] Test account lockout fonctionnel
- [ ] Test JWT expiration fonctionne
- [ ] Test CORS fonctionne
- [ ] **OWASP ZAP** scan effectué

### Pentest (optionnel mais recommandé)

- [ ] Audit sécurité professionnel commandé
- [ ] Rapport pentest analysé
- [ ] Vulnérabilités corrigées
- [ ] Re-test après corrections

---

## 📦 SECTION 9 - DÉPENDANCES

### npm packages

- [ ] **Aucune** dépendance avec vulnérabilités critiques
- [ ] Dépendances à jour (ou version compatible sécurisée)
- [ ] `package-lock.json` commité
- [ ] Pas de packages non maintenus (>2 ans sans update)
- [ ] Utilisation `npm ci` en production (pas `npm install`)

### Dépendances de sécurité installées

- [ ] `helmet` - Headers sécurisés
- [ ] `express-rate-limit` - Rate limiting
- [ ] `express-mongo-sanitize` - NoSQL injection
- [ ] `xss-clean` - XSS protection
- [ ] `hpp` - HTTP Parameter Pollution
- [ ] `cors` - CORS configuration
- [ ] `bcryptjs` - Password hashing
- [ ] `jsonwebtoken` - JWT
- [ ] `joi` ou `zod` - Validation
- [ ] `dotenv` - Environment variables

---

## 🌍 SECTION 10 - CONFORMITÉ & LEGAL

### RGPD / GDPR

- [ ] Politique de confidentialité publiée
- [ ] Consentement utilisateur pour cookies
- [ ] Droit à l'oubli implémenté (suppression compte)
- [ ] Export données personnelles possible
- [ ] Notification breaches dans 72h (procédure)
- [ ] DPO désigné si applicable

### Légal

- [ ] Conditions d'utilisation (ToS) publiées
- [ ] Mentions légales complètes
- [ ] Contact support visible
- [ ] Procédure de signalement abus
- [ ] Conformité locale (CNIL en France, etc.)

---

## 📊 SECTION 11 - PERFORMANCE & DISPONIBILITÉ

### Optimisation

- [ ] **CDN** configuré pour assets statiques (Cloudflare)
- [ ] Compression gzip/brotli activée
- [ ] Cache headers appropriés
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Bundle JS minifié et optimisé
- [ ] Database queries optimisées (indexes)

### Scalability

- [ ] Application stateless (scalable horizontalement)
- [ ] Sessions dans Redis ou DB (pas en mémoire)
- [ ] Load balancer si multiple serveurs
- [ ] Auto-scaling configuré (si cloud)
- [ ] CDN pour distribuer traffic global

### Availability

- [ ] **SLA** défini (99.9% uptime visé)
- [ ] Monitoring 24/7
- [ ] Health check endpoint (`/health`)
- [ ] Graceful shutdown implémenté
- [ ] Plan de maintenance défini

---

## 🚀 SECTION 12 - DÉPLOIEMENT

### Pre-deployment

- [ ] **Toutes** les sections ci-dessus validées ✅
- [ ] Tests end-to-end passés
- [ ] Staging environment testé
- [ ] Rollback plan documenté
- [ ] Équipe alertée du déploiement

### Deployment

- [ ] Variables d'environnement production configurées
- [ ] .env.production vérifié (aucun secret en clair dans repo)
- [ ] Fichiers build optimisés
- [ ] PM2 ou équivalent configuré (auto-restart)
- [ ] Nginx/Apache configuré correctement
- [ ] SSL certificate valide

### Post-deployment

- [ ] Health check réussi
- [ ] Monitoring actif
- [ ] Logs vérifiés (pas d'erreurs critiques)
- [ ] Tests smoke effectués
- [ ] Performance vérifiée (load test)
- [ ] Documentation à jour

---

## 🎯 SCORE SÉCURITÉ

### Minimum requis pour production

✅ **80%+ des items cochés** = Production acceptable  
✅ **90%+ des items cochés** = Production sécurisée  
✅ **95%+ des items cochés** = Production excellente

❌ **Moins de 80%** = **NE PAS DÉPLOYER**

---

## 🔄 MAINTENANCE CONTINUE

### Hebdomadaire

- [ ] Review logs d'erreurs
- [ ] Vérifier uptime stats
- [ ] `npm audit` execution

### Mensuel

- [ ] Update dépendances (patch versions)
- [ ] Review security alerts GitHub/Snyk
- [ ] Backup test (restauration)
- [ ] Review access logs suspects

### Trimestriel

- [ ] Audit sécurité complet
- [ ] Update dépendances (minor versions)
- [ ] Pentest léger
- [ ] Review politique sécurité

### Annuel

- [ ] Audit sécurité professionnel
- [ ] Review conformité RGPD
- [ ] Update infrastructure (Node.js LTS, etc.)
- [ ] Plan disaster recovery testé

---

## 📞 CONTACTS D'URGENCE

En cas d'incident sécurité :

1. **Isoler** le serveur immédiatement
2. **Analyser** les logs
3. **Contacter** l'équipe sécurité
4. **Documenter** l'incident
5. **Communiquer** aux utilisateurs si nécessaire (RGPD 72h)

---

## ✅ VALIDATION FINALE

**Je certifie avoir vérifié tous les points applicables avant le déploiement en production.**

- **Date** : ******\_******
- **Nom** : ******\_******
- **Signature** : ******\_******

---

**🔒 LA SÉCURITÉ EST UN PROCESSUS CONTINU, PAS UN ÉTAT FINAL**

Cette checklist doit être revue et mise à jour régulièrement.
