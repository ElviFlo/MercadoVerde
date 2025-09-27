# ---------- Builder ----------
FROM node:22 AS builder
WORKDIR /usr/src/app

# Instala dependencias
COPY package*.json ./
RUN npm ci

# Copia solo lo necesario para compilar
COPY tsconfig*.json ./
COPY src ./src

# Instala TypeScript temporalmente para la compilación
RUN npm install typescript

# Compila a /dist
RUN npm run build
