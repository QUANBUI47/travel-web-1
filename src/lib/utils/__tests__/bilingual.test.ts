import { describe, expect, it } from "vitest";

import { parseBilingualValue } from "../bilingual";

describe("parseBilingualValue", () => {
  it("returns empty strings for nullish input", () => {
    expect(parseBilingualValue(null)).toEqual({ vi: "", en: "" });
  });

  it("maps plain string to vi only", () => {
    expect(parseBilingualValue("Hello")).toEqual({ vi: "Hello", en: "" });
  });

  it("preserves bilingual object", () => {
    expect(parseBilingualValue({ vi: "Xin chào", en: "Hello" })).toEqual({
      vi: "Xin chào",
      en: "Hello",
    });
  });
});
