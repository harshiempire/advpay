/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Merchant" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
ALTER COLUMN "email" DROP NOT NULL;
