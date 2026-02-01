# 🥧 Pi Academy Social

> **Educational platform with gamification and Pi Network integration**

Learn blockchain, earn Pi cryptocurrency, and grow your skills in a gamified social learning environment.

---

## ⚡ GUIDES DE DÉMARRAGE RAPIDE

| Guide                                                                                      | Description                       | Quand l'utiliser             |
| ------------------------------------------------------------------------------------------ | --------------------------------- | ---------------------------- |
| **[QUICK-START.md](QUICK-START.md)**                                                       | 🚀 Démarrage ultra-rapide         | MAINTENANT - Commencez ici   |
| **[DOCUMENTATION-INDEX.md](DOCUMENTATION-INDEX.md)**                                       | 📚 Index complet de la doc        | Navigation globale           |
| **[EXECUTIVE-SUMMARY.md](EXECUTIVE-SUMMARY.md)**                                           | 📊 Vue d'ensemble + Plan d'action | Comprendre le projet complet |
| **[docs/WSL2-SETUP.md](docs/WSL2-SETUP.md)**                                               | 🐧 Installation WSL2              | Dev local (Windows)          |
| **[docs/FRONTEND-BACKEND-INTEGRATION.md](docs/FRONTEND-BACKEND-INTEGRATION.md)**           | 🔗 Connexion Frontend/Backend     | Intégration API              |
| **[backend/SECURITY.md](backend/SECURITY.md)**                                             | 🔐 Sécurisation Backend           | Avant déploiement            |
| **[docs/SECURITY-CHECKLIST.md](docs/SECURITY-CHECKLIST.md)**                               | ✅ 100+ points sécurité           | Avant CHAQUE production      |
| **[.agent/workflows/production-deployment.md](.agent/workflows/production-deployment.md)** | 🏆 Déploiement VPS                | Production ready             |

**🎯 NOUVEAU DÉVELOPPEUR ?** → Commencez par **[QUICK-START.md](QUICK-START.md)**

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)

---

## ✨ Features

- ✅ **6 Educational Courses** - Pi Network, Blockchain, Security, Economy, Trading, DeFi
- ✅ **Interactive Quizzes** - Learn with instant feedback and explanations
- ✅ **Pi Staking** - Earn passive rewards (5%/8%/12% APR for 30/60/90 days)
- ✅ **Social Feed** - Share progress and connect with learners
- ✅ **Virtual Shop** - Purchase items with earned Pi
- ✅ **Premium Subscription** - Unlock exclusive courses (0.01π/month)
- ✅ **Wallet System** - Deposit, withdraw, and manage Pi balance
- ✅ **Leaderboard** - Compete with other pioneers
- ✅ **Profile Customization** - Upload custom profile pictures
- ✅ **Referral System** - Invite friends and earn rewards
- ✅ **Multi-language** - English and French support

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

### Installation

```bash
# Clone or navigate to the project
cd pi-academy-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 📦 Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm run build`        | Build for production                     |
| `npm run preview`      | Preview production build locally         |
| `npm run lint`         | Run ESLint for code quality              |
| `npm run type-check`   | Check TypeScript types without building  |
| `npm run clean`        | Clean build artifacts                    |
| `npm run deploy:build` | Clean and build for deployment           |

---

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.development` for local development:

```bash
cp .env.example .env.development
```

**Key Variables:**

```env
# Pi Network Configuration
VITE_PI_API_KEY=your_pi_api_key          # Get from https://developers.minepi.com
VITE_PI_SANDBOX=true                      # true for testnet, false for mainnet
VITE_USE_MOCK_AUTH=true                   # true for local dev, false for production

# Backend API
VITE_API_URL=http://localhost:3001        # Your backend API URL

# Monitoring (Optional)
VITE_SENTRY_DSN=your_sentry_dsn          # For error tracking
VITE_SENTRY_ENABLED=false                 # Enable in production
```

### Development Mode vs Production Mode

**Development Mode (Mock Auth):**

- Set `VITE_USE_MOCK_AUTH=true`
- No Pi SDK required
- Uses simulated authentication
- Perfect for local testing

**Production Mode (Real Pi SDK):**

- Set `VITE_USE_MOCK_AUTH=false`
- Requires Pi API key
- Real Pi Network authentication
- Real payment processing

---

## 📁 Project Structure

```
pi-academy-app/
├── src/
│   ├── components/          # React components
│   │   └── ErrorBoundary.tsx
│   ├── services/            # Business logic & API
│   │   ├── api.ts          # Backend API client
│   │   ├── piNetwork.ts    # Pi SDK integration
│   │   ├── piPayments.ts   # Pi payment handling
│   │   └── monitoring.ts   # Error tracking
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx             # Main application
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── backend/                # Backend API (Node.js + Express)
│   ├── server.js
│   ├── package.json
│   └── README.md
├── public/                 # Static assets
├── .env.example            # Environment template
├── .env.development        # Development config
├── .env.production         # Production config
├── Dockerfile              # Frontend Docker config
├── docker-compose.yml      # Full stack orchestration
├── nginx.conf              # Nginx configuration
├── ecosystem.config.js     # PM2 configuration
└── package.json
```

---

## 🔌 Backend Integration

This app requires a backend API for production use. An example backend is provided in the `backend/` directory.

**Quick Backend Setup:**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

See [backend/README.md](backend/README.md) for detailed backend documentation.

---

## 🌐 Deployment

### Option 1: Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost
```

### Option 2: VPS with PM2 + Nginx

```bash
# Build frontend
npm run build

# Serve with PM2
pm2 serve dist 3000 --spa --name pi-academy

# Configure Nginx (see nginx.conf)
```

### Option 3: Vercel / Netlify

```bash
# Build
npm run build

# Deploy dist/ folder
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

---

## 🔐 Pi Network Integration

### Authentication Flow

1. User opens app
2. App initializes Pi SDK
3. User authenticates with Pi Network
4. App receives user credentials
5. User can start learning and earning

### Payment Flow

1. User clicks "Upgrade to Premium"
2. App creates payment with Pi SDK
3. Backend approves payment
4. User completes payment in Pi Browser
5. Backend completes payment
6. User receives premium access

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API reference.

---

## 🧪 Testing

### Local Testing (Mock Mode)

```bash
# Start with mock authentication
npm run dev

# Test all features without Pi SDK
```

### Production Testing (Pi Testnet)

1. Set `VITE_PI_SANDBOX=true`
2. Set `VITE_USE_MOCK_AUTH=false`
3. Get testnet API key from Pi Network
4. Test with real Pi SDK on testnet

---

## 📊 Monitoring & Analytics

### Sentry Error Tracking

```bash
# Install Sentry
npm install @sentry/react

# Configure in .env
VITE_SENTRY_DSN=your_sentry_dsn
VITE_SENTRY_ENABLED=true
```

### Google Analytics (Optional)

Add your GA ID to `.env`:

```env
VITE_GA_ID=your_google_analytics_id
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Pi Network Docs**: https://developers.minepi.com
- **Issues**: Create an issue in this repository
- **Email**: support@piacademy.com (if applicable)

---

## 🙏 Acknowledgments

- **Pi Network** - For the amazing blockchain platform
- **React** - For the UI framework
- **Vite** - For the blazing fast build tool
- **Tailwind CSS** - For the utility-first CSS framework

---

**Built with ❤️ for the Pi Network Community**

_Version 2.0.0 - Production Ready_
