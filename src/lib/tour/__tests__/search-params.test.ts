import { describe, expect, it } from "vitest";

import {
  buildTourSearchUrl,
  parseTourSearchParams,
} from "@/lib/tour/search-params";

describe("tour search params", () => {
  it("builds query string", () => {
    expect(
      buildTourSearchUrl({
        destination: "ha-long",
        from: "2026-06-01",
        to: "2026-06-10",
      }),
    ).toBe("/tours?destination=ha-long&from=2026-06-01&to=2026-06-10");
  });

  it("parses search params", () => {
    expect(
      parseTourSearchParams({
        destination: "da-nang",
        q: "bien",
      }),
    ).toEqual({
      destination: "da-nang",
      q: "bien",
      from: undefined,
      to: undefined,
      type: undefined,
    });
  });
});
