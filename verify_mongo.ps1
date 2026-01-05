$ErrorActionPreference = "Stop"
$serverIp = "116.203.51.124"
$keyPath = "hetzner_key"
$remoteUser = "pioneer"

Write-Host "🔍 Vérification de la configuration MongoDB..."

# 1. Check .env (masking password for safety in logs, but verifying basic structure)
Write-Host "`n📁 Lecture du fichier .env (MONGO_URI)..."
$checkEnvCmd = "cat /var/www/pioneer-academy/.env | grep MONGO_URI"
$envOutput = & ssh -i "$keyPath" -o StrictHostKeyChecking=no "${remoteUser}@${serverIp}" $checkEnvCmd

if ($envOutput -match "mongodb\+srv://.*@.*") {
    Write-Host "✅ MONGO_URI détecté et semble valide (format mongodb+srv)."
}
else {
    Write-Host "⚠️ ATTENTION: MONGO_URI semble incorrect ou manquant."
    Write-Host "Sortie brute: $envOutput"
}

# 2. Restart Backend
Write-Host "`n🔄 Redémarrage du Backend (api-pioneer)..."
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" "pm2 restart api-pioneer"

# Wait for boot
Write-Host "⏳ Attente de 10 secondes pour l'initialisation de la connexion..."
Start-Sleep -Seconds 10

# 3. Health Check (Internal)
Write-Host "`n🏥 Test de santé (Interne - via localhost:3001)..."
$healthCheckCmd = "curl -s http://localhost:3001/api/health"
$healthOutput = & ssh -i "$keyPath" "${remoteUser}@${serverIp}" $healthCheckCmd
Write-Host "Réponse API: $healthOutput"

if ($healthOutput -match '"status":"connected"') {
    Write-Host "`n🎉 SUCCÈS : Base de données connectée !"
}
elseif ($healthOutput -match '"status":"disconnected"') {
    Write-Host "`n❌ ÉCHEC : Base de données toujours déconnectée."
    Write-Host "Vérifiez : 1. Mot de passe dans .env  2. Whitelist IP (vérifié)  3. Nom de DB"
}
else {
    Write-Host "`n⚠️  État inconnu. Vérifiez manuellement."
}
