import { describe, expect, it } from "vitest";

import { getLocalizedValue } from "../i18n";

describe("getLocalizedValue", () => {
  it("returns empty string for nullish values", () => {
    expect(getLocalizedValue(null, "vi")).toBe("");
    expect(getLocalizedValue(undefined, "en")).toBe("");
  });

  it("returns plain strings as-is", () => {
    expect(getLocalizedValue("Hello", "en")).toBe("Hello");
  });

  it("picks locale from bilingual object", () => {
    const value = { vi: "Xin chào", en: "Hello" };

    expect(getLocalizedValue(value, "vi")).toBe("Xin chào");
    expect(getLocalizedValue(value, "en")).toBe("Hello");
  });

  it("falls back to vi when locale is missing", () => {
    const value = { vi: "Tiếng Việt" };

    expect(getLocalizedValue(value, "en")).toBe("Tiếng Việt");
  });
});
