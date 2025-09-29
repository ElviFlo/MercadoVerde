# Categories Service - Docker

Este documento explica cómo ejecutar el microservicio de Categories usando Docker.

## 🐳 Docker Setup

### Prerrequisitos
- Docker
- Docker Compose

### Construcción de la Imagen

```bash
# Construir la imagen
docker build -t categories-service:latest .

# O usar el script de construcción
chmod +x build.sh
./build.sh
```

### Ejecución con Docker Compose (Recomendado)

```bash
# Ejecutar todos los servicios (Categories + MongoDB + Mongo Express)
docker-compose up -d

# Ver logs
docker-compose logs -f categories-service

# Detener servicios
docker-compose down
```

### Ejecución Manual

```bash
# Ejecutar solo el servicio de Categories
docker run -p 4001:4001 categories-service:latest

# Con variables de entorno personalizadas
docker run -p 4001:4001 \
  -e MONGO_URI=mongodb://localhost:27017/mercadoverde \
  -e PORT=4001 \
  categories-service:latest
```

## 📋 Servicios Incluidos

- **Categories Service**: Puerto 4001
- **MongoDB**: Puerto 27017
- **Mongo Express**: Puerto 8081 (Admin UI)

## 🔗 Endpoints Disponibles

- **API**: http://localhost:4001
- **Swagger Docs**: http://localhost:4001/api-docs
- **Health Check**: http://localhost:4001/health
- **Mongo Express**: http://localhost:8081

## 🧪 Testing

```bash
# Health check
curl http://localhost:4001/health

# Get categories
curl http://localhost:4001/categories

# Create category
curl -X POST http://localhost:4001/categories \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Frutas", "descripcion": "Frutas frescas"}'
```

## 🐛 Troubleshooting

### Ver logs del servicio
```bash
docker-compose logs categories-service
```

### Acceder al contenedor
```bash
docker-compose exec categories-service sh
```

### Reiniciar servicios
```bash
docker-compose restart categories-service
```

## 📊 Monitoreo

- **Health Check**: El contenedor incluye un health check automático
- **Logs**: Usar `docker-compose logs` para ver logs
- **Mongo Express**: Interface web para MongoDB en puerto 8081
