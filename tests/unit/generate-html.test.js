import assert from "node:assert";
import { createHtml } from "../../src/generate.js";

console.log("Running Generate HTML Unit Tests\n");

const mockData = {
  product_name: "Test Product",
  flavor: "Chicken",
  brand_color: "#FFAA00",
  weight: "1kg",
  claims: ["Healthy", "Tasty"],
};

try {
  const html = createHtml(mockData);

  assert.ok(typeof html === "string");
  assert.ok(html.length > 0);

  assert.ok(html.includes("Test Product"));
  assert.ok(html.includes("Chicken"));
  assert.ok(html.includes("1kg"));
  assert.ok(html.includes("#FFAA00"));

  // stricter checks for array rendering
  assert.ok(html.match(/Healthy/));
  assert.ok(html.match(/Tasty/));

  // ensure structure integrity
  assert.ok(html.includes("<html") || html.includes("<body"));

  console.log("Generate HTML tests passed!");
} catch (err) {
  console.error("Generate HTML test failed:");
  console.error(err);
  process.exit(1);
}
