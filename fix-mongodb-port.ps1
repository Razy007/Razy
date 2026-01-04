# ============================================================================
# SCRIPT AUTOMATIQUE : RÉSOUDRE PROBLÈME PORT 27017 BLOQUÉ
# ============================================================================
# Ce script va automatiquement :
# 1. Détruire la règle de firewall bloquante
# 2. Créer une nouvelle règle autorisant MongoDB Atlas
# 3. Vérifier la connexion au port 27017
# 4. Tester la connexion MongoDB Atlas
# ============================================================================

Write-Host "`n" -NoNewline
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "🔧 RÉSOLUTION AUTOMATIQUE - PORT 27017 MONGODB ATLAS" -ForegroundColor Yellow
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host ""

# Vérifier les privilièges administrateur
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERREUR: Ce script nécessite des privilèges administrateur" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUTION:" -ForegroundColor Yellow
    Write-Host "   1. Fermez cette fenêtre PowerShell" -ForegroundColor White
    Write-Host "   2. Clic droit sur PowerShell → Exécuter en tant qu'administrateur" -ForegroundColor White
    Write-Host "   3. Relancez ce script" -ForegroundColor White
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host "✅ Privilèges administrateur : OK" -ForegroundColor Green
Write-Host ""

# ============================================================================
# Étape 1 : Nettoyer les anciennes règles MongoDB
# ============================================================================

Write-Host "[1/5] 🧹 Nettoyage des anciennes règles firewall..." -ForegroundColor Cyan

$oldRules = Get-NetFirewallRule -DisplayName "*MongoDB*" -ErrorAction SilentlyContinue

if ($oldRules) {
    Write-Host "   Suppression de $($oldRules.Count) ancienne(s) règle(s)..." -ForegroundColor Yellow
    $oldRules | Remove-NetFirewallRule -ErrorAction SilentlyContinue
    Write-Host "   ✅ Anciennes règles supprimées" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Aucune ancienne règle trouvée" -ForegroundColor Gray
}

Write-Host ""

# ============================================================================
# Étape 2 : Créer une nouvelle règle firewall pour MongoDB Atlas
# ============================================================================

Write-Host "[2/5] 🔥 Création règle firewall MongoDB Atlas..." -ForegroundColor Cyan

