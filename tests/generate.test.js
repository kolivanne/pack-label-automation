import assert from "node:assert";
import fs from "fs";
import puppeteer from "puppeteer";
import { generateOutputs } from "../src/generate.js";

console.log("Running Generate Unit Tests\n");

const mockData = {
  product_name: "Test Product",
  flavor: "Chicken",
  brand_color: "#FFAA00",
  weight: "1kg",
  claims: ["Healthy", "Tasty"],
};

let browser;

try {
  browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Test Case 1: Happy Path
  const resultPath = await generateOutputs(mockData, browser);

  assert.ok(typeof resultPath === "string");
  assert.ok(fs.existsSync(resultPath));

  const html = fs.readFileSync(resultPath, "utf8");

  assert.ok(html.includes("Test Product"));
  assert.ok(html.includes("Chicken"));
  assert.ok(html.includes("1kg"));
  assert.ok(html.includes("#FFAA00"));
  assert.ok(html.includes("Healthy"));
  assert.ok(html.includes("Tasty"));

  // Test Case 2: Empty claims
  const edgeData = { ...mockData, claims: [] };

  const edgePath = await generateOutputs(edgeData, browser);
  const edgeHtml = fs.readFileSync(edgePath, "utf8");

  assert.ok(edgeHtml.includes("<ul"));

  // Test Case 3: Missing browser
  try {
    await generateOutputs(mockData, null);
    assert.fail("Should throw if browser is missing");
  } catch (err) {
    assert.ok(err.message.includes("Browser"));
  }

  console.log("All Generate tests passed!");
} catch (err) {
  console.error("Generate Test failed:");
  console.error(err);
  process.exit(1);
} finally {
  if (browser) {
    await browser.close();
  }
}
