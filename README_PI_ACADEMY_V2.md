# 🎓 PIONEER ACADEMY v2.0 - Plateforme Éducative Pi Network

[![Pi Network](https://img.shields.io/badge/Pi%20Network-Compatible-purple)](https://minepi.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-green)](CHANGELOG.md)

> Plateforme éducative de nouvelle génération pour l'écosystème Pi Network avec contenus multimédias enrichis, simulations interactives, et système de mise à jour automatique.

---

## 🌟 Nouveautés v2.0

### 🎬 Contenu Multimédia Enrichi
- **Vidéos HD** avec sous-titres multi-langues (FR/EN/ES)
- **Simulations Interactives** (wallet practice, smart contract deployment)
- **Cas Pratiques Réels** avec données d'entreprises vérifiables
- **Code Sandboxes** intégrés avec tests automatisés
- **Practice Labs** guidés step-by-step

### 🔄 Mise à Jour Automatique
- **CMS Headless** (Strapi) pour gestion contenu
- **Sync temps réel** via webhooks
- **Cache intelligent** avec invalidation automatique
- **Versioning contenu** avec rollback support

### 🏆 Système de Rétention
- **15+ Achievements** avec badges et titres
- **Learning Streaks** avec milestones et récompenses
- **Learning Paths personnalisés** adaptés au profil utilisateur
- **Progress Analytics** détaillées (weekly/monthly)
- **Gamification** complète (XP, niveaux, récompenses)

### ✅ Corrections Critiques
- ✅ **Blocage Discovery → Skills Analysis** résolu (système `completedLayers`)
- ✅ **Violations Pi Network** éliminées (17 corrections dans shopProducts.ts)
- ✅ **Performance** optimisée (cache Redis, CDN)
- ✅ **Conformité 100%** guidelines Pi Network Core Team

---

## 📁 Structure du Projet

```
pi-academy-production/
├── backend/                          # API Node.js + TypeScript
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── User.ts           # ✅ MODIFIÉ (completedLayers)
│   │   │   │   ├── CourseContent.ts  # 🆕 NOUVEAU (système enrichi)
│   │   │   │   └── UserEngagement.ts # 🆕 NOUVEAU (achievements)
│   │   │   └── ...
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   └── UserRepository.ts # ✅ MODIFIÉ (JSONB support)
│   │   │   ├── services/
│   │   │   │   ├── EducationService.ts     # ✅ MODIFIÉ (completeLayer)
│   │   │   │   ├── ContentUpdateService.ts # 🆕 NOUVEAU (auto-sync)
│   │   │   │   └── AchievementService.ts   # 🆕 NOUVEAU (gamification)
│   │   │   └── ...
│   │   ├── presentation/
│   │   │   ├── controllers/
│   │   │   │   ├── EducationController.ts # ✅ MODIFIÉ (/progress endpoint)
│   │   │   │   └── UserController.ts      # ✅ MODIFIÉ (completedLayers)
│   │   │   ├── routes/
│   │   │   │   ├── education.routes.ts    # ✅ MODIFIÉ (POST /progress)
│   │   │   │   └── webhook.routes.ts      # 🆕 NOUVEAU (CMS webhooks)
│   │   │   └── ...
│   │   └── data/
│   │       └── enrichedCourseExamples.ts  # 🆕 NOUVEAU (exemples complets)
│   ├── migrations/
│   │   └── add_completed_layers.sql       # 🆕 CRITIQUE (migration DB)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example                       # 🆕 NOUVEAU (template env vars)
│
├── frontend/                         # React + TypeScript + Vite
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.tsx       # ✅ MODIFIÉ (completedLayers sync)
│   │   ├── data/
│   │   │   └── shopProducts.ts       # ✅ RÉÉCRIT (553→173 lignes, conformité)
│   │   ├── pages/
│   │   │   ├── ShopPage.tsx          # ✅ MODIFIÉ (nouveaux produits)
│   │   │   └── SkillsAnalysisPage.tsx # (fonctionnel avec completedLayers)
│   │   └── ...
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example                  # 🆕 NOUVEAU
│
├── docs/                             # 🆕 DOCUMENTATION COMPLÈTE
│   ├── GUIDE_SYSTEME_CONTENU_ENRICHI.md  # Architecture système enrichi
│   ├── GUIDE_CREATEUR_CONTENU.md         # Guide créateurs (2h/layer)
│   ├── ACTION_DEPLOIEMENT.md             # Guide déploiement express
│   ├── GUIDE_DEPLOIEMENT_PRODUCTION.md   # Config Nginx/SSL/PM2
│   ├── CORRECTIONS_MAJEURES.md           # Détails corrections
│   ├── PI_NETWORK_COMPLIANCE.md          # Audit conformité
│   └── README_DEPLOYMENT.md              # Récapitulatif déploiement
│
├── scripts/                          # 🆕 SCRIPTS DÉPLOIEMENT
│   ├── deploy.sh                     # Script Bash automatique
│   ├── deploy.ps1                    # Script PowerShell Windows
│   └── DEPLOY_TO_PRODUCTION.ps1      # Script complet avec backup
│
├── .gitignore
├── README.md                         # 🆕 CE FICHIER
└── LICENSE

```

---

## 🚀 Installation & Déploiement

### Prérequis

- **Node.js** 18+ (LTS)
- **PostgreSQL** 15+
- **Redis** 7+
- **MongoDB** 6+ (optionnel, pour analytics)
- **Nginx** 1.21+ (production)
- **PM2** 5+ (process manager)
- **Git** 2.30+

### Déploiement Express (10 minutes)

#### Option A: Script Automatique (Recommandé)

**Windows PowerShell:**
```powershell
# 1. Exécuter script de déploiement
.\DEPLOY_TO_PRODUCTION.ps1

# 2. Le script va:
#    - Copier l'application vers C:\Users\lenovo\.gemini\antigravity\pi-academy-production
#    - Créer templates .env
#    - Afficher récapitulatif

# 3. Configurer .env (voir section Configuration ci-dessous)

# 4. SSH vers serveur et continuer avec étapes manuelles
```

**Linux/Mac Bash:**
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Option B: Déploiement Manuel

**1. Migration SQL (CRITIQUE - 30 secondes)**
```bash
ssh your_user@pioneeracademy.academy
cd /var/www/pi-academy
psql -U postgres -d pi_academy -f backend/migrations/add_completed_layers.sql

# Vérification
psql -U postgres -d pi_academy -c "SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='completed_layers';"
# Doit afficher: completed_layers
```

**2. Upload Builds (2 minutes)**
```bash
# Depuis machine locale
scp -r backend/dist your_user@pioneeracademy.academy:/var/www/pi-academy/backend/
scp -r frontend/dist your_user@pioneeracademy.academy:/var/www/pi-academy/frontend/
```

**3. Installer Dépendances Backend**
```bash
ssh your_user@pioneeracademy.academy
cd /var/www/pi-academy/backend
npm install --production
```

**4. Redémarrer Services**
```bash
pm2 restart pi-academy-api
pm2 restart pi-academy-frontend
pm2 logs --lines 50
```

---

## ⚙️ Configuration

### Backend `.env`

```bash
# Database PostgreSQL
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/pi_academy
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=pi_academy
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD

# MongoDB (optionnel)
MONGODB_URI=mongodb://localhost:27017/pi_academy_content

# Redis Cache
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secret (GÉNÉRER UN SECRET FORT!)
JWT_SECRET=GENERATE_WITH_openssl_rand_base64_32
JWT_EXPIRES_IN=7d

# Pi Network SDK
PI_API_KEY=YOUR_PI_API_KEY_FROM_DEVELOPER_PORTAL
PI_WALLET_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
PI_SANDBOX_MODE=false

# Stellar Network
STELLAR_NETWORK=mainnet
STELLAR_HORIZON_URL=https://api.mainnet.minepi.com

# Server
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://pioneeracademy.academy

# Content Management System (Strapi)
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=YOUR_STRAPI_API_TOKEN
CONTENT_SYNC_INTERVAL=300000      # 5 minutes
CONTENT_AUTO_PUBLISH=false        # Manuel review recommandé
CONTENT_CACHE_TTL=3600            # 1 heure

# Webhook Secret (pour CMS → Backend)
WEBHOOK_SECRET=GENERATE_RANDOM_SECRET_HERE

# Logs
LOG_LEVEL=info
LOG_FILE=/var/log/pi-academy/backend.log
```

**Générer secrets sécurisés:**
```bash
# JWT_SECRET
openssl rand -base64 32

# WEBHOOK_SECRET
openssl rand -hex 32
```

### Frontend `.env`

```bash
# API Backend
VITE_API_URL=https://pioneeracademy.academy/api

# Pi Network SDK
VITE_PI_SANDBOX=false
VITE_PI_API_KEY=YOUR_PI_API_KEY

# Application
VITE_APP_NAME=Pioneer Academy
VITE_APP_VERSION=2.0.0

# Content CDN
VITE_CDN_URL=https://cdn.pioneeracademy.academy
VITE_VIDEO_PROVIDER=vimeo

# Feature Flags
VITE_ENABLE_VIDEO_COURSES=true
VITE_ENABLE_INTERACTIVE_LABS=true
VITE_ENABLE_LIVE_CONTENT_UPDATES=true

# Analytics (optionnel)
VITE_GOOGLE_ANALYTICS=
VITE_MIXPANEL_TOKEN=
```

---

## 🧪 Tests Validation

### Tests Pi Browser (Après Déploiement)

**Test 1: Discovery Fonctionnel ✅**
```
1. Ouvrir Pi Browser → https://pioneeracademy.academy
2. Login avec compte Pi
3. Accéder: Courses → "Découverte: Qu'est-ce que Pi Network?"
4. Compléter Layer 1
5. Vérifier: Notification "+50 XP" affichée
6. Console browser: localStorage.getItem('pi_user')
7. Chercher: "completedLayers": {"pi-intro-101": ["pi-intro-101-l1"]}
```

**Test 2: Skills Analysis Accessible ✅**
```
1. Après avoir complété 1+ layer
2. Sidebar → Cliquer "Analyse des compétences"
3. Page doit charger sans erreur
4. Graphique radar doit afficher progression > 0%
5. Section "Cours Recommandés" doit afficher suggestions
```

**Test 3: Boutique Conforme Pi Network ✅**
```
1. Accéder: Shop Page
2. Vérifier produits affichés:
   ✅ Prix en π uniquement (pas USD)
   ✅ "Recharge Énergie +50⚡ (Max 5/jour)"
   ✅ "Focus XP 1h +30%" (pas +300% ou +500%)
   ✅ "Retry Immédiat (Max 3/jour)"
   ❌ PAS de "Unlock Token" bypass progression
   ❌ PAS de "Énergie Illimitée 24h"
3. Tester achat: Click "Acheter" → Pi SDK payment flow
```

**Test 4: Système Achievements**
```
1. Compléter 1er layer → Achievement "Premier Pas" débloqué
2. Vérifier notification affichée
3. Profile → Section Achievements → Badge visible
4. Vérifier récompenses appliquées (+10 XP, +0.0001 π)
```

**Test 5: Learning Streak**
```
1. Login aujourd'hui → Streak = 1
2. Console: Check user.streak
3. Revenir demain → Streak = 2
4. Milestone 3 jours → Vérifier récompense (+30 XP)
```

---

## 📊 Monitoring & Maintenance

### Logs à Surveiller

```bash
# Backend logs
pm2 logs pi-academy-api --lines 100

# Nginx access logs
tail -f /var/log/nginx/pioneeracademy.academy-access.log

# Nginx error logs
tail -f /var/log/nginx/pioneeracademy.academy-error.log

# PostgreSQL logs
tail -f /var/log/postgresql/postgresql-15-main.log

# Redis logs
tail -f /var/log/redis/redis-server.log
```

### Métriques Clés

| Métrique | Target | Alert si |
|----------|--------|----------|
| **API Response Time** | <200ms p95 | >500ms |
| **Database Query Time** | <50ms avg | >100ms |
| **Cache Hit Rate** | >80% | <60% |
| **Error Rate** | <0.1% | >1% |
| **Uptime** | 99.9% | <99% |

### Backup Automatique

```bash
# Crontab: Backup PostgreSQL quotidien 3h du matin
0 3 * * * pg_dump -U postgres pi_academy | gzip > /backups/pi_academy_$(date +\%Y\%m\%d).sql.gz

# Rotation backups (garder 30 jours)
0 4 * * * find /backups -name "pi_academy_*.sql.gz" -mtime +30 -delete
```

---

## 🎓 Documentation Complète

### Guides Disponibles

1. **[GUIDE_SYSTEME_CONTENU_ENRICHI.md](docs/GUIDE_SYSTEME_CONTENU_ENRICHI.md)**
   - Architecture système complet
   - Types de contenu (vidéo, simulation, cas pratiques)
   - Intégration CMS (Strapi)
   - Système de rétention (achievements, streaks)
   - Best practices performance

2. **[GUIDE_CREATEUR_CONTENU.md](docs/GUIDE_CREATEUR_CONTENU.md)**
   - Créer un layer en 2h (checklist rapide)
   - Templates prêts à l'emploi
   - Standards vidéo (équipement, tournage)
   - Standards simulations interactives
   - Publication workflow Strapi

3. **[ACTION_DEPLOIEMENT.md](docs/ACTION_DEPLOIEMENT.md)**
   - Guide express 10 minutes
   - Tests Pi Browser détaillés
   - Problèmes courants + solutions
   - Checklist finale avant soumission Core Team

4. **[GUIDE_DEPLOIEMENT_PRODUCTION.md](docs/GUIDE_DEPLOIEMENT_PRODUCTION.md)**
   - Configuration Nginx complète
   - SSL Let's Encrypt
   - PM2 ecosystem.config.js
   - Variables environnement
   - Monitoring & troubleshooting

5. **[CORRECTIONS_MAJEURES.md](docs/CORRECTIONS_MAJEURES.md)**
   - Problème Discovery → Skills Analysis (détails techniques)
   - Logique économique avant/après
   - Structure completedLayers
   - Endpoints API modifiés
   - Troubleshooting

6. **[PI_NETWORK_COMPLIANCE.md](docs/PI_NETWORK_COMPLIANCE.md)**
   - Checklist conformité (12 critères)
   - 17 violations corrigées (avant/après code)
   - Métriques conformité
   - Points d'audit
   - Déclaration conformité signée

---

## 🤝 Contribution

### Équipe Core

- **Lead Developer:** [Votre Nom]
- **Content Director:** [À définir]
- **QA Engineer:** [À définir]

### Comment Contribuer

1. Fork le projet
2. Créer feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Guidelines Contribution

- **Code:** TypeScript strict mode, ESLint + Prettier
- **Commits:** Conventional commits (`feat:`, `fix:`, `docs:`)
- **Tests:** Coverage >80% pour nouvelles features
- **Documentation:** Toute feature doit être documentée

---

## 📜 License

MIT License - voir [LICENSE](LICENSE) pour détails.

---

## 🙏 Remerciements

- **Pi Core Team** pour leur vision et support
- **Communauté Pioneers** pour leurs retours précieux
- **Contributors** qui ont rendu ce projet possible

---

## 📞 Support

**Questions? Problèmes?**

- **GitHub Issues:** [github.com/votre-repo/issues](https://github.com/Razy007/Razy/issues)
- **Email:** support@pioneeracademy.academy
- **Discord:** [discord.gg/pioneeracademy](https://discord.gg/pioneeracademy)
- **Documentation:** [docs.pioneeracademy.academy](https://docs.pioneeracademy.academy)

---

## 🗺️ Roadmap

### Q1 2026 (En Cours)
- [x] Système de contenu enrichi (vidéos, simulations)
- [x] Mise à jour automatique (CMS headless)
- [x] Achievements & gamification
- [ ] Certification blockchain vérifiable
- [ ] Marketplace de cours (créateurs tiers)

### Q2 2026
- [ ] Mobile apps natives (iOS/Android)
- [ ] Live streaming cours en direct
- [ ] Peer-to-peer mentoring
- [ ] AI-powered learning paths

### Q3 2026
- [ ] Multi-chain support (Ethereum, Solana)
- [ ] NFT certificates
- [ ] DAO governance
- [ ] Revenue sharing pour créateurs

---

**Construisons ensemble l'avenir de l'éducation décentralisée! 🚀**

---

**Version:** 2.0.0  
**Dernière Mise à Jour:** 2026-01-14  
**Auteur:** Pioneer Academy Team
