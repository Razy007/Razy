$ErrorActionPreference = "Continue"
Write-Host "Generating SSH Key..."
if (Test-Path "./hetzner_key") { Remove-Item "./hetzner_key"; Remove-Item "./hetzner_key.pub" }

# Try standard path
$sshKeygen = "C:\Windows\System32\OpenSSH\ssh-keygen.exe"
if (-not (Test-Path $sshKeygen)) {
    $sshKeygen = "ssh-keygen" # Fallback
}

Write-Host "Using: $sshKeygen"
& $sshKeygen -t ed25519 -f ./hetzner_key -N '""'
Write-Host "Exit Code: $LASTEXITCODE"

if (Test-Path "./hetzner_key.pub") {
    Write-Host "SUCCESS: Key generated."
    Get-Content "./hetzner_key.pub"
}
else {
    Write-Host "FAILURE: Key not found."
}
