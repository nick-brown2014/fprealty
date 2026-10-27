-- CreateTable
CREATE TABLE "Webinar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "signUpUrl" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webinar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Webinar_startsAt_idx" ON "Webinar"("startsAt");

-- Seed the webinars previously hardcoded on the home page (times are America/Denver, stored as UTC)
INSERT INTO "Webinar" ("id", "title", "description", "image", "signUpUrl", "startsAt", "updatedAt") VALUES
(
    'webinar_first_time_buyer_2026_10',
    'First Time Home Buyer Webinar',
    'Thinking about buying your first home in Northern Colorado? This free webinar walks you through it step by step: what you can afford, down payment assistance options, getting pre-approved, writing a strong offer and what happens between contract and closing. Bring your questions.',
    '/webinar-first-time-buyer.webp',
    'https://nocohomebuyerwebinar.com/landing-page',
    '2026-10-17 01:00:00',
    CURRENT_TIMESTAMP
),
(
    'webinar_downsizing_2026_10',
    'Downsizing Made Simple',
    'Kids moved out, or just ready for less house and more life? This free webinar covers timing the sale of your current home with your next purchase, pricing and prepping to sell, low-maintenance options like ranch and patio homes, and how to make the move less stressful.',
    '/webinar-downsizing.webp',
    'https://downsize.yourhomeclass.com/register',
    '2026-10-08 01:00:00',
    CURRENT_TIMESTAMP
);
