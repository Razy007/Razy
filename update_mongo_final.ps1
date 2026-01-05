$ErrorActionPreference = "Stop"
$serverIp = "116.203.51.124"
$keyPath = "hetzner_key"
$remoteUser = "pioneer"
$remoteFile = "/var/www/pioneer-academy/.env"

# New Credentials
$newUser = "admin_pioneer"
$newPass = "AmerigoVespucciH24"
$cluster = "cluster0.y87z9is.mongodb.net"

# Construct URI
$mongoUri = "mongodb+srv://${newUser}:${newPass}@${cluster}/pi_academy?retryWrites=true&w=majority"

Write-Host "Mise à jour finale de la configuration MongoDB..."

# Construct the content block using the new URI
# We overwrite the file to ensure cleanliness, keeping the Frontend variables too.
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

# Write to a local temp file first
$tempFile = "temp_env_final"
$envContent | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline

# Transfer
Write-Host "Transfert de la nouvelle configuration (User: $newUser)..."
& scp -i "$keyPath" -o StrictHostKeyChecking=no $tempFile "${remoteUser}@${serverIp}:$remoteFile"
Remove-Item $tempFile

# Restart
Write-Host "Redémarrage du Backend (PM2 user: pioneer)..."
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" "pm2 restart api-pioneer --update-env"

# Verification
Write-Host "Attente du redémarrage (10s)..."
Start-Sleep -Seconds 10
Write-Host "Test de connexion..."
$check = & ssh -i "$keyPath" "${remoteUser}@${serverIp}" "curl -s http://localhost:3001/api/health"
Write-Host "Résultat API: $check"

if ($check -match '"status":"connected"') {
    Write-Host "✅ VICTOIRE ! Base de données connectée."
}
else {
    Write-Host "❌ ECHEC. Vérifiez les logs."
}
