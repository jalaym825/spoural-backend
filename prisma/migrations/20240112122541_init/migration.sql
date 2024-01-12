/*
  Warnings:

  - You are about to drop the column `teamId` on the `CricketPlayer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CricketPlayer" DROP CONSTRAINT "CricketPlayer_teamId_fkey";

-- AlterTable
ALTER TABLE "CricketPlayer" DROP COLUMN "teamId";
