-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "promoCode" TEXT,
ADD COLUMN     "promoDiscount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "promoId" TEXT,
ADD COLUMN     "voucherCode" TEXT,
ADD COLUMN     "voucherDiscount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "voucherId" TEXT;

-- CreateTable
CREATE TABLE "vouchers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" INTEGER NOT NULL,
    "maxDiscount" INTEGER,
    "remainingUsage" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promos" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" INTEGER NOT NULL,
    "maxDiscount" INTEGER,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_code_key" ON "vouchers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "promos_code_key" ON "promos"("code");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_promoId_fkey" FOREIGN KEY ("promoId") REFERENCES "promos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
