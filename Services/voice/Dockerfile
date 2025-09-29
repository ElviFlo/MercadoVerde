# Services/voice/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate --schema=../../prisma/schema.prisma

EXPOSE 3005

CMD ["npm", "run", "start:dev"]
