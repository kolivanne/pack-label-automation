import { describe, it, expect } from "vitest";
import { validateProduct } from "../../src/validate.js";

describe("validateProduct", () => {
  it("valid data should pass", () => {
    const validData = {
      product_name: "Test Juice",
      flavor: "Orange",
      brand_color: "#FF5733",
      weight: "500ml",
      claims: "Fresh,Organic",
    };

    const result = validateProduct(validData);

    expect(result.isValid).toBe(true);
  });

  it("missing flavor should fail", () => {
    const invalidData = {
      product_name: "No Flavor",
      brand_color: "#FF5733",
      weight: "500ml",
    };

    const result = validateProduct(invalidData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Missing flavor");
  });

  it("invalid hex color should fail", () => {
    const badColorData = {
      product_name: "Bad Color",
      flavor: "Lime",
      brand_color: "NOT-A-COLOR",
      weight: "1kg",
    };

    const result = validateProduct(badColorData);

    expect(result.isValid).toBe(false);
  });

  it("empty claims should still be valid but warn", () => {
    const noClaimsData = {
      product_name: "No Claims",
      flavor: "Apple",
      brand_color: "#FFFFFF",
      weight: "1kg",
      claims: "",
    };

    const result = validateProduct(noClaimsData);

    expect(result.isValid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
