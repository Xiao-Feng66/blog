import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const dbUrl = process.env.DATABASE_URL ?? "";
export const useMock = !dbUrl || dbUrl.includes("johndoe:randompassword");

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

export const prisma = useMock
  ? (null as unknown as PrismaClient)
  : globalForPrisma.prisma || createPrismaClient();

if (!useMock && process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma;
