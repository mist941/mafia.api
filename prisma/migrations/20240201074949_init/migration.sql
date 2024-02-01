/*
  Warnings:

  - You are about to drop the column `currentPlayerId` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "currentPlayerId",
ADD COLUMN     "currentRole" TEXT;
