import assert from "node:assert";
import fs from "fs";
import puppeteer from "puppeteer";
import { generateOutputs } from "../../src/generate.js";

console.log("Running Generate Integration Tests\n");

const mockData = {
  product_name: "Test Product",
  flavor: "Chicken",
  brand_color: "#FFAA00",
  weight: "1kg",
  claims: ["Healthy", "Tasty"],
};

let browser;

async function runTests() {
  browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    // CASE 1: normal generation
    const htmlPath = await generateOutputs(mockData, browser);

    assert.ok(typeof htmlPath === "string");
    assert.ok(fs.existsSync(htmlPath));

    const html = fs.readFileSync(htmlPath, "utf8");

    assert.ok(html.includes("Test Product"));
    assert.ok(html.includes("Chicken"));

    // CASE 2: empty claims
    const edgeData = { ...mockData, claims: [] };

    const edgePath = await generateOutputs(edgeData, browser);
    const edgeHtml = fs.readFileSync(edgePath, "utf8");

    assert.ok(edgeHtml.includes("<ul"));

    // CASE 3: invalid browser
    try {
      await generateOutputs(mockData, null);
      assert.fail("Should throw if browser is missing");
    } catch (err) {
      assert.ok(err.message.includes("Browser"));
    }

    console.log("Generate integration tests passed!");
  } catch (err) {
    console.error("Generate integration test failed:");
    console.error(err);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runTests();
