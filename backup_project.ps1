$Source = $PSScriptRoot
$DestPath = "C:\Users\lenovo\OneDrive\Documents\SAVE"
$BackupName = "PioneerAcademy_UltimeGoldProd"
$DestDir = Join-Path $DestPath $BackupName
$ZipPath = Join-Path $DestPath "$BackupName.zip"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   PIONEER ACADEMY - ULTIMATE BACKUP" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Source: $Source"
Write-Host "Target: $DestDir"
Write-Host ""

# 1. Create Destination Directory
if (!(Test-Path $DestPath)) { 
    Write-Host "Creating parent directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $DestPath | Out-Null 
}

# 2. Run Robocopy
# /MIR: Mirror directory (copy all, purge destination extras)
# /XD: Exclude directories (node_modules, .git, etc to keep it clean and fast)
# /XF: Exclude files (logs)
Write-Host "🚀 Copying files (Excluding node_modules, .git)..." -ForegroundColor Cyan
$RoboArgs = @(
    $Source,
    $DestDir,
    "/MIR",
    "/XD", "node_modules", ".git", "dist", ".vs", "coverage", ".gemini", "tmp", ".idea",
    "/XF", "*.log", "*.tmp", "desktop.ini"
)

# Run Robocopy (Output suppressed for cleanliness, checking exit code)
& robocopy @RoboArgs | Out-Null

# Robocopy Exit Codes: 0-7 are success/partial success. 8+ is failure.
if ($LASTEXITCODE -ge 8) {
    Write-Host "❌ COPY FAILED! Error Code: $LASTEXITCODE" -ForegroundColor Red
    # Pause removed for automation
    Exit
}
else {
    Write-Host "✅ Files successfully copied to local backup folder." -ForegroundColor Green
}

# 3. Verify Critical Files
$Critical = @("package.json", "vite.config.ts", ".env", "src")
$Missing = $false
foreach ($c in $Critical) {
    if (!(Test-Path (Join-Path $DestDir $c))) {
        Write-Host "⚠️  WARNING: Critical file missing: $c" -ForegroundColor Red
        $Missing = $true
    }
}
if (-not $Missing) {
    Write-Host "✔️  Integrity Check Passed: All critical files present." -ForegroundColor Green
}

# 4. Create ZIP
Write-Host ""
Write-Host "🔐 Creating Secure Archive ($BackupName.zip)..." -ForegroundColor Cyan
if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }

# Compress
Compress-Archive -Path "$DestDir\*" -DestinationPath $ZipPath -Force

Write-Host ""
Write-Host "🎉 SUCCESS! Backup created." -ForegroundColor Green
Write-Host "📂 Folder: $DestDir"
Write-Host "📦 Zip:    $ZipPath"
Write-Host "==========================================" -ForegroundColor Cyan
# Pause removed for automation
