-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "actionType" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "mafiaChat" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "triadaChat" BOOLEAN NOT NULL DEFAULT false;
