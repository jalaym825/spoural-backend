-- CreateTable
CREATE TABLE "_playerTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_playerTeam_AB_unique" ON "_playerTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_playerTeam_B_index" ON "_playerTeam"("B");

-- AddForeignKey
ALTER TABLE "_playerTeam" ADD CONSTRAINT "_playerTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "CricketPlayer"("sis_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_playerTeam" ADD CONSTRAINT "_playerTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "CricketTeam"("sis_id") ON DELETE CASCADE ON UPDATE CASCADE;
