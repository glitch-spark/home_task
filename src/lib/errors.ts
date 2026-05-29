import { Prisma } from "@prisma/client";
import { jsonError } from "@/lib/api-response";

export class ApplicationNotFoundError extends Error {
  constructor() {
    super("Application not found");
    this.name = "ApplicationNotFoundError";
  }
}

export class CampaignNotFoundError extends Error {
  constructor() {
    super("Campaign not found");
    this.name = "CampaignNotFoundError";
  }
}

export function isPrismaNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof Error && error.name === "ReviewRateLimitError") {
    return jsonError(error.message, 429);
  }
  if (error instanceof Error && error.name === "PromptInjectionError") {
    return jsonError(error.message, 400);
  }
  if (
    error instanceof ApplicationNotFoundError ||
    error instanceof CampaignNotFoundError
  ) {
    return jsonError(error.message, 404);
  }
  if (isPrismaNotFound(error)) {
    return jsonError("Resource not found", 404);
  }
  if (error instanceof Error) {
    console.error(error);
    return jsonError(error.message, 500);
  }
  return jsonError("Internal server error", 500);
}
