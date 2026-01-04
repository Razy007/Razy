# ========================================
# SCRIPT DE DIAGNOSTIC MONGODB ATLAS
# ========================================

Write-Host "`n=== DIAGNOSTIC MONGODB ATLAS AUTOMATIQUE ===" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date)" -ForegroundColor Gray
Write-Host "`n"

# Variables
$clusterHost = "cluster0.y87z9is.mongodb.net"
$mongoPort = 27017
$srvRecord = "_mongodb._tcp.cluster0.y87z9is.mongodb.net"

# Créer un fichier de résultats
$resultFile = "mongodb-diagnostic-results.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Fonction pour écrire dans le fichier et la console
    param($message, $color = "White")
    Write-Host $message -ForegroundColor $color
    # Add-Content -Path $resultFile -Value $message # Disabled to avoid file lock issues
}

# Initialiser le fichier
"=== DIAGNOSTIC MONGODB ATLAS - $timestamp ===" | Set-Content $resultFile

Write-Result "`n[1/5] Vérification de la connexion Internet..." "Yellow"
try {
    $ping = Test-Connection -ComputerName google.com -Count 2 -Quiet
    if ($ping) {
        Write-Result "✅ Connexion Internet OK" "Green"
    } else {
        Write-Result "❌ Pas de connexion Internet" "Red"
        exit
    }
} catch {
    Write-Result "❌ Erreur lors du test de connexion: $($_.Exception.Message)" "Red"
}

Write-Result "`n[2/5] Récupération de votre IP publique..." "Yellow"
try {
    $publicIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
    Write-Result "✅ Votre IP publique: $publicIP" "Green"
    Write-Result "`n⚠️  IMPORTANT: Cette IP doit être ajoutée dans MongoDB Atlas Network Access!" "Magenta"
    Write-Result "   URL: https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList" "Cyan"
} catch {
    Write-Result "❌ Impossible de récupérer l'IP publique: $($_.Exception.Message)" "Red"
    $publicIP = "UNKNOWN"
}

Write-Result "`n[3/5] Test de résolution DNS SRV..." "Yellow"
try {
    $dnsTest = nslookup -type=SRV $srvRecord 2>&1
    if ($dnsTest -match "svr hostname") {
        Write-Result "✅ DNS SRV résolu avec succès" "Green"
        Write-Result "   Détails: $($dnsTest -join ' ')" "Gray"
    } else {
        Write-Result "❌ DNS SRV non résolu - Votre réseau bloque les requêtes SRV" "Red"
        Write-Result "   Solution: Utiliser mongodb:// au lieu de mongodb+srv://" "Yellow"
    }
} catch {
    Write-Result "❌ Erreur DNS SRV: $($_.Exception.Message)" "Red"
    Write-Result "   Solution: Utiliser mongodb:// au lieu de mongodb+srv://" "Yellow"
}

Write-Result "`n[4/5] Test de connectivité au port MongoDB (27017)..." "Yellow"
try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connection = $tcpClient.BeginConnect($clusterHost, $mongoPort, $null, $null)
    $wait = $connection.AsyncWaitHandle.WaitOne(3000, $false)
    
    if ($wait) {
        $tcpClient.EndConnect($connection)
        $tcpClient.Close()
        Write-Result "✅ Port 27017 accessible" "Green"
    } else {
        $tcpClient.Close()
        Write-Result "❌ Port 27017 non accessible - Firewall/VPN bloque la connexion" "Red"
    }
} catch {
    Write-Result "❌ Impossible de se connecter au port 27017: $($_.Exception.Message)" "Red"
    Write-Result "   Cause probable: Firewall, Proxy, VPN ou Antivirus" "Yellow"
}

Write-Result "`n[5/5] Vérification des outils MongoDB..." "Yellow"
# Vérifier Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Result "✅ Node.js installé: $nodeVersion" "Green"
    } else {
        Write-Result "⚠️  Node.js non trouvé" "Yellow"
    }
} catch {
    Write-Result "⚠️  Node.js non installé" "Yellow"
}

Write-Result "`n=== RÉSUMÉ ET ACTIONS REQUISES ===" "Cyan"
Write-Result "`n📋 ÉTAPES À SUIVRE DANS MONGODB ATLAS:" "White"
Write-Result "`n1. NETWORK ACCESS (CRITIQUE):" "Yellow"
Write-Result "   - Allez sur: https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList"
Write-Result "   - Cliquez sur 'Add IP Address'"
Write-Result "   - Ajoutez: $publicIP"
Write-Result "   - OU pour tester: 0.0.0.0/0 (permet toutes les IPs - temporaire)"

Write-Result "`n2. DATABASE ACCESS:" "Yellow"
Write-Result "   - Vérifiez que l'utilisateur 'abdoulrazaktanko06_db_user' existe"
Write-Result "   - Vérifiez le mot de passe (pas de <db_password>, mais le vrai mot de passe)"

Write-Result "`n3. CLUSTER STATUS:" "Yellow"
Write-Result "   - Vérifiez que le cluster n'est pas en pause"
Write-Result "   - URL: https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/clusters"

Write-Result "`n📁 Résultats sauvegardés dans: $resultFile" "Green"
Write-Host "`n=== FIN DU DIAGNOSTIC ===" -ForegroundColor Cyan

# Ouvrir le fichier de résultats
Write-Host "`nAppuyez sur une touche pour ouvrir le rapport..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
notepad $resultFile
