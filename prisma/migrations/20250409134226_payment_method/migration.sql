/*
  Warnings:

  - The `paymentMethod` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Paypal', 'Stripe', 'CashOnDelivery');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod";
