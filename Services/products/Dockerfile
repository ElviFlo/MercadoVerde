# Etapa 1: construcción
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: producción
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

RUN npm ci --omit=dev

EXPOSE 3003

CMD ["node", "dist/main.js"]
