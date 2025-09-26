# Imagen base
FROM node:22

# Crear carpeta de la app
WORKDIR /usr/src/app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 3001

# Comando de arranque
CMD ["node", "dist/main.js"]
