-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'approved', 'rejected', 'needs_info');

-- CreateEnum
CREATE TYPE "AgentRecommendation" AS ENUM ('approve', 'reject', 'needs_info', 'manual_review');

-- CreateEnum
CREATE TYPE "AgentRunStatus" AS ENUM ('success', 'failed');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "campaignGoal" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "platforms" TEXT[],
    "budgetRange" TEXT NOT NULL,
    "requirements" TEXT[],
    "brandSafetyNotes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorApplication" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "engagementRate" DOUBLE PRECISION NOT NULL,
    "audienceSummary" TEXT NOT NULL,
    "contentStyle" TEXT NOT NULL,
    "applicationMessage" TEXT NOT NULL,
    "pastBrandDeals" TEXT[],
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "manualNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentReview" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fitScore" INTEGER NOT NULL,
    "recommendation" "AgentRecommendation" NOT NULL,
    "reasoning" TEXT NOT NULL,
    "risks" TEXT[],
    "missingInfo" TEXT[],
    "suggestedReply" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "status" "AgentRunStatus" NOT NULL,
    "rawInput" JSONB NOT NULL,
    "rawOutput" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewId" TEXT,

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Campaign_createdAt_idx" ON "Campaign"("createdAt");

-- CreateIndex
CREATE INDEX "CreatorApplication_campaignId_idx" ON "CreatorApplication"("campaignId");

-- CreateIndex
CREATE INDEX "CreatorApplication_status_idx" ON "CreatorApplication"("status");

-- CreateIndex
CREATE INDEX "CreatorApplication_platform_idx" ON "CreatorApplication"("platform");

-- CreateIndex
CREATE INDEX "CreatorApplication_followers_idx" ON "CreatorApplication"("followers");

-- CreateIndex
CREATE INDEX "CreatorApplication_campaignId_status_idx" ON "CreatorApplication"("campaignId", "status");

-- CreateIndex
CREATE INDEX "AgentReview_applicationId_createdAt_idx" ON "AgentReview"("applicationId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "AgentRun_reviewId_key" ON "AgentRun"("reviewId");

-- CreateIndex
CREATE INDEX "AgentRun_applicationId_createdAt_idx" ON "AgentRun"("applicationId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "CreatorApplication" ADD CONSTRAINT "CreatorApplication_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentReview" ADD CONSTRAINT "AgentReview_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "CreatorApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "CreatorApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "AgentReview"("id") ON DELETE SET NULL ON UPDATE CASCADE;
