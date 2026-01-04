# 🚀 Pi Academy Social - Deployment Guide

Complete guide for deploying Pi Academy Social to production.

---

## 📋 Pre-Deployment Checklist

- [ ] Pi Network API credentials obtained
- [ ] Backend server ready (Node.js + MongoDB)
- [ ] VPS or cloud hosting configured
- [ ] Domain name registered (optional)
- [ ] SSL certificate ready (Let's Encrypt recommended)
- [ ] Environment variables configured
- [ ] Database backups configured

---

## 🔧 Environment Setup

### 1. Configure Production Environment

Create `.env.production`:

```env
VITE_PI_API_KEY=your_production_pi_api_key
VITE_PI_SANDBOX=false
VITE_USE_MOCK_AUTH=false
VITE_API_URL=https://api.yourdomain.com
VITE_GCV_VALUE=314.159
VITE_SENTRY_DSN=your_sentry_dsn
VITE_SENTRY_ENABLED=true
```

### 2. Build Production Bundle

```bash
# Clean previous builds
npm run clean

# Build optimized production bundle
npm run build

# Test production build locally
npm run preview
```

---

## 🐳 Option 1: Docker Deployment (Recommended)

### Prerequisites
- Docker installed
- Docker Compose installed

### Step 1: Configure Docker

**Frontend Dockerfile** (already created):
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Build and Run

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 3: Access Application

- Frontend: http://your-server-ip
- Backend API: http://your-server-ip:3001
- MongoDB: localhost:27017 (internal only)

### Step 4: SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🖥️ Option 2: VPS Deployment (Ubuntu/Debian)

### Step 1: Prepare VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install MongoDB (optional)
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Deploy Backend

```bash
# Clone or upload backend code
cd /var/www
sudo mkdir pi-academy-backend
cd pi-academy-backend

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env  # Edit with your credentials

# Start with PM2
pm2 start server.js --name pi-academy-backend
pm2 save
pm2 startup
```

### Step 3: Deploy Frontend

```bash
# Build locally or on server
npm run build

# Upload dist/ to server
scp -r dist/* user@your-server:/var/www/pi-academy-frontend/

# Or build on server
cd /var/www/pi-academy-frontend
npm install
npm run build
```

### Step 4: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/pi-academy
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend
    root /var/www/pi-academy-frontend/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pi-academy /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

---

## ☁️ Option 3: Cloud Platforms

### Vercel (Frontend Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-backend-api.com/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify (Frontend Only)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-api.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Heroku (Full Stack)

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create pi-academy-app

# Add MongoDB
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main
```

---

## 🔐 Security Best Practices

### 1. Environment Variables

```bash
# Never commit .env files
echo ".env*" >> .gitignore

# Use secrets management
# - AWS Secrets Manager
# - HashiCorp Vault
# - Docker Secrets
```

### 2. Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 3. MongoDB Security

```bash
# Create admin user
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "strong_password",
  roles: ["root"]
})

# Enable authentication
sudo nano /etc/mongod.conf
# Add: security.authorization: enabled
sudo systemctl restart mongod
```

### 4. Rate Limiting

Already configured in backend with `express-rate-limit`:
- 100 requests per 15 minutes per IP
- Adjust in `backend/server.js`

---

## 📊 Monitoring

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs pi-academy-backend

# Restart on crash
pm2 resurrect
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Sentry Error Tracking

Already configured in frontend. Check dashboard at sentry.io.

---

## 🔄 Updates & Maintenance

### Update Frontend

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Restart (if using PM2)
pm2 restart pi-academy-frontend
```

### Update Backend

```bash
cd backend
git pull origin main
npm install
pm2 restart pi-academy-backend
```

### Database Backup

```bash
# Backup MongoDB
mongodump --out /backup/$(date +%Y%m%d)

# Restore
mongorestore /backup/20241216
```

---

## 🆘 Troubleshooting

### Frontend not loading

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx config
sudo nginx -t

# Check file permissions
ls -la /var/www/pi-academy-frontend/dist
```

### Backend API errors

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs pi-academy-backend

# Restart
pm2 restart pi-academy-backend
```

### MongoDB connection issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection
mongo --eval "db.adminCommand('ping')"

# Restart
sudo systemctl restart mongod
```

---

## 📞 Support

- **Pi Network Docs**: https://developers.minepi.com
- **Nginx Docs**: https://nginx.org/en/docs/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/
- **Docker Docs**: https://docs.docker.com/

---

**Deployment Checklist Complete! 🎉**

Your Pi Academy Social app is now live and ready for production use.
