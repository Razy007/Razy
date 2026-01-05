$ErrorActionPreference = "Stop"
$serverIp = "116.203.51.124"
$keyPath = "hetzner_key"
$remoteUser = "pioneer"
$remoteFile = "/var/www/pioneer-academy/.env"

# Encoding Credentials (URL Encoding for special chars)
# User: abdoulrazaktanko06@gmail.com -> @ = %40
# Pass: Goldeneyes@@@007! -> @ = %40, ! = %21
$mongoUri = "mongodb+srv://abdoulrazaktanko06%40gmail.com:Goldeneyes%40%40%40007%21@cluster0.y87z9is.mongodb.net/pi_academy?retryWrites=true&w=majority"

Write-Host "Injection de la configuration Backend dans .env..."

# Construct the content block
$envContent = @"
# --- FRONTEND ---
VITE_PI_API_KEY=dummy_local_key
VITE_PI_SANDBOX=true
VITE_USE_MOCK_AUTH=true
VITE_API_URL=https://pioneeracademy.academy/api
VITE_GCV_VALUE=314.159
VITE_SENTRY_ENABLED=false
VITE_ENABLE_PREMIUM=true
VITE_ENABLE_STAKING=true
VITE_ENABLE_SOCIAL=true

# --- BACKEND ---
PORT=3001
MONGO_URI=$mongoUri
JWT_SECRET=pioneer_academy_secure_key_2026
NODE_ENV=production
"@

# Write to a local temp file first to handle newlines correctly
$tempFile = "temp_env_file"
$envContent | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline

# Transfer
Write-Host "Transfert vers le serveur..."
& scp -i "$keyPath" -o StrictHostKeyChecking=no $tempFile "${remoteUser}@${serverIp}:$remoteFile"
Remove-Item $tempFile

# Restart
Write-Host "Redémarrage du Backend..."
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" "pm2 restart api-pioneer"

Write-Host "✅ Configuration appliquée avec succès."
