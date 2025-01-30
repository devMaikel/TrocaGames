/*
  Warnings:

  - You are about to drop the column `cover_image` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "games" DROP COLUMN "cover_image",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
