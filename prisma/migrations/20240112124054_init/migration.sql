/*
  Warnings:

  - You are about to drop the column `playerIds` on the `CricketTeam` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sis_id` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CricketTeam" DROP COLUMN "playerIds";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "sis_id";
