// Services/gateway/src/infrastructure/config/app.config.ts
import "dotenv/config";

export const appConfig = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? "default_secret",

  services: {
    products: process.env.PRODUCTS_SERVICE ?? "http://localhost:3003",
    categories: process.env.CATEGORIES_SERVICE ?? "http://localhost:3004",
    cart: process.env.CART_SERVICE ?? "http://localhost:3005",
    voice: process.env.VOICE_SERVICE ?? "http://localhost:3006",
  },
};
