# Etapa 1: Construcción
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiar dependencias y lock file
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar
COPY . .
RUN npm run build


# Etapa 2: Producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar package.json + lock y el código compilado
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Instalar solo dependencias de producción
RUN npm ci --omit=dev   # más confiable que npm install

EXPOSE 3001

CMD ["node", "dist/main.js"]
