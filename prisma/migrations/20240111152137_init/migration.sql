/*
  Warnings:

  - You are about to drop the column `matchId` on the `CricketMatch` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `CricketPlayer` table. All the data in the column will be lost.
  - You are about to drop the column `matchId` on the `CricketSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `CricketTeam` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VerificationToken` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CricketPlayer" DROP CONSTRAINT "CricketPlayer_userId_fkey";

-- DropForeignKey
ALTER TABLE "CricketSchedule" DROP CONSTRAINT "CricketSchedule_matchId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_userId_fkey";

-- DropIndex
DROP INDEX "CricketMatch_matchId_key";

-- DropIndex
DROP INDEX "CricketPlayer_playerId_key";

-- DropIndex
DROP INDEX "CricketSchedule_matchId_key";

-- DropIndex
DROP INDEX "CricketTeam_teamId_key";

-- DropIndex
DROP INDEX "VerificationToken_userId_key";

-- AlterTable
ALTER TABLE "CricketMatch" DROP COLUMN "matchId";

-- AlterTable
ALTER TABLE "CricketPlayer" DROP COLUMN "playerId";

-- AlterTable
ALTER TABLE "CricketSchedule" DROP COLUMN "matchId";

-- AlterTable
ALTER TABLE "CricketTeam" DROP COLUMN "teamId";

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "CricketSchedule" ADD CONSTRAINT "CricketSchedule_sis_id_fkey" FOREIGN KEY ("sis_id") REFERENCES "CricketMatch"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketPlayer" ADD CONSTRAINT "CricketPlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_sis_id_fkey" FOREIGN KEY ("sis_id") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
