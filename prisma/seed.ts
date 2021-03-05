import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const invoiceData: Prisma.InvoiceCreateInput[] = [
  {
    billingDate: new Date("2021-01-31"),
    total: 6_000_000,
    items: {
      create: [
        {
          name: "システム開発",
          price: 1_000_000,
          quantity: 1,
          total: 1_000_000,
        },
        {
          name: "システム保守",
          price: 5_000_000,
          quantity: 1,
          total: 5_000_000,
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const data of invoiceData) {
    const { id } = await prisma.invoice.create({ data });
    console.log(`Created invoice with id: ${id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
