/*
  Warnings:

  - You are about to drop the `Over` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Over" DROP CONSTRAINT "Over_bowlerId_fkey";

-- DropForeignKey
ALTER TABLE "Over" DROP CONSTRAINT "Over_matchId_fkey";

-- DropTable
DROP TABLE "Over";

-- CreateTable
CREATE TABLE "CricketOver" (
    "sis_id" TEXT NOT NULL,
    "bowlerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "wickets" INTEGER NOT NULL DEFAULT 0,
    "balls" INTEGER NOT NULL DEFAULT 0,
    "isMaiden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CricketOver_pkey" PRIMARY KEY ("sis_id")
);

-- AddForeignKey
ALTER TABLE "CricketOver" ADD CONSTRAINT "CricketOver_bowlerId_fkey" FOREIGN KEY ("bowlerId") REFERENCES "CricketPlayer"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketOver" ADD CONSTRAINT "CricketOver_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "CricketMatch"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;