try {
    # Créer règle Outbound (sortante) pour MongoDB Atlas
    New-NetFirewallRule `
        -DisplayName "MongoDB Atlas - Outbound" `
        -Description "Autoriser connexions MongoDB Atlas (port 27017)" `
        -Direction Outbound `
        -Protocol TCP `
        -RemotePort 27017 `
        -Action Allow `
        -Enabled True `
        -Profile Any `
        -ErrorAction Stop | Out-Null
    
    Write-Host "   ✅ Règle Outbound créée" -ForegroundColor Green
    
    # Créer règle Inbound (entrante) aussi (au cas où)
    New-NetFirewallRule `
        -DisplayName "MongoDB Atlas - Inbound" `
        -Description "Autoriser connexions MongoDB Atlas (port 27017)" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 27017 `
        -Action Allow `
        -Enabled True `
        -Profile Any `
        -ErrorAction Stop | Out-Null
    
    Write-Host "   ✅ Règle Inbound créée" -ForegroundColor Green
    
} catch {
    Write-Host "   ⚠️  Erreur création règle : $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# Étape 3 : Vérifier que les règles sont actives
# ============================================================================

Write-Host "[3/5] 🔍 Vérification des règles..." -ForegroundColor Cyan

$mongoRules = Get-NetFirewallRule -DisplayName "*MongoDB Atlas*" -ErrorAction SilentlyContinue

if ($mongoRules) {
    Write-Host "   ✅ Trouvé $($mongoRules.Count) règle(s) MongoDB Atlas" -ForegroundColor Green
    foreach ($rule in $mongoRules) {
        $status = if ($rule.Enabled -eq "True") { "✅ Activée" } else { "❌ Désactivée" }
        Write-Host "      - $($rule.DisplayName) : $status" -ForegroundColor Gray
    }
} else {
    Write-Host "   ❌ Aucune règle MongoDB Atlas trouvée" -ForegroundColor Red
}

Write-Host ""

# ============================================================================
# Étape 4 : Test de connectivité au port 27017
# ============================================================================

Write-Host "[4/5] 🌐 Test de connectivité Port 27017..." -ForegroundColor Cyan

# Tester plusieurs hosts MongoDB Atlas
$mongoHosts = @(
    "ac-sh9juwq-shard-00-00.y87z9is.mongodb.net",
    "ac-sh9juwq-shard-00-01.y87z9is.mongodb.net",
    "ac-sh9juwq-shard-00-02.y87z9is.mongodb.net"
)

$successfulConnections = 0

foreach ($host in $mongoHosts) {
    Write-Host "   Test connexion → $host..." -ForegroundColor Gray
    
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $connect = $tcpClient.BeginConnect($host, 27017, $null, $null)
        $wait = $connect.AsyncWaitHandle.WaitOne(3000, $false)
        
        if ($wait) {
            try {
                $tcpClient.EndConnect($connect)
                Write-Host "      ✅ Connexion réussie!" -ForegroundColor Green
                $successfulConnections++
            } catch {
                Write-Host "      ❌ Connexion refusée" -ForegroundColor Red
            }
        } else {
            Write-Host "      ⏱️  Timeout (3s)" -ForegroundColor Yellow
        }
        
        $tcpClient.Close()
        
    } catch {
        Write-Host "      ❌ Erreur : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

if ($successfulConnections -gt 0) {
    Write-Host "   🎉 Port 27017 : ACCESSIBLE ($successfulConnections/$($mongoHosts.Count) hosts)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Port 27017 : TOUJOURS BLOQUÉ" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   💡 Actions supplémentaires requises:" -ForegroundColor Yellow
    Write-Host "      1. Vérifiez votre antivirus (Avast, Norton, etc.)" -ForegroundColor White
    Write-Host "      2. Désactivez temporairement le VPN" -ForegroundColor White
    Write-Host "      3. Vérifiez le proxy réseau (entreprise/école)" -ForegroundColor White
    Write-Host "      4. Contactez votre administrateur réseau" -ForegroundColor White
}

Write-Host ""

# ============================================================================
# Étape 5 : Récapitulatif et prochaines étapes
# ============================================================================

Write-Host "[5/5] 📝 Récapitulatif" -ForegroundColor Cyan
Write-Host ""

Write-Host "ÉTAT DES RÈGLES FIREWALL:" -ForegroundColor Yellow
Get-NetFirewallRule -DisplayName "*MongoDB Atlas*" | Select-Object DisplayName, Enabled, Direction | Format-Table -AutoSize

Write-Host ""
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "✅ CONFIGURATION TERMINÉE" -ForegroundColor Green
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host ""

if ($successfulConnections -gt 0) {
    Write-Host "🎉 SUCCÈS! Vous pouvez maintenant vous connecter à MongoDB Atlas" -ForegroundColor Green
    Write-Host ""
    Write-Host "PROCHAINES ÉTAPES:" -ForegroundColor Yellow
    Write-Host "   1. Ouvrez un nouveau terminal PowerShell (PAS admin)" -ForegroundColor White
    Write-Host "   2. Allez dans le dossier backend:" -ForegroundColor White
    Write-Host "      cd backend" -ForegroundColor Cyan
    Write-Host "   3. Testez la connexion MongoDB:" -ForegroundColor White
    Write-Host "      node simple-test.js" -ForegroundColor Cyan
    Write-Host "   4. Démarrez le serveur:" -ForegroundColor White
    Write-Host "      npm start" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "⚠️  Le port 27017 est toujours bloqué" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "SOLUTIONS ALTERNATIVES:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Option A : Utiliser mongodb+srv:// (DNS SRV)" -ForegroundColor Cyan
    Write-Host "   Cette méthode peut contourner certains blocages." -ForegroundColor Gray
    Write-Host "   Dans votre .env:" -ForegroundColor Gray
    Write-Host "   MONGODB_URI=mongodb+srv://user:pass@cluster0.y87z9is.mongodb.net/pi_academy" -ForegroundColor White
    Write-Host ""
    Write-Host "   Option B : Désactiver temporairement l'antivirus" -ForegroundColor Cyan
    Write-Host "   1. Ouvrez votre antivirus (Avast, Norton, etc.)" -ForegroundColor Gray
    Write-Host "   2. Désactivez la protection réseau pendant 10 minutes" -ForegroundColor Gray
    Write-Host "   3. Testez la connexion MongoDB" -ForegroundColor Gray
    Write-Host "   4. Si ça marche, ajoutez MongoDB dans les exceptions" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Option C : Utiliser un VPN" -ForegroundColor Cyan
    Write-Host "   Si votre réseau d'entreprise/école bloque MongoDB" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "📚 Documentation complète : backend\MONGODB_ATLAS_SECURITY_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host ""

Read-Host "Appuyez sur Entrée pour quitter"
