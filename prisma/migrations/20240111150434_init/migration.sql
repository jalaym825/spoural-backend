-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'SPORTS_HEAD', 'DEPT_SPORTS_CC');

-- CreateTable
CREATE TABLE "User" (
    "sis_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rec_status" BOOLEAN NOT NULL DEFAULT false,
    "cricketPlayerId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("sis_id")
);

-- CreateTable
CREATE TABLE "CricketSchedule" (
    "sis_id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "team1Id" TEXT NOT NULL,
    "team2Id" TEXT NOT NULL,
    "dependendency" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CricketSchedule_pkey" PRIMARY KEY ("sis_id")
);

-- CreateTable
CREATE TABLE "CricketTeam" (
    "sis_id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "playerIds" TEXT[],

    CONSTRAINT "CricketTeam_pkey" PRIMARY KEY ("sis_id")
);

-- CreateTable
CREATE TABLE "CricketPlayer" (
    "sis_id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isCaptain" BOOLEAN NOT NULL DEFAULT false,
    "isWicketKeeper" BOOLEAN NOT NULL DEFAULT false,
    "isAllRounder" BOOLEAN NOT NULL DEFAULT false,
    "isBatsman" BOOLEAN NOT NULL DEFAULT false,
    "isBowler" BOOLEAN NOT NULL DEFAULT false,
    "teamId" TEXT,

    CONSTRAINT "CricketPlayer_pkey" PRIMARY KEY ("sis_id")
);

-- CreateTable
CREATE TABLE "CricketMatch" (
    "sis_id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "team1Id" TEXT NOT NULL,
    "team2Id" TEXT NOT NULL,

    CONSTRAINT "CricketMatch_pkey" PRIMARY KEY ("sis_id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "sis_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tokenExpiration" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("sis_id")
);

-- CreateTable
CREATE TABLE "_playerMatches" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CricketSchedule_matchId_key" ON "CricketSchedule"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "CricketTeam_teamId_key" ON "CricketTeam"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "CricketPlayer_playerId_key" ON "CricketPlayer"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "CricketMatch_matchId_key" ON "CricketMatch"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "_playerMatches_AB_unique" ON "_playerMatches"("A", "B");

-- CreateIndex
CREATE INDEX "_playerMatches_B_index" ON "_playerMatches"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cricketPlayerId_fkey" FOREIGN KEY ("cricketPlayerId") REFERENCES "CricketPlayer"("sis_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketSchedule" ADD CONSTRAINT "CricketSchedule_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "CricketMatch"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketSchedule" ADD CONSTRAINT "CricketSchedule_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "CricketTeam"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketSchedule" ADD CONSTRAINT "CricketSchedule_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "CricketTeam"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketPlayer" ADD CONSTRAINT "CricketPlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketPlayer" ADD CONSTRAINT "CricketPlayer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "CricketTeam"("sis_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketMatch" ADD CONSTRAINT "CricketMatch_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "CricketTeam"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CricketMatch" ADD CONSTRAINT "CricketMatch_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "CricketTeam"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("sis_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_playerMatches" ADD CONSTRAINT "_playerMatches_A_fkey" FOREIGN KEY ("A") REFERENCES "CricketMatch"("sis_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_playerMatches" ADD CONSTRAINT "_playerMatches_B_fkey" FOREIGN KEY ("B") REFERENCES "CricketPlayer"("sis_id") ON DELETE CASCADE ON UPDATE CASCADE;
