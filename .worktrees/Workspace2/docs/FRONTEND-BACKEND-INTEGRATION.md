# 🔗 GUIDE INTÉGRATION FRONTEND ↔ BACKEND - PIONEER ACADEMY

## 🎯 OBJECTIF

Connecter le frontend React (Vite) au backend Node.js + MongoDB Atlas pour une application full-stack opérationnelle.

---

## 📊 ARCHITECTURE

```
┌──────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE COMPLÈTE                      │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  [Frontend React]                                              │
│  http://localhost:5173                                         │
│       │                                                        │
│       │ HTTP Requests (axios)                                 │
│       ↓                                                        │
│  [Backend Node.js + Express]                                   │
│  http://localhost:3001/api                                     │
│       │                                                        │
│       │ Mongoose ODM                                          │
│       ↓                                                        │
│  [MongoDB Atlas]                                               │
│  cluster0.xxxxx.mongodb.net                                   │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## ⚙️ CONFIGURATION

### 1. Configuration Backend (.env)

**Fichier** : `backend/.env`

```env
# Server
NODE_ENV=development
PORT=3001

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pioneer?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_REFRESH_SECRET=another-different-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS - Autoriser le frontend
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# Pi Network
PI_API_KEY=your-pi-api-key
PI_API_SECRET=your-pi-api-secret
```

### 2. Configuration Frontend (.env)

**Fichier** : `frontend/.env`

```env
# API Backend URL
VITE_API_URL=http://localhost:3001/api

# Pi Network
VITE_PI_API_KEY=your-pi-api-key
```

### 3. CORS Backend (server.js)

```javascript
const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

---

## 🔌 SERVICE API (FRONTEND)

### Structure recommandée

```
frontend/
├── src/
│   ├── services/
│   │   ├── api.js           # Configuration axios
│   │   ├── authService.js   # Auth endpoints
│   │   ├── userService.js   # User endpoints
│   │   ├── courseService.js # Course endpoints
│   │   └── referralService.js # Referral endpoints
│   └── ...
```

### Fichier: `frontend/src/services/api.js`

```javascript
import axios from "axios";

// Base URL depuis .env
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Instance axios configurée
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Pour les cookies si utilisés
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si 401 et pas déjà retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentative refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        // Sauvegarder nouveau token
        localStorage.setItem("token", data.token);

        // Retry requête originale
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh échoué → logout
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 AUTH SERVICE

### Fichier: `frontend/src/services/authService.js`

```javascript
import api from "./api";

export const authService = {
  // Register
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  },

  // Login
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return response.data;
  },

  // Logout
  async logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await api.post("/auth/refresh", { refreshToken });
    localStorage.setItem("token", response.data.token);
    return response.data;
  },
};
```

---

## 👤 USER SERVICE

### Fichier: `frontend/src/services/userService.js`

```javascript
import api from "./api";

export const userService = {
  // Get user profile
  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Update profile
  async updateProfile(userData) {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },

  // Get user stats
  async getStats() {
    const response = await api.get("/users/stats");
    return response.data;
  },

  // Link Pi Wallet
  async linkPiWallet(walletAddress) {
    const response = await api.post("/users/link-pi-wallet", {
      walletAddress,
    });
    return response.data;
  },

  // Get user progress
  async getProgress() {
    const response = await api.get("/users/progress");
    return response.data;
  },
};
```

---

## 📚 COURSE SERVICE

### Fichier: `frontend/src/services/courseService.js`

```javascript
import api from "./api";

export const courseService = {
  // Get all courses
  async getCourses() {
    const response = await api.get("/courses");
    return response.data;
  },

  // Get single course
  async getCourse(courseId) {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },

  // Submit quiz
  async submitQuiz(courseId, answers) {
    const response = await api.post(`/courses/${courseId}/quiz`, {
      answers,
    });
    return response.data;
  },

  // Mark lesson complete
  async completeLesson(courseId, lessonId) {
    const response = await api.post(
      `/courses/${courseId}/lessons/${lessonId}/complete`
    );
    return response.data;
  },

  // Get user course progress
  async getCourseProgress(courseId) {
    const response = await api.get(`/courses/${courseId}/progress`);
    return response.data;
  },
};
```

---

## 🔗 REFERRAL SERVICE

### Fichier: `frontend/src/services/referralService.js`

```javascript
import api from "./api";

