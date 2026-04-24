import { describe, it, expect } from "vitest";
import { transformToDesignData } from "../../src/transform.js";

describe("transformToDesignData", () => {
  it("transforms valid input (happy path)", () => {
    const validInput = {
      product_name: "Test Product",
      flavor: "Vanilla",
      brand_color: "#FFFFFF",
      weight: "500g",
      claims: "Fresh,Natural,Organic",
    };

    const result = transformToDesignData(validInput);

    expect(result.product_name).toBe("Test Product");
    expect(result.claims).toEqual(["Fresh", "Natural", "Organic"]);
    expect(result.illustrator_metadata.slug).toBe("test-product");
  });

  it("handles missing claims", () => {
    const missingClaims = {
      product_name: "No Claims Product",
      flavor: "Apple",
      brand_color: "#000000",
      weight: "1kg",
      claims: "",
    };

    const result = transformToDesignData(missingClaims);

    expect(result.claims).toEqual([]);
    expect(result.illustrator_metadata.slug).toBe("no-claims-product");
  });

  it("handles missing product name", () => {
    const missingName = {
      product_name: "",
      flavor: "Berry",
      brand_color: "#123456",
      weight: "250g",
      claims: "Test",
    };

    const result = transformToDesignData(missingName);

    expect(result.illustrator_metadata.slug).toBe("unknown-product");
  });
});
