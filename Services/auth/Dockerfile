# Etapa 1: Construcción
FROM node:18-alpine AS builder

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos de dependencias primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript a JavaScript (dist/)
RUN npm run build


# Etapa 2: Producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar solo lo necesario desde la etapa builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Instalar dependencias solo de producción
RUN npm install --only=production

# Exponer el puerto del servicio
EXPOSE 3001

# Comando para iniciar la app
CMD ["node", "dist/main.js"]
