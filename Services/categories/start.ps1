Write-Host "🚀 Iniciando Categories Service con Docker Compose..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker está funcionando" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker no está funcionando. Por favor inicia Docker Desktop" -ForegroundColor Red
    exit 1
}

# Start services
Write-Host "🐳 Iniciando servicios..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Servicios iniciados exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Servicios disponibles:" -ForegroundColor Cyan
    Write-Host "   • Categories API: http://localhost:4001" -ForegroundColor White
    Write-Host "   • Swagger Docs: http://localhost:4001/api-docs" -ForegroundColor White
    Write-Host "   • Health Check: http://localhost:4001/health" -ForegroundColor White
    Write-Host "   • Mongo Express: http://localhost:8081" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Para ver logs:" -ForegroundColor Yellow
    Write-Host "   docker-compose logs -f categories-service"
    Write-Host ""
    Write-Host "🛑 Para detener servicios:" -ForegroundColor Yellow
    Write-Host "   docker-compose down"
} else {
    Write-Host "❌ Error al iniciar servicios" -ForegroundColor Red
}
