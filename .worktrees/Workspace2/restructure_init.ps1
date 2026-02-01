# PowerShell Script to Restructure Project
# USAGE: .\restructure_init.ps1

$projectRoot = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"
cd $projectRoot

Write-Host "🚀 Starting Project Cleanup & Restructuring..." -ForegroundColor Cyan

# 1. Archive Docs
$archiveDocs = Join-Path $projectRoot "_archive\docs"
$archiveScripts = Join-Path $projectRoot "_archive\scripts"

New-Item -ItemType Directory -Force -Path $archiveDocs | Out-Null
New-Item -ItemType Directory -Force -Path $archiveScripts | Out-Null

Write-Host "📦 Archiving documentation..."
Get-ChildItem -Path $projectRoot -Filter "*.md" | Where-Object { $_.Name -ne "RESTRUCTURING_MASTERPLAN.md" -and $_.Name -ne "README.md" } | Move-Item -Destination $archiveDocs -Force
Get-ChildItem -Path $projectRoot -Filter "*.txt" | Move-Item -Destination $archiveDocs -Force

Write-Host "📦 Archiving utility scripts..."
Get-ChildItem -Path $projectRoot -Filter "*.ps1" | Where-Object { $_.Name -ne "restructure_init.ps1" -and $_.Name -ne "verify_mongo.ps1" } | Move-Item -Destination $archiveScripts -Force
Get-ChildItem -Path $projectRoot -Filter "*.html" | Move-Item -Destination $archiveScripts -Force

# 2. Scaffold New Src Structure
Write-Host "🏗️ Scaffolding Architecture..."
$src = Join-Path $projectRoot "src"
$folders = @(
    "src\app\routes",
    "src\app\providers",
    "src\app\layouts",
    "src\features\auth\components",
    "src\features\auth\hooks",
    "src\features\economy\components",
    "src\features\economy\hooks",
    "src\features\education\components",
    "src\features\education\hooks",
    "src\features\social\components",
    "src\features\social\hooks",
    "src\shared\ui",
    "src\shared\hooks",
    "src\lib\firebase",
    "src\lib\pi-network"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path (Join-Path $projectRoot $folder) | Out-Null
}

# 3. Safe Backup of App.tsx
Write-Host "🛡️ backing up App.tsx..."
Copy-Item (Join-Path $src "App.tsx") (Join-Path $src "App.legacy.tsx")

Write-Host "✅ Cleanup Complete! Project is ready for architectural surgery." -ForegroundColor Green
