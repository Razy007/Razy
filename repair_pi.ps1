
Write-Host "Fermeture de l'application Pi Network..."
Stop-Process -Name "Pi Network" -ErrorAction SilentlyContinue
Stop-Process -Name "Pi Network Helper" -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

$appDataPath = "$env:APPDATA\Pi Network"

if (Test-Path $appDataPath) {
    Write-Host "Suppression du dossier de configuration pour réinitialiser la position de la fenêtre..."
    Remove-Item -Path $appDataPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Terminé. Les préférences ont été remises à zéro."
} else {
    Write-Host "Le dossier de configuration $appDataPath n'a pas été trouvé."
}

Write-Host "Veuillez relancer l'application Pi Network manuellement."
