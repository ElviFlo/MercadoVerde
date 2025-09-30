# Usa Node.js LTS (20)
FROM node:20-alpine AS builder

# Instalar dependencias necesarias del sistema
RUN apk add --no-cache bash curl

# Directorio de trabajo
WORKDIR /app

# Copiar manifests primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar el proyecto
RUN npm run build

# ======================
# Etapa final (runtime)
# ======================
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Exponer el puerto (ajústalo según cada servicio en docker-compose)
EXPOSE 3000

# Comando de arranque
CMD ["node", "dist/main.js"]
