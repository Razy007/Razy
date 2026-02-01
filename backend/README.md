# 🥧 Pioneer Academy - Backend API

**Version:** 2.0.0  
**Status:** ✅ Production-Ready (Secure Mode)

## 📋 Overview

Secure backend API for Pioneer Academy - A Pi Network educational platform with staking, quizzes, and social features.

### Key Features

- 🔐 **JWT Authentication** with Pi Network integration
- 🛡️ **KYC Verification** enforcement
- 🚫 **Guest Mode Blocking** for critical operations
- 💰 **Secure Staking** with server-side validation
- 📊 **Transaction History** tracking
- ⚡ **Energy System** management
- 🎓 **XP & Leveling** system

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**See:** `QUICK_START.md` for detailed setup instructions.

## 📚 Documentation

- **Quick Start Guide:** `../QUICK_START.md`
- **Implementation Guide:** `../BACKEND_IMPLEMENTATION_GUIDE.md`
- **Complete Report:** `../BACKEND_IMPLEMENTATION_COMPLETE.md`
- **Security Audit:** `../BACKEND_AUDIT_REPORT.md`

## 🏗️ Architecture

```
src/
├── config/          # Environment & database configuration
├── middlewares/     # Auth, KYC, and security middlewares
├── models/          # Mongoose schemas (User, Staking, Transaction)
├── routes/          # API endpoints
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── server.ts        # Application entry point
```

## 🔒 Security Features

### Triple-Layer Protection

1. **Authentication** - JWT token verification
2. **Authorization** - KYC status + role checking
3. **Validation** - Server-side business logic enforcement

### Middleware Stack

```typescript
// Example: Staking endpoint protection
router.post(
  "/staking",
  requireAuth, // ✅ Valid JWT required
  requireKyc, // ✅ KYC verified required
  blockGuest, // ✅ No guest access
  createStake // ✅ Server validates amount & balance
);
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint            | Auth | Description           |
| ------ | ------------------- | ---- | --------------------- |
| POST   | `/api/auth/pi`      | -    | Login with Pi Network |
| POST   | `/api/auth/guest`   | -    | Guest mode (demo)     |
| GET    | `/api/auth/me`      | ✅   | Get user profile      |
| POST   | `/api/auth/refresh` | ✅   | Refresh JWT token     |

### Staking

| Method | Endpoint                    | Auth | KYC | Description    |
| ------ | --------------------------- | ---- | --- | -------------- |
| POST   | `/api/staking`              | ✅   | ✅  | Create stake   |
| GET    | `/api/staking`              | ✅   | -   | List stakes    |
| GET    | `/api/staking/stats`        | ✅   | -   | Get statistics |
| POST   | `/api/staking/:id/complete` | ✅   | ✅  | Complete stake |
| POST   | `/api/staking/:id/cancel`   | ✅   | ✅  | Cancel stake   |

### Utilities

| Method | Endpoint  | Description     |
| ------ | --------- | --------------- |
| GET    | `/health` | Health check    |
| GET    | `/`       | API information |

## 🔧 Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pi-academy

# Security
JWT_SECRET=your_secret_here_min_32_chars
JWT_EXPIRES_IN=7d

# Pi Network
PI_API_KEY=your_pi_api_key
PI_SANDBOX=true

# CORS
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing

### Health Check

```bash
curl http://localhost:3001/health
```

### Guest Login

```bash
curl -X POST http://localhost:3001/api/auth/guest
```

### Protected Endpoint (should fail for guests)

```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 10, "period": 30}' \
  http://localhost:3001/api/staking
```

Expected: `403 Forbidden - GUEST_RESTRICTED`

## 📊 Database Models

### User

- Authentication (Pi ID, username, role)
- KYC status
- Balances (Pi, Energy, Staking)
- Progress (Level, XP, Streak)

### Staking

- Amount, Period, APY
- Start/End dates
- Status (active, completed, cancelled)
- Reward calculation

### Transaction

- Type (quiz, staking, purchase, withdrawal)
- Amount, Energy
- Status, Metadata
- Timestamp

## 🛠️ Development

### Scripts

```bash
npm run dev      # Development with hot-reload
npm run build    # Compile TypeScript
npm run watch    # Watch mode compilation
npm run clean    # Remove dist folder
npm start        # Production server
```

### TypeScript

- Strict mode enabled
- Type-safe models with Mongoose
- Custom error classes
- Zod validation schemas

## 🚀 Deployment

### Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- Environment variables configured

### Production Checklist

- [ ] Generate strong JWT_SECRET (64+ chars)
- [ ] Configure MongoDB Atlas or production DB
- [ ] Set NODE_ENV=production
- [ ] Configure CORS with production frontend URL
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Test all critical endpoints

### Deploy to Heroku

```bash
heroku create pi-academy-backend
heroku addons:create mongolab:sandbox
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your_secret>
git push heroku main
```

## 📈 Performance

- **Rate Limiting:** 100 requests per 15 minutes
- **Body Size Limit:** 10MB
- **Connection Pooling:** MongoDB automatic
- **Graceful Shutdown:** SIGINT/SIGTERM handlers

## 🐛 Troubleshooting

### MongoDB Connection Failed

```bash
# Check MongoDB is running
mongod

# Verify URI in .env
echo $MONGODB_URI
```

### Port Already in Use

```bash
# Change port in .env
PORT=3002
```

### TypeScript Errors

```bash
# Clean and rebuild
npm run clean
npm run build
```

## 📝 License

MIT License - Pioneer Academy Team

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📞 Support

- **Documentation:** See `../BACKEND_IMPLEMENTATION_GUIDE.md`
- **Issues:** Check troubleshooting section
- **Questions:** Review API documentation

---

**Built with ❤️ for the Pi Network Community**
