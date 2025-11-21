import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpia antes de insertar
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      // 1) Indoor
      {
        name: "Monstera deliciosa",
        description: "Lush indoor plant with large split leaves.",
        price: 55,
        categoryId: "indoor",
        stock: 30,
      },
      {
        name: "Spathiphyllum (Peace Lily)",
        description: "Elegant indoor plant with white flowers.",
        price: 60,
        categoryId: "indoor",
        stock: 25,
      },
      {
        name: "Sansevieria (Snake Plant)",
        description: "Hardy indoor plant, great air purifier.",
        price: 70,
        categoryId: "indoor",
        stock: 40,
      },
      {
        name: "Epipremnum aureum (Pothos)",
        description: "Trailing vine perfect for shelves and hanging pots.",
        price: 45,
        categoryId: "indoor",
        stock: 35,
      },
      {
        name: "Zamioculcas zamiifolia (ZZ Plant)",
        description: "Low-maintenance indoor plant with glossy leaves.",
        price: 80,
        categoryId: "indoor",
        stock: 20,
      },

      // 2) Outdoor
      {
        name: "Lavandula angustifolia (Lavender)",
        description: "Fragrant outdoor plant loved by pollinators.",
        price: 65,
        categoryId: "outdoor",
        stock: 50,
      },
      {
        name: "Bougainvillea",
        description: "Colorful climbing plant for sunny outdoor spaces.",
        price: 75,
        categoryId: "outdoor",
        stock: 15,
      },
      {
        name: "Hibiscus rosa-sinensis (Hibiscus)",
        description: "Tropical shrub with large bright flowers.",
        price: 85,
        categoryId: "outdoor",
        stock: 18,
      },

      // 3) Succulents
      {
        name: "Echeveria elegans",
        description: "Rosette succulent for indoor or outdoor pots.",
        price: 25,
        categoryId: "succulent",
        stock: 40,
      },
      {
        name: "Sedum morganianum (Burro’s Tail)",
        description: "Trailing succulent with dense fleshy leaves.",
        price: 30,
        categoryId: "succulent",
        stock: 35,
      },
      {
        name: "Aloe vera",
        description: "Medicinal succulent, easy to care for.",
        price: 28,
        categoryId: "succulent",
        stock: 45,
      },

      // 4) Cacti
      {
        name: "Opuntia microdasys (Bunny Ear Cactus)",
        description: "Cute pad cactus with small glochids.",
        price: 32,
        categoryId: "cacti",
        stock: 25,
      },
      {
        name: "Echinocactus grusonii (Golden Barrel Cactus)",
        description: "Round cactus with golden spines.",
        price: 48,
        categoryId: "cacti",
        stock: 22,
      },

      // 5) Aromatic / Flowering
      {
        name: "Mentha spicata (Mint)",
        description: "Fresh aromatic herb for teas and desserts.",
        price: 15,
        categoryId: "aromatic",
        stock: 60,
      },
      {
        name: "Tagetes (Marigold)",
        description: "Bright flowering plant ideal for borders.",
        price: 20,
        categoryId: "flowering",
        stock: 30,
      },
    ],
  });

  console.log("✅ Seed de products completado");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
