const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  const dests = await prisma.destination.findMany({
    select: { nameVi: true, imageUrl: true },
  });
  console.log(JSON.stringify(dests, null, 2));
  await prisma.$disconnect();
}

check();
