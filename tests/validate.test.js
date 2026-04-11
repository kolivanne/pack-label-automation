import assert from 'node:assert';
import { validateProduct } from '../src/validate.js';

console.log("Running Validation Unit Tests\n");

try {
  // Test Case 1: Valid Data
  const validData = {
    product_name: "Test Juice",
    flavor: "Orange",
    brand_color: "#FF5733",
    weight: "500ml",
    claims: "Fresh,Organic"
  };
  const resultValidData = validateProduct(validData);
  assert.strictEqual(resultValidData.isValid, true, "Should be valid with correct data");

  // Test Case 2: Missing Required Field
  const invalidData = {
    product_name: "No Flavor",
    brand_color: "#FF5733",
    weight: "500ml"
    // flavor missing
  };
  const resultInvalidData = validateProduct(invalidData);
  assert.strictEqual(resultInvalidData.isValid, false, "Should fail when flavor is missing");
  assert.ok(resultInvalidData.errors.includes("Missing flavor"), "Error should mention missing flavor");

  // Test Case 3: Invalid Color Hex
  const badColorData = {
    product_name: "Bad Color",
    flavor: "Lime",
    brand_color: "NOT-A-COLOR",
    weight: "1kg"
  };
  const resultInvalidColorHex = validateProduct(badColorData);
  assert.strictEqual(resultInvalidColorHex.isValid, false, "Should fail with invalid hex color");

  // Test Case 4: Empty Claims → Warning only
  const noClaimsData = {
    product_name: "No Claims",
    flavor: "Apple",
    brand_color: "#FFFFFF",
    weight: "1kg",
    claims: ""
  };
  const resultEmptyClaims = validateProduct(noClaimsData);
  assert.strictEqual(resultEmptyClaims.isValid, true, "Should still be valid without claims");
  assert.ok(resultEmptyClaims.warnings.length > 0, "Should produce a warning for missing claims");

  console.log("All Validate tests passed successfully!");
} catch (error) {
  console.error("Validate test failed:");
  console.error(error.message);
  process.exit(1);
}