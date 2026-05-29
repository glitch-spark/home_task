import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "needs_info",
]);

export const listApplicationsQuerySchema = z.object({
  campaignId: z.string().cuid().optional(),
  status: applicationStatusSchema.optional(),
  platform: z.string().min(1).optional(),
  sort: z.enum(["followers", "fitScore", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const patchApplicationBodySchema = z
  .object({
    status: applicationStatusSchema.optional(),
    manualNote: z.string().nullable().optional(),
  })
  .refine(
    (body) => body.status !== undefined || body.manualNote !== undefined,
    { message: "Provide status and/or manualNote" }
  );

export const applicationIdParamsSchema = z.object({
  id: z.string().cuid(),
});

export const runsQuerySchema = z.object({
  verbose: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});
