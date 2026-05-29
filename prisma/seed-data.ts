import { ApplicationStatus } from "@prisma/client";

export const seedCampaign = {
  brandName: "GlowPop",
  campaignName: "GlowPop Summer Launch",
  campaignGoal:
    "Drive awareness and trial for a new SPF lip balm among Gen Z consumers.",
  targetAudience:
    "Gen Z women, beauty lovers, college students, skincare beginners",
  platforms: ["TikTok", "Instagram"],
  budgetRange: "$2,000 - $10,000 per creator",
  requirements: [
    "Creator must be comfortable showing product usage on camera",
    "Must mention SPF benefits",
    "Must not make medical claims",
    "Content should feel fun, casual, and summer-focused",
  ],
  brandSafetyNotes:
    "Avoid creators with controversial content, heavy profanity, or unsafe skincare claims.",
};

/** Seven creators — within PDF 6–8 range, mixed fit profiles. */
export const seedApplications = [
  {
    creatorName: "Mia Lopez",
    handle: "@miaglow",
    platform: "TikTok",
    followers: 820000,
    engagementRate: 4.9,
    audienceSummary:
      "Gen Z women interested in beauty, skincare, and affordable routines.",
    contentStyle: "Fast-paced GRWM videos, humor, product reactions.",
    applicationMessage:
      "I can create a summer GRWM using the lip balm before heading to the beach.",
    pastBrandDeals: ["e.l.f.", "Bubble Skincare"],
    status: ApplicationStatus.pending,
  },
  {
    creatorName: "Daniel Kim",
    handle: "@danielreviews",
    platform: "YouTube",
    followers: 410000,
    engagementRate: 6.2,
    audienceSummary: "Tech and productivity audience, mostly men 18-34.",
    contentStyle: "Detailed review videos and comparison content.",
    applicationMessage:
      "I can review the product from an everyday carry perspective.",
    pastBrandDeals: ["Notion", "Samsung"],
    status: ApplicationStatus.pending,
  },
  {
    creatorName: "Ava Martinez",
    handle: "@avastyle",
    platform: "Instagram",
    followers: 1200000,
    engagementRate: 2.7,
    audienceSummary: "Fashion, travel, luxury lifestyle audience.",
    contentStyle: "Polished aspirational photo and Reel content.",
    applicationMessage:
      "This could fit naturally into my summer travel content.",
    pastBrandDeals: ["Revolve", "Dior Beauty"],
    status: ApplicationStatus.pending,
  },
  {
    creatorName: "Jordan Lee",
    handle: "@jordansun",
    platform: "TikTok",
    followers: 145000,
    engagementRate: 7.1,
    audienceSummary:
      "College students, outdoor lifestyle, budget beauty tips.",
    contentStyle: "Casual vlogs, dorm routines, SPF reminders.",
    applicationMessage:
      "I'd love to show the balm in my morning routine before class and at the pool.",
    pastBrandDeals: ["CeraVe", "Target Beauty"],
    status: ApplicationStatus.pending,
  },
  {
    creatorName: "Sam Rivera",
    handle: "@samskincare",
    platform: "Instagram",
    followers: 95000,
    engagementRate: 5.4,
    audienceSummary:
      "Skincare enthusiasts, ingredient-focused, mixed Gen Z/Millennial.",
    contentStyle: "Educational carousels, ingredient breakdowns, dupes.",
    applicationMessage:
      "I can explain SPF in lip products without medical claims and compare textures on camera.",
    pastBrandDeals: ["The Ordinary", "Paula's Choice"],
    status: ApplicationStatus.needs_info,
    manualNote:
      "Asked for deliverable count and usage rights — waiting on reply.",
  },
  {
    creatorName: "Chris Park",
    handle: "@chrisparktv",
    platform: "YouTube",
    followers: 2200000,
    engagementRate: 1.8,
    audienceSummary: "Broad entertainment, pranks, challenge content.",
    contentStyle: "High-energy challenges, minimal beauty focus.",
    applicationMessage:
      "I will put your lip balm in a giant summer challenge video.",
    pastBrandDeals: ["Energy drink brands", "Mobile games"],
    status: ApplicationStatus.pending,
  },
  {
    creatorName: "Priya Nair",
    handle: "@priyaglows",
    platform: "TikTok",
    followers: 310000,
    engagementRate: 6.8,
    audienceSummary:
      "South Asian diaspora beauty, GRWM, festival and wedding prep.",
    contentStyle: "Tutorial-style GRWM, cultural beauty moments.",
    applicationMessage:
      "Summer wedding season GRWM with SPF touch-ups using your balm.",
    pastBrandDeals: ["Fenty Beauty", "Morphe"],
    status: ApplicationStatus.approved,
    manualNote: "Strong fit — approved pending contract.",
  },
];
