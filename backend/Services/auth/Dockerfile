# ---------- build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# deps
COPY package*.json ./
RUN npm ci

# prisma: copiar el esquema y GENERAR el cliente (NO requiere DB)
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
COPY --from=builder /app/dist         ./dist
COPY --from=builder /app/prisma       ./prisma
COPY --from=builder /app/proto        ./proto
COPY package*.json ./

EXPOSE 3001 50050

# aplica migraciones y arranca
CMD ["sh","-c","npx prisma migrate deploy || true; node dist/main.js"]
