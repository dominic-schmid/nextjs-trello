import { PrismaClient } from "@prisma/client";

// Use global because hot reload does not affect this and thus our single instance is preserved
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
