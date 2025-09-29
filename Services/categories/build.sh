#!/bin/bash

echo "🐳 Construyendo el microservicio de Categories..."

# Build the Docker image
docker build -t categories-service:latest .

echo "✅ Imagen construida exitosamente"

# Show image details
docker images | grep categories-service

echo "🚀 Para ejecutar el servicio:"
echo "   docker run -p 4001:4001 categories-service:latest"
echo ""
echo "🐳 Para usar docker-compose:"
echo "   docker-compose up -d"
