import { PrismaClient } from '@prisma/client';

// declarar la extensión del global de NodeJS para TypeScript
declare global {
  namespace NodeJS {
    interface Global {
      __prisma?: PrismaClient;
    }
  }
}

const globalAny: any = global;

const prisma = globalAny.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalAny.__prisma = prisma;
}

export default prisma;
