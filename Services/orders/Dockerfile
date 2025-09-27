# ---------- Builder ----------
FROM node:22 AS builder
WORKDIR /usr/src/app

# Instala dependencias con lockfile si existe (más reproducible)
COPY package*.json ./
RUN npm ci

# Copia solo lo necesario para compilar
COPY tsconfig*.json ./
COPY src ./src
# Si usas Prisma, descomenta estas dos líneas:
# COPY prisma ./prisma
# RUN npx prisma generate

# Compila a /dist
RUN npm run build


# ---------- Runner (producción) ----------
FROM node:22-slim AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Instala solo deps de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copia el build ya compilado
COPY --from=builder /usr/src/app/dist ./dist

# Si necesitas assets estáticos o schemas, cópialos también:
# COPY --from=builder /usr/src/app/src/public ./public

# Expón el puerto (ajústalo a tu servicio)
EXPOSE 3001

# Arranque
CMD ["node", "dist/main.js"]
