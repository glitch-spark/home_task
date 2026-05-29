import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { seedApplications, seedCampaign } from "./seed-data";

config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();

async function main() {
  await prisma.agentRun.deleteMany();
  await prisma.agentReview.deleteMany();
  await prisma.creatorApplication.deleteMany();
  await prisma.campaign.deleteMany();

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
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
