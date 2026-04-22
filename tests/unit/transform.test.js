import assert from "node:assert";
import { transformToDesignData } from "../../src/transform.js";

console.log("Running Transform Unit Tests\n");

try {
  // Test Case 1: HAPPY PATH
  const validInput = {
    product_name: "Test Product",
    flavor: "Vanilla",
    brand_color: "#FFFFFF",
    weight: "500g",
    claims: "Fresh,Natural,Organic",
  };

  const resultHappyPath = transformToDesignData(validInput);

  assert.strictEqual(resultHappyPath.product_name, "Test Product");
  assert.deepStrictEqual(resultHappyPath.claims, [
    "Fresh",
    "Natural",
    "Organic",
  ]);
  assert.strictEqual(resultHappyPath.illustrator_metadata.slug, "test-product");

  // Test Case 2: Missing claims (edge case))
  const missingClaims = {
    product_name: "No Claims Product",
    flavor: "Apple",
    brand_color: "#000000",
    weight: "1kg",
    claims: "",
  };

  const resultMissingClaims = transformToDesignData(missingClaims);

  assert.deepStrictEqual(resultMissingClaims.claims, []);
  assert.strictEqual(
    resultMissingClaims.illustrator_metadata.slug,
    "no-claims-product",
  );

  // Test Case 3: Missing product name
  const missingName = {
    product_name: "",
    flavor: "Berry",
    brand_color: "#123456",
    weight: "250g",
    claims: "Test",
  };

  const resultProductName = transformToDesignData(missingName);
  assert.strictEqual(
    resultProductName.illustrator_metadata.slug,
    "unknown-product",
  );

  console.log("All Transform tests passed successfully!");
} catch (err) {
  console.error("Transform test failed:");
  console.error(err.message);
  process.exit(1);
}