export const referralService = {
  // Get referral code
  async getReferralCode() {
    const response = await api.get("/referrals/code");
    return response.data;
  },

  // Get referral stats
  async getStats() {
    const response = await api.get("/referrals/stats");
    return response.data;
  },

  // Get referred users
  async getReferredUsers() {
    const response = await api.get("/referrals/referred-users");
    return response.data;
  },

  // Apply referral code (à l'inscription)
  async applyReferralCode(code) {
    const response = await api.post("/referrals/apply", { code });
    return response.data;
  },
};
```

---

## 🎨 UTILISATION DANS LES COMPOSANTS

### Exemple: Login Component

```jsx
import { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      console.log("Login success:", data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
```

### Exemple: User Stats Component

```jsx
import { useEffect, useState } from "react";
import { userService } from "../services/userService";

export default function UserStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await userService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (!stats) return <div>Erreur de chargement</div>;

  return (
    <div className="stats">
      <h2>Mes Statistiques</h2>
      <p>XP: {stats.xp}</p>
      <p>Pi: {stats.piBalance}</p>
      <p>Niveau: {stats.level}</p>
      <p>
        Cours complétés: {stats.completedCourses}/{stats.totalCourses}
      </p>
    </div>
  );
}
```

---

## 🛡️ PROTECTED ROUTES

### Fichier: `frontend/src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function ProtectedRoute({ children, requireKYC = false }) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier KYC si requis
  if (requireKYC) {
    // Logique pour vérifier le statut KYC
    // const user = ... récupérer user
    // if (user.kycStatus !== 'verified') {
    //   return <Navigate to="/kyc-required" replace />;
    // }
  }

  return children;
}
```

### Utilisation dans Routes

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PremiumFeature from "./pages/PremiumFeature";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/premium"
          element={
            <ProtectedRoute requireKYC={true}>
              <PremiumFeature />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🔄 GESTION D'ÉTAT (Context API)

### Fichier: `frontend/src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger l'utilisateur au montage
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Error loading user:", error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

### Utilisation dans App.jsx

```jsx
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>{/* Routes */}</BrowserRouter>
    </AuthProvider>
  );
}
```

---

## 🧪 TESTS DE CONNEXION

### Test 1: Backend accessible

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Devrait afficher:
# 🚀 Server running on port 3001
# ✅ MongoDB Connected
```

### Test 2: Endpoint API

```bash
# Dans un nouveau terminal
curl http://localhost:3001/api/health

# Réponse attendue:
# {"status":"ok","timestamp":"2025-12-28T..."}
```

### Test 3: Frontend → Backend

```javascript
// Dans la console du navigateur (http://localhost:5173)
fetch("http://localhost:3001/api/health")
  .then((r) => r.json())
  .then(console.log);

// Devrait afficher:
// {status: "ok", timestamp: "..."}
```

---

## 🐛 TROUBLESHOOTING

### Problème: CORS Error

**Erreur** : `Access to XMLHttpRequest blocked by CORS policy`

**Solution** :

1. Vérifier `ALLOWED_ORIGINS` dans `.env` backend
2. Vérifier que frontend tourne sur port listé
3. Vérifier `cors()` middleware activé

### Problème: 401 Unauthorized

**Causes possibles** :

- Token expiré
- Token invalide
- Middleware `protect` mal configuré

**Solution** :

```javascript
// Vérifier token dans localStorage
console.log(localStorage.getItem("token"));

// Tester sans auth d'abord
api.get("/public/endpoint"); // endpoint public
```

### Problème: Network Error

**Causes** :

- Backend pas lancé
- URL incorrecte
- Firewall bloque

**Solution** :

```bash
# Vérifier backend up
curl http://localhost:3001/api/health

# Vérifier .env frontend
cat frontend/.env
# VITE_API_URL=http://localhost:3001/api
```

---

## 📊 MONITORING INTÉGRATION

### Logs Backend

```javascript
// Middleware logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});
```

### Logs Frontend (dev)

```javascript
// Dans api.js interceptor
api.interceptors.request.use((config) => {
  console.log("API Request:", config.method.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use((response) => {
  console.log("API Response:", response.status, response.config.url);
  return response;
});
```

---

## ✅ CHECKLIST INTÉGRATION

- [ ] Backend tourne sur port 3001
- [ ] Frontend tourne sur port 5173
- [ ] MongoDB Atlas connecté
- [ ] CORS configuré correctement
- [ ] `.env` fichiers configurés
- [ ] Services API créés
- [ ] Auth service fonctionne
- [ ] Login/Register fonctionnels
- [ ] Protected routes fonctionnent
- [ ] Token JWT sauvegardé
- [ ] Refresh token implémenté
- [ ] Error handling complet
- [ ] Loading states gérés
- [ ] Context API configuré (optionnel)

---

## 🚀 PROCHAINES ÉTAPES

Après intégration réussie :

1. **Test complet** du flow utilisateur
2. **Implémentation** features Premium/KYC
3. **Optimisation** performance
4. **Tests** end-to-end
5. **Déploiement** staging
6. **Déploiement** production (VPS)

---

**🔗 Votre application full-stack est maintenant opérationnelle !**
