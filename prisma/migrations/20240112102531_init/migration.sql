-- AlterTable
ALTER TABLE "CricketPlayer" ADD COLUMN     "noOfCenturies" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfFours" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfHalfCenturies" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfMatchesPlayed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfRunsScored" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfSixes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfWicketsTaken" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Over" (
    "sis_id" TEXT NOT NULL,
    "bowlerId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "wickets" INTEGER NOT NULL DEFAULT 0,
    "balls" INTEGER NOT NULL DEFAULT 0,
    "isMaiden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Over_pkey" PRIMARY KEY ("sis_id")
);

-- AddForeignKey
ALTER TABLE "Over" ADD CONSTRAINT "Over_bowlerId_fkey" FOREIGN KEY ("bowlerId") REFERENCES "CricketPlayer"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Over" ADD CONSTRAINT "Over_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "CricketMatch"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;
