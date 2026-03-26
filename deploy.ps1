# Deploy script - Builds frontend and copies to backend

Write-Host "Building frontend..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Copying build to backend..." -ForegroundColor Cyan
$backendPath = "..\corefoundry-backend\static"

# Remove old static files
if (Test-Path $backendPath) {
    Remove-Item $backendPath -Recurse -Force
}

# Copy new build
Copy-Item "dist" $backendPath -Recurse

Write-Host "Frontend deployed to backend!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. On Linux server: cd ~/Documents/corefoundry-backend" -ForegroundColor Yellow
Write-Host "   2. Activate venv: source venv/bin/activate" -ForegroundColor Yellow
Write-Host "   3. Start backend: uvicorn corefoundry.main:app --host 0.0.0.0 --port 8000" -ForegroundColor Yellow
Write-Host "   4. Start ngrok: ngrok http 8000" -ForegroundColor Yellow
