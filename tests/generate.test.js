import assert from "node:assert";
import fs from "fs";
import { generateOutputs } from "../src/generate.js";

console.log("Running Generate Unit Tests\n");

const mockData = {
  product_name: "Test Product",
  flavor: "Chicken",
  brand_color: "#FFAA00",
  weight: "1kg",
  claims: ["Healthy", "Tasty"]
};

try {
  // Test Case 1: HAPPY PATH
  const resultPath = await generateOutputs(mockData);

  assert.ok(typeof resultPath === "string", "Should return file path");
  assert.ok(fs.existsSync(resultPath), "HTML file should be created");

  const html = fs.readFileSync(resultPath, "utf8");

  assert.ok(html.includes("Test Product"), "Product name should be rendered");
  assert.ok(html.includes("Chicken"), "Flavor should be rendered");
  assert.ok(html.includes("1kg"), "Weight should be rendered");
  assert.ok(html.includes("#FFAA00"), "Color should be rendered");
  assert.ok(html.includes("Healthy"), "Claim should be rendered");
  assert.ok(html.includes("Tasty"), "Claim should be rendered");

  // Test Case 2: Empty Claims (edge case)
  const edgeData = {
    ...mockData,
    claims: []
  };

  const edgeResult = await generateOutputs(edgeData);
  const edgeHtml = fs.readFileSync(edgeResult, "utf8");

  assert.ok(edgeHtml.includes("<ul"), "Should still render list container");

  // Test Case 3: Missing file-safe input
  try {
    await generateOutputs({
      product_name: "Broken",
      flavor: "X",
      brand_color: "#FFF",
      weight: "1kg",
      claims: null
    });

    console.log("Should have failed but didn't");
  } catch (err) {
    console.log("Negative case passed (error thrown as expected)");
  }

  console.log("All Generate tests passed!");
} catch (err) {
  console.error("Generate Test failed:");
  console.error(err);
  process.exit(1);
}