import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

export async function dropTables() {
  await prisma.todo.deleteMany({});
  await prisma.user.deleteMany({});
}

module.exports = { dropTables };
