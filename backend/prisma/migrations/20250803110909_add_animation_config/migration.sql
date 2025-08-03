/*
  Warnings:

  - You are about to drop the column `animationType` on the `Scenario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Scenario" DROP COLUMN "animationType",
ADD COLUMN     "animationConfig" JSONB;
