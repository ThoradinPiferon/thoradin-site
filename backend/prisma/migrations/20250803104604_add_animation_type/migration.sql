/*
  Warnings:

  - The primary key for the `Scenario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Scenario` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Scenario` table. All the data in the column will be lost.
  - You are about to drop the column `nextScenes` on the `Scenario` table. All the data in the column will be lost.
  - You are about to drop the column `tiles` on the `Scenario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Scenario_sceneId_subsceneId_idx";

-- DropIndex
DROP INDEX "public"."Scenario_sceneId_subsceneId_key";

-- AlterTable
ALTER TABLE "public"."Scenario" DROP CONSTRAINT "Scenario_pkey",
DROP COLUMN "id",
DROP COLUMN "metadata",
DROP COLUMN "nextScenes",
DROP COLUMN "tiles",
ADD COLUMN     "animationType" TEXT,
ADD CONSTRAINT "Scenario_pkey" PRIMARY KEY ("sceneId", "subsceneId");
