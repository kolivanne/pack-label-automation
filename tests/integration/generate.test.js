import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs";
import puppeteer from "puppeteer";
import { generateOutputs } from "../../src/generate.js";
import { createHtml } from "../../src/generate.js";

const mockData = {
  product_name: "Test Product",
  flavor: "Chicken",
  brand_color: "#FFAA00",
  weight: "1kg",
  claims: ["Healthy", "Tasty"],
};

let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
});

afterAll(async () => {
  await browser.close();
});

describe("generate outputs", () => {
  it("creates html file", async () => {
    const htmlPath = await generateOutputs(mockData, browser);

    expect(typeof htmlPath).toBe("string");
    expect(fs.existsSync(htmlPath)).toBe(true);

    const html = fs.readFileSync(htmlPath, "utf8");
    expect(html).toContain("Test Product");
    expect(html).toContain("Chicken");
  });

  it("handles empty claims", async () => {
    const edgeData = { ...mockData, claims: [] };

    const edgePath = await generateOutputs(edgeData, browser);
    const edgeHtml = fs.readFileSync(edgePath, "utf8");

    expect(edgeHtml).toContain("<ul");
  });

  it("throws without browser", async () => {
    await expect(generateOutputs(mockData, null)).rejects.toThrow(/Browser/);
  });
});
