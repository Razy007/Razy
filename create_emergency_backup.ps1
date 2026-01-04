$ErrorActionPreference = "Stop"

# Configurations
$SourceDir = $PSScriptRoot
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupRoot = "C:\Users\lenovo\BACKUPS_PI_ACADEMY"
$BackupName = "Backup_$Timestamp"
$DestDir = Join-Path $BackupRoot $BackupName
$LogFile = Join-Path $BackupRoot "backup_log.txt"

# Create Backup Directory
if (!(Test-Path $BackupRoot)) { New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null }
New-Item -ItemType Directory -Force -Path $DestDir | Out-Null

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   PI ACADEMY - EMERGENCY BACKUP SYSTEM" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Source: $SourceDir"
Write-Host "Destination: $DestDir"
Write-Host ""

# Copy Command (Robocopy)
# /MIR :: Mirror (Copy everything, purge extra in dest)
# /XD  :: Exclude Directories (node_modules, .git, etc.)
# /XF  :: Exclude Files (logs, etc.)
# /R:2 :: Retry 2 times
# /W:2 :: Wait 2 seconds between retries

$ExcludeDirs = @("node_modules", ".git", "dist", "build", "coverage", ".gemini", "tmp", ".idea", ".vscode")
$ExcludeFiles = @("*.log", "*.tmp", "*.mp4", "*.avi")

Write-Host "🚀 Starting backup..." -ForegroundColor Yellow

$RoboArgs = @(
    $SourceDir,
    $DestDir,
    "/MIR",
    "/XD", $ExcludeDirs,
    "/XF", $ExcludeFiles,
    "/R:2", 
    "/W:2"
)

# Execute Robocopy
# Return codes 0-7 are success
$Process = Start-Process -FilePath "robocopy" -ArgumentList $RoboArgs -NoNewWindow -PassThru -Wait

if ($Process.ExitCode -ge 8) {
    Write-Host "❌ Backup FAILED with error code $($Process.ExitCode)" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ Files copied successfully." -ForegroundColor Green
}

# Create a Restore Info file
$RestoreInfo = @"
BACKUP RESTORE FOR PI ACADEMY
=============================
Date: $(Get-Date)
Source: $SourceDir

HOW TO RESTORE FUNCTIONALITY:
1. This backup contains all source code and configurations (.env).
2. It EXCLUDES 'node_modules' to save space and time.
3. To run this version:
   - Open a terminal in this folder.
   - Run 'npm install' to restore frontend dependencies.
   - cd backend
   - Run 'npm install' to restore backend dependencies.
   - Return to root and run 'npm run dev' (frontend) and 'node server.js' (backend).
"@

Set-Content -Path "$DestDir\RESTORE_INSTRUCTIONS.txt" -Value $RestoreInfo

Write-Host ""
Write-Host "🎉 BACKUP COMPLETE!" -ForegroundColor Green
Write-Host "Location: $DestDir"
Write-Host "Instructions: $DestDir\RESTORE_INSTRUCTIONS.txt"
Write-Host "==========================================" -ForegroundColor Cyan
