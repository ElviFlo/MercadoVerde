// Services/products/src/infrastructure/seed/seedProducts.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedProductsIfEmpty() {
  const count = await prisma.product.count();

  if (count > 3) {
    console.log("[products] Seed: products already exist, skipping.");
    await prisma.$disconnect();
    return;
  }

  console.log("[products] Seed: no products found, seeding default products...");

  await prisma.product.createMany({
    data: [
      // 1–3: Indoor plants
      {
        name: "Monstera deliciosa (Swiss Cheese Plant)",
        description:
          "Iconic indoor plant with large split leaves, perfect for bright, indirect light.",
        price: 39.99,
        type: "indoor",
        stock: 12,
        imageUrl: "/plants/plant-1.png",
      },
      {
        name: "Spathiphyllum (Peace Lily)",
        description:
          "Elegant indoor plant with white flowers, great for low to medium light.",
        price: 24.99,
        type: "indoor",
        stock: 18,
        imageUrl: "/plants/plant-2.png",
      },

      // 4–6: Outdoor plants
      {
        name: "Lavender",
        description:
          "Aromatic outdoor plant with purple flowers, ideal for sunny balconies and gardens.",
        price: 17.5,
        type: "outdoor",
        stock: 20,
        imageUrl: "/plants/plant-3.png",
      },
      {
        name: "Bougainvillea",
        description:
          "Colorful climbing plant perfect for warm outdoor spaces, walls and pergolas.",
        price: 29.99,
        type: "outdoor",
        stock: 10,
        imageUrl: "/plants/plant-4.png",
      },

      // 7–9: Succulents
      {
        name: "Echeveria elegans",
        description:
          "Rosette-forming succulent, very easy to care for and perfect for pots.",
        price: 9.99,
        type: "succulent",
        stock: 40,
        imageUrl: "/plants/plant-5.png",
      },
      {
        name: "Aloe vera",
        description:
          "Popular succulent with soothing gel inside the leaves, low maintenance.",
        price: 14.99,
        type: "succulent",
        stock: 30,
        imageUrl: "/plants/plant-6.png",
      },

      // 10–11: Cacti
      {
        name: "Cereus peruvianus (Peruvian Apple Cactus)",
        description:
          "Tall columnar cactus, great statement plant for bright spots.",
        price: 27.99,
        type: "cacti",
        stock: 16,
        imageUrl: "/plants/plant-7.png",
      },
      {
        name: "Echinocactus grusonii (Golden Barrel Cactus)",
        description:
          "Round cactus with golden spines, striking accent for cactus collections.",
        price: 21.99,
        type: "cacti",
        stock: 22,
        imageUrl: "/plants/plant-8.png",
      },

      // 12–13: Aromatic herbs
      {
        name: "Mentha spicata (Mint)",
        description:
          "Fresh aromatic herb, perfect for teas, desserts and growing in pots.",
        price: 7.99,
        type: "aromatic",
        stock: 50,
        imageUrl: "/plants/plant-9.png",
      },
      {
        name: "Ocimum basilicum (Basil)",
        description:
          "Fragrant culinary herb ideal for pasta, salads and sauces, loves sun and regular watering.",
        price: 6.99,
        type: "aromatic",
        stock: 45,
        imageUrl: "/plants/plant-10.png",
      },

      // 14–15: Flowering plants
      {
        name: "Geranium",
        description:
          "Classic flowering plant for balconies and windowsills, blooms for long seasons.",
        price: 12.99,
        type: "flowering",
        stock: 28,
        imageUrl: "/plants/plant-11.png",
      },
      {
        name: "Dahlia",
        description:
          "Showy flowering plant with large blooms in many colors, ideal for garden beds.",
        price: 18.99,
        type: "flowering",
        stock: 15,
        imageUrl: "/plants/plant-12.png",
      },
    ],
  });

  console.log("[products] Seed: default products inserted successfully.");
  await prisma.$disconnect();
}
