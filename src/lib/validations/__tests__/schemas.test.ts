import { describe, expect, it } from "vitest";

import { COMMON_REGEX } from "../common";
import { buildValidationSchemas } from "../schemas";

const t = ((key: string) => key) as Parameters<
  typeof buildValidationSchemas
>[0];

describe("COMMON_REGEX.SLUG", () => {
  it("accepts valid slugs", () => {
    expect(COMMON_REGEX.SLUG.test("ha-noi")).toBe(true);
    expect(COMMON_REGEX.SLUG.test("tour-da-nang-2026")).toBe(true);
  });

  it("rejects invalid slugs", () => {
    expect(COMMON_REGEX.SLUG.test("-bad")).toBe(false);
    expect(COMMON_REGEX.SLUG.test("bad-")).toBe(false);
    expect(COMMON_REGEX.SLUG.test("UPPER")).toBe(false);
  });
});

describe("buildValidationSchemas", () => {
  const schemas = buildValidationSchemas(t);

  it("parses list query params", () => {
    const result = schemas.listQuerySchema.parse({
      page: "2",
      limit: "20",
      search: "hue",
    });

    expect(result).toEqual({ page: 2, limit: 20, search: "hue" });
  });

  it("rejects slug without lowercase letters", () => {
    const result = schemas.TourSchema.safeParse({
      nameVi: "Tour test name here",
      slug: "Invalid_Slug",
      durationDays: 3,
      imageUrls: [],
      tags: [],
      isActive: true,
    });

    expect(result.success).toBe(false);
  });

  it("accepts minimal valid tour payload", () => {
    const result = schemas.TourSchema.safeParse({
      nameVi: "Tour Di sản Huế",
      slug: "tour-di-san-hue",
      durationDays: 3,
      imageUrls: ["https://example.com/a.jpg"],
      tags: [],
      isActive: true,
    });

    expect(result.success).toBe(true);
  });
});
