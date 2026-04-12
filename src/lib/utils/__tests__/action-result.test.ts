import { describe, expect, it } from "vitest";

import { getSafeActionErrorMessage } from "../action-result";

describe("getSafeActionErrorMessage", () => {
  const t = (key: string) =>
    key === "VIVU_API_ERROR_401" ? "Please login" : key;

  it("translates VIVU server error keys", () => {
    expect(
      getSafeActionErrorMessage(
        { serverError: "VIVU_API_ERROR_401" },
        t,
        "fallback",
      ),
    ).toBe("Please login");
  });

  it("returns fallback when no known error", () => {
    expect(getSafeActionErrorMessage({}, t, "Something went wrong")).toBe(
      "Something went wrong",
    );
  });

  it("uses validation root errors when present", () => {
    expect(
      getSafeActionErrorMessage(
        { validationErrors: { _errors: ["Invalid modules"] } },
        t,
        "fallback",
      ),
    ).toBe("Invalid modules");
  });
});
