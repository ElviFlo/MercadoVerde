import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  namespace NodeJS {
    interface Global {}
  }
}

const globalAny: any = global;

const prisma = globalAny.__prisma_voice ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalAny.__prisma_voice = prisma;
}

export default prisma;
