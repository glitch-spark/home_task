import { PrismaClient } from "@prisma/client";
import { seedApplications, seedCampaign } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.campaign.count();
  if (existing > 0) {
    console.log(`Database already seeded (${existing} campaign(s)). Skipping.`);
    return;
  }

  const campaign = await prisma.campaign.create({ data: seedCampaign });

  for (const app of seedApplications) {
    await prisma.creatorApplication.create({
      data: { campaignId: campaign.id, ...app },
    });
  }

  console.log(
    `Seeded 1 campaign (${campaign.id}) and ${seedApplications.length} creator applications.`
  );
}

main()
  .catch((e) => {
    console.error("Bootstrap seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
