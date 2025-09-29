# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# deps
COPY package*.json ./
RUN npm ci

# build
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

# para healthcheck
RUN apk add --no-cache curl wget

COPY package*.json ./
RUN npm ci --omit=dev

# solo el build final
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3002
CMD ["node", "dist/main.js"]
