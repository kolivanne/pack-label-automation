import { describe, it, expect } from "vitest";
import { generateOutputs } from "../../src/generate.js";
import { createHtml } from "../../src/generate.js";

describe("generate HTML", () => {
  it("should render product data", () => {
    const mockData = {
      product_name: "Test Product",
      flavor: "Chicken",
      brand_color: "#FFAA00",
      weight: "1kg",
      claims: ["Healthy", "Tasty"],
    };

    const html = createHtml(mockData);

    expect(html).toContain("Test Product");
    expect(html).toContain("Chicken");
    expect(html).toContain("1kg");
    expect(html).toContain("#FFAA00");
    expect(html).toContain("Healthy");
    expect(html).toContain("Tasty");
  });
});
