-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_targetPlayerId_fkey";

-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "targetPlayerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_targetPlayerId_fkey" FOREIGN KEY ("targetPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
