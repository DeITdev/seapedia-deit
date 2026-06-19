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

  const seller = await prisma.user.findUnique({ where: { username: "seller1" } });
  if (seller) {
    const store = await prisma.store.upsert({
      where: { sellerId: seller.id },
      update: { name: "Rumah Kopi Nusantara" },
      create: { name: "Rumah Kopi Nusantara", sellerId: seller.id },
    });

    const seedProducts = [
      {
        name: "Kopi Arabika Gayo 250g",
        description:
          "Single-origin Arabica beans from the Gayo highlands. Medium roast with notes of brown sugar and citrus.",
        price: 85000,
        stock: 42,
      },
      {
        name: "Premium Matcha Powder 100g",
        description:
          "Ceremonial-grade matcha, stone-ground and vibrant green. Perfect for lattes and baking.",
        price: 130000,
        stock: 60,
      },
      {
        name: "Madu Hutan Liar 500ml",
        description:
          "Raw wild forest honey harvested sustainably. Unprocessed with a rich, floral aroma.",
        price: 110000,
        stock: 50,
      },
      {
        name: "Batik Tulis Pekalongan",
        description:
          "Hand-drawn batik fabric, 2 meters. Traditional motifs created by master artisans in Pekalongan.",
        price: 320000,
        stock: 12,
      },
    ];

    for (const product of seedProducts) {
      const existing = await prisma.product.findFirst({
        where: { storeId: store.id, name: product.name },
      });
      if (!existing) {
        await prisma.product.create({
          data: { ...product, storeId: store.id },
        });
      }
    }
  }

  const buyer = await prisma.user.findUnique({ where: { username: "buyer1" } });
  if (buyer) {
    const wallet = await prisma.wallet.upsert({
      where: { userId: buyer.id },
      update: { balance: 500000 },
      create: { userId: buyer.id, balance: 500000 },
    });

    const txnCount = await prisma.walletTransaction.count({ where: { walletId: wallet.id } });
    if (txnCount === 0) {
      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "TOP_UP",
          amount: 500000,
          note: "Initial seed top-up",
        },
      });
    }

    await prisma.buyerAddress.upsert({
      where: { userId: buyer.id },
      update: {},
      create: {
        userId: buyer.id,
        recipientName: "Budi Santoso",
        phone: "081234567890",
        street: "Jl. Sudirman No. 45",
        city: "Jakarta Selatan",
        province: "DKI Jakarta",
        postalCode: "12190",
      },
    });

    await prisma.cart.upsert({
      where: { userId: buyer.id },
      update: {},
      create: { userId: buyer.id },
    });
  }

  const multi = await prisma.user.findUnique({ where: { username: "multi" } });
  if (multi) {
    await prisma.wallet.upsert({
      where: { userId: multi.id },
      update: {},
      create: { userId: multi.id, balance: 0 },
    });
    await prisma.cart.upsert({
      where: { userId: multi.id },
      update: {},
      create: { userId: multi.id },
    });
  }

  console.log(`Seeded ${accounts.length} accounts, demo reviews, seller1 store/products, buyer1 wallet/address.`);
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
