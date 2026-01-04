# 🔐 GUIDE SÉCURITÉ - PIONEER ACADEMY BACKEND

## 🎯 OBJECTIF

Sécuriser l'API backend selon les standards de l'industrie.

---

## 📦 DÉPENDANCES SÉCURITÉ À INSTALLER

```bash
npm install --save helmet express-rate-limit express-mongo-sanitize xss-clean hpp cors dotenv bcryptjs jsonwebtoken joi
```

### Description des packages

| Package                  | Fonction                            |
| ------------------------ | ----------------------------------- |
| `helmet`                 | Headers HTTP sécurisés              |
| `express-rate-limit`     | Protection contre brute force       |
| `express-mongo-sanitize` | Protection injection NoSQL          |
| `xss-clean`              | Protection XSS                      |
| `hpp`                    | Protection HTTP Parameter Pollution |
| `cors`                   | Configuration CORS stricte          |
| `joi`                    | Validation données entrées          |
| `bcryptjs`               | Hash passwords sécurisé             |
| `jsonwebtoken`           | JWT authentication                  |

---

## 🛡️ CONFIGURATION SÉCURITÉ COMPLÈTE

### 1. Variables d'environnement (.env)

```env
# Environment
NODE_ENV=production

# Server
PORT=3001
API_URL=https://pioneer-academy.com

# MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pioneer?retryWrites=true&w=majority

# JWT Secrets (GÉNÉRER AVEC: openssl rand -base64 32)
JWT_SECRET=votre-secret-super-fort-minimum-32-caracteres
JWT_REFRESH_SECRET=autre-secret-différent-minimum-32-caracteres
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS
ALLOWED_ORIGINS=https://pioneer-academy.com,https://www.pioneer-academy.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=3600000

# Pi Network
PI_API_KEY=your-pi-network-api-key
PI_API_SECRET=your-pi-network-api-secret
```

### 2. Middleware de sécurité (server.js ou app.js)

```javascript
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const app = express();

// ════════════════════════════════════════════════════════
// 🔒 SECURITY MIDDLEWARE
// ════════════════════════════════════════════════════════

// 1. Helmet - Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// 2. CORS - Strict configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Rate Limiting - General
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// 4. Rate Limiting - Auth endpoints (plus strict)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives
  message: "Trop de tentatives de connexion, compte temporairement verrouillé.",
  skipSuccessfulRequests: true,
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// 5. Body parser
app.use(express.json({ limit: "10kb" })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 6. Data sanitization against NoSQL injection
app.use(mongoSanitize());

// 7. Data sanitization against XSS
app.use(xss());

// 8. Prevent HTTP Parameter Pollution
app.use(
  hpp({
    whitelist: ["status", "sort", "page", "limit"], // Allow these params to be duplicated
  })
);

// 9. Request logging (production)
if (process.env.NODE_ENV === "production") {
  const morgan = require("morgan");
  app.use(morgan("combined"));
}

// ════════════════════════════════════════════════════════
// 🔐 AUTHENTICATION MIDDLEWARE
// ════════════════════════════════════════════════════════

const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé - Token manquant",
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check if user still exists
    const User = require("./models/User");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // 5. Check if user changed password after token was issued
    if (
      user.passwordChangedAt &&
      decoded.iat < user.passwordChangedAt.getTime() / 1000
    ) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe récemment changé, veuillez vous reconnecter",
      });
    }

    // 6. Grant access
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré",
    });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé pour cette action",
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
```

### 3. Modèle User sécurisé

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email requis"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email invalide"],
    },
    password: {
      type: String,
      required: [true, "Mot de passe requis"],
      minlength: [8, "Mot de passe minimum 8 caractères"],
      select: false, // Ne jamais inclure le password dans les queries par défaut
    },
    role: {
      type: String,
      enum: ["user", "premium", "admin"],
      default: "user",
    },
    kycStatus: {
      type: String,
      enum: ["none", "pending", "verified", "rejected"],
      default: "none",
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
    piWallet: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ════════════════════════════════════════════════════════
// 🔐 PASSWORD HASHING
// ════════════════════════════════════════════════════════

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash if password is modified
  if (!this.isModified("password")) return next();

  // Hash with cost of 12
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Update passwordChangedAt when password is modified
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // -1s pour éviter problème timing JWT
  next();
});

// ════════════════════════════════════════════════════════
// 🔒 METHODS
// ════════════════════════════════════════════════════════

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "15m",
  });
};

// Generate refresh token
userSchema.methods.getRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  });
};

// Account lock logic
userSchema.methods.incLoginAttempts = function () {
  // If lock expired, reset attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  // Increment attempts
  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after max attempts
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
  if (this.loginAttempts + 1 >= maxAttempts && !this.lockUntil) {
    updates.$set = {
      lockUntil: Date.now() + parseInt(process.env.LOCK_TIME) || 3600000, // 1 hour
    };
  }

  return this.updateOne(updates);
};

// Reset login attempts on success
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

// Check if account is locked
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

module.exports = mongoose.model("User", userSchema);
```

### 4. Validation avec Joi

```javascript
const Joi = require("joi");

// Register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email invalide",
      "any.required": "Email requis",
    }),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.min": "Mot de passe minimum 8 caractères",
        "string.pattern.base":
          "Mot de passe doit contenir: majuscule, minuscule, chiffre, caractère spécial",
        "any.required": "Mot de passe requis",
      }),
    username: Joi.string().alphanum().min(3).max(30).required(),
  });

  return schema.validate(data);
};

// Login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
};
```

---

## 🧪 TESTS SÉCURITÉ

### Test d'intrusion basique

```bash
# Test rate limiting
for i in {1..110}; do curl -X POST http://localhost:3001/api/test; done

# Test injection NoSQL
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": {"$gt": ""}, "password": "test"}'

# Test XSS
curl -X POST http://localhost:3001/api/test \
  -H "Content-Type: application/json" \
  -d '{"name": "<script>alert(1)</script>"}'
```

### Outils de scan sécurité

```bash
# OWASP ZAP (scanner vulnérabilités)
npm install -g zaproxy

# Snyk (scan dépendances)
npm install -g snyk
snyk test

# npm audit
npm audit
npm audit fix
```

---

## ✅ CHECKLIST SÉCURITÉ

### Avant chaque déploiement

- [ ] Toutes les variables sensibles dans .env
- [ ] .env dans .gitignore
- [ ] Dépendances à jour (npm audit)
- [ ] Rate limiting activé
- [ ] CORS configuré strictement
- [ ] Helmet activé
- [ ] Validation Joi sur toutes les entrées
- [ ] XSS protection active
- [ ] NoSQL injection protection active
- [ ] HTTPS forcé (production)
- [ ] JWT expiration courte
- [ ] Passwords hashés (bcrypt rounds ≥ 12)
- [ ] Account lockout après tentatives échouées
- [ ] Logs d'erreurs ne révèlent pas d'infos sensibles
- [ ] MongoDB IP whitelist configuré

---

## 🚨 GESTION DES ERREURS SÉCURISÉE

```javascript
// Error handler middleware (TOUJOURS en dernier)
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Ne JAMAIS envoyer le stack trace en production
  const response = {
    success: false,
    message: err.message || "Erreur serveur",
  };

  // En développement, ajouter plus d'infos
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(err.statusCode || 500).json(response);
});
```

---

## 📚 RESSOURCES

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

**🔐 LA SÉCURITÉ N'EST PAS UNE OPTION, C'EST UNE NÉCESSITÉ**
