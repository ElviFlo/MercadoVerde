Write-Host "🐳 Construyendo el microservicio de Categories..." -ForegroundColor Green

# Build the Docker image
docker build -t categories-service:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Imagen construida exitosamente" -ForegroundColor Green
    
    # Show image details
    Write-Host "📋 Imágenes disponibles:" -ForegroundColor Yellow
    docker images | Select-String "categories-service"
    
    Write-Host ""
    Write-Host "🚀 Para ejecutar el servicio:" -ForegroundColor Cyan
    Write-Host "   docker run -p 4001:4001 categories-service:latest"
    Write-Host ""
    Write-Host "🐳 Para usar docker-compose:" -ForegroundColor Cyan
    Write-Host "   docker-compose up -d"
    Write-Host ""
    Write-Host "📚 Documentación Swagger estará disponible en:" -ForegroundColor Magenta
    Write-Host "   http://localhost:4001/api-docs"
} else {
    Write-Host "❌ Error al construir la imagen" -ForegroundColor Red
}
