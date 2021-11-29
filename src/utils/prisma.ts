import { Prisma } from "@prisma/client";

export const isPrismaJsonObject = (
  input: unknown
): input is Prisma.JsonObject => {
  return typeof input === "object" && input !== null && !Array.isArray(input);
};
