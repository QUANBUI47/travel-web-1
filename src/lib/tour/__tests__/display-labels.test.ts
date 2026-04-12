import { describe, expect, it } from "vitest";

import { formatTourType, formatTransport } from "../display-labels";

const t = (key: string) => `t:${key}`;

describe("formatTourType", () => {
  it("maps known DB labels to i18n keys", () => {
    expect(formatTourType("Ghép đoàn", t)).toBe("t:tour_type_group");
    expect(formatTourType("Tour riêng", t)).toBe("t:tour_type_private");
  });

  it("uses fallback key when value is empty", () => {
    expect(formatTourType(null, t)).toBe("t:tour_type_group");
  });

  it("returns raw value for unknown labels", () => {
    expect(formatTourType("Custom type", t)).toBe("Custom type");
  });
});

describe("formatTransport", () => {
  it("maps known transport labels", () => {
    expect(formatTransport("Ô tô", t)).toBe("t:transport_bus");
    expect(formatTransport("Xe cao cấp", t)).toBe("t:transport_luxury_bus");
  });

  it("uses fallback when value is empty", () => {
    expect(formatTransport(undefined, t)).toBe("t:transport_bus");
  });
});
