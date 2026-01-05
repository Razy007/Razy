Write-Host "Cleaning..."
& npm run clean
if ($LASTEXITCODE -ne 0) { Write-Host "Clean failed, continuing..." }

Write-Host "Installing dependencies..."
& npm install
if ($LASTEXITCODE -ne 0) { throw "Install failed" }

Write-Host "Building..."
& npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

Write-Host "SUCCESS!"
