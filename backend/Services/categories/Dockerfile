# ---------- build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# deps
COPY package*.json ./
RUN npm ci

# prisma: copiar esquema y generar el cliente (NO requiere DB)
COPY prisma ./prisma
RUN npx prisma generate

# código y build
COPY . .
RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# artefactos
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# aplica migraciones (si hay) y arranca
CMD ["sh","-c","npx prisma migrate deploy || true; node dist/main.js"]
