/**
 * PM2 Ecosystem Configuration Template
 * 
 * ⚠️ SECURITY: Copy this file to ecosystem.config.js and fill in your secrets
 * DO NOT commit ecosystem.config.js to version control!
 * 
 * Usage:
 *   1. Copy: cp ecosystem.config.example.js ecosystem.config.js
 *   2. Fill in your actual values
 *   3. Deploy: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [{
    name: 'api-prod',
    script: './dist/server.js',
    cwd: '/var/www/pioneer-academy/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/YOUR_DB',
      JWT_SECRET: 'GENERATE_A_SECURE_256_BIT_SECRET_HERE',
      PI_API_KEY: 'YOUR_PI_API_KEY',
      PI_APP_ID: 'YOUR_PI_APP_ID',
      FRONTEND_URL: 'https://your-domain.com',
      PORT: 3001
    }
  }]
};
