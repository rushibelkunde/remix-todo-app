-- CreateEnum
CREATE TYPE "status" AS ENUM ('ON_HOLD', 'COMPLETED', 'IN_PROGRESS');

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "bookmarked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'IN_PROGRESS';
