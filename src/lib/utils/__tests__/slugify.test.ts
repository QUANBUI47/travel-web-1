import { describe, expect, it } from "vitest";

import { slugify } from "../slugify";

describe("slugify", () => {
  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("normalizes Vietnamese diacritics", () => {
    expect(slugify("Hà Nội")).toBe("ha-noi");
  });

  it("collapses spaces and strips invalid characters", () => {
    expect(slugify("  Tour   Đà Nẵng!!  ")).toBe("tour-a-nang");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("--phu-quoc--")).toBe("phu-quoc");
  });
});
