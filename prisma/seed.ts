import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

interface DemoAccount {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  roles?: Role[];
}

const accounts: DemoAccount[] = [
  { username: "admin", email: "admin@seapedia.test", password: "Admin123!", isAdmin: true },
  { username: "seller1", email: "seller@seapedia.test", password: "Seller123!", roles: ["SELLER"] },
  { username: "buyer1", email: "buyer@seapedia.test", password: "Buyer123!", roles: ["BUYER"] },
  { username: "driver1", email: "driver@seapedia.test", password: "Driver123!", roles: ["DRIVER"] },
  {
    username: "multi",
    email: "multi@seapedia.test",
    password: "Multi123!",
    roles: ["BUYER", "SELLER", "DRIVER"],
  },
];

const reviews = [
  { name: "Anindya", rating: 5, comment: "SEAPEDIA feels fast and clean. Love the dark mode!" },
  { name: "Budi", rating: 4, comment: "Easy to browse stores. Checkout was straightforward." },
  { name: "Citra", rating: 5, comment: "Great marketplace experience, switching roles is intuitive." },
  { name: "Dewi", rating: 4, comment: "Nice UI and the product pages are clear and helpful." },
];

async function main() {
  for (const account of accounts) {
    const passwordHash = await bcrypt.hash(account.password, 12);
    const user = await prisma.user.upsert({
      where: { username: account.username },
      update: { email: account.email, passwordHash, isAdmin: account.isAdmin ?? false },
      create: {
        username: account.username,
        email: account.email,
        passwordHash,
        isAdmin: account.isAdmin ?? false,
      },
    });

    for (const role of account.roles ?? []) {
      await prisma.userRole.upsert({
        where: { userId_role: { userId: user.id, role } },
        update: {},
        create: { userId: user.id, role },
      });
    }
  }

  const reviewCount = await prisma.applicationReview.count();
  if (reviewCount === 0) {
    await prisma.applicationReview.createMany({ data: reviews });
  }

  console.log(`Seeded ${accounts.length} accounts and ensured demo reviews.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
