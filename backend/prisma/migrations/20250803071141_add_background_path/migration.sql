/*
  Warnings:

  - You are about to drop the `ai_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `configurations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grid_interactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grid_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scene_subscenes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `soulkey_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `themes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ai_responses" DROP CONSTRAINT "ai_responses_gridInteractionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ai_responses" DROP CONSTRAINT "ai_responses_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."configurations" DROP CONSTRAINT "configurations_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."contents" DROP CONSTRAINT "contents_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."grid_interactions" DROP CONSTRAINT "grid_interactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."grid_sessions" DROP CONSTRAINT "grid_sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."soulkey_logs" DROP CONSTRAINT "soulkey_logs_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."themes" DROP CONSTRAINT "themes_createdBy_fkey";

-- DropTable
DROP TABLE "public"."ai_responses";

-- DropTable
DROP TABLE "public"."configurations";

-- DropTable
DROP TABLE "public"."contents";

-- DropTable
DROP TABLE "public"."grid_interactions";

-- DropTable
DROP TABLE "public"."grid_sessions";

-- DropTable
DROP TABLE "public"."scene_subscenes";

-- DropTable
DROP TABLE "public"."soulkey_logs";

-- DropTable
DROP TABLE "public"."themes";

-- DropTable
DROP TABLE "public"."users";

-- DropEnum
DROP TYPE "public"."ConfigType";

-- DropEnum
DROP TYPE "public"."ContentType";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "public"."Scenario" (
    "id" SERIAL NOT NULL,
    "sceneId" INTEGER NOT NULL,
    "subsceneId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "gridConfig" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "backgroundPath" TEXT,
    "tiles" JSONB NOT NULL,
    "nextScenes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interaction" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "sceneId" INTEGER NOT NULL,
    "subsceneId" INTEGER NOT NULL,
    "tileId" TEXT,
    "action" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Scenario_sceneId_subsceneId_idx" ON "public"."Scenario"("sceneId", "subsceneId");

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_sceneId_subsceneId_key" ON "public"."Scenario"("sceneId", "subsceneId");

-- CreateIndex
CREATE INDEX "Interaction_sessionId_createdAt_idx" ON "public"."Interaction"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "Interaction_sceneId_subsceneId_idx" ON "public"."Interaction"("sceneId", "subsceneId");

-- AddForeignKey
ALTER TABLE "public"."Interaction" ADD CONSTRAINT "Interaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
