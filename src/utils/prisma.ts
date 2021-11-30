import { Prisma } from "@prisma/client";

export const isPrismaJsonObject = (
  input: unknown
): input is Prisma.JsonObject => {
  return typeof input === "object" && input !== null && !Array.isArray(input);
};

export const parsePrismaJsonObject = (propValues: Prisma.JsonValue) => {
  if (
    !propValues ||
    typeof propValues !== "object" ||
    Array.isArray(propValues)
  ) {
    throw new Error("propValues must be an object");
  }
  const result = [];
  for (const key in propValues) {
    if (!key) continue;
    const value = propValues[key];
    if (!value) continue;
    if (!isPrismaJsonObject(value)) continue;
    result.push({ key, value });
  }
  return result;
};
