# ===== Etapa 1: build =====
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 1) Instala deps con lockfile para builds reproducibles
COPY package*.json ./
# Si NO tienes package-lock.json, cambia a: RUN npm install
RUN npm ci

# 2) Copia el código y compila a dist/
COPY . .
RUN npm run build


# ===== Etapa 2: runtime =====
FROM node:20-alpine

WORKDIR /usr/src/app

# 3) Copia solo lo necesario para correr
COPY --from=builder /usr/src/app/package*.json ./
# Instala solo deps de producción; si no tienes package-lock, usa: npm install --omit=dev
RUN npm ci --omit=dev

# 4) Copia el build
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main.js"]
