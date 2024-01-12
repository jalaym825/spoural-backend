/*
  Warnings:

  - You are about to drop the `_playerTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_playerTeam" DROP CONSTRAINT "_playerTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_playerTeam" DROP CONSTRAINT "_playerTeam_B_fkey";

-- DropTable
DROP TABLE "_playerTeam";

-- CreateTable
CREATE TABLE "_CricketPlayerToCricketTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CricketPlayerToCricketTeam_AB_unique" ON "_CricketPlayerToCricketTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_CricketPlayerToCricketTeam_B_index" ON "_CricketPlayerToCricketTeam"("B");

-- AddForeignKey
ALTER TABLE "_CricketPlayerToCricketTeam" ADD CONSTRAINT "_CricketPlayerToCricketTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "CricketPlayer"("sis_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CricketPlayerToCricketTeam" ADD CONSTRAINT "_CricketPlayerToCricketTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "CricketTeam"("sis_id") ON DELETE CASCADE ON UPDATE CASCADE;
