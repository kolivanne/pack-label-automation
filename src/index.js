import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import pLimit from "p-limit";

import { validateProduct } from "./validate.js";
import { transformToDesignData } from "./transform.js";
import { generateOutputs } from "./generate.js";
import { logger } from "./logger.js";
import puppeteer from "puppeteer";

async function loadProducts(filePath) {
  const rawData = await fsPromises.readFile(filePath, "utf8");

  const records = parse(rawData, {
    columns: true,
    skip_empty_lines: true,
  });

  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("No valid product records found");
  }

  return records;
}

async function processProduct(record, browser) {
  const report = validateProduct(record);

  logger.section(report.name || "Unnamed Product");

  if (!report.isValid) {
    report.errors.forEach((err) => logger.error(`Validation failed: ${err}`));
    logger.warn("Skipping generation due to critical errors");
    return;
  }

  report.warnings.forEach((warn) => logger.warn(warn));
  logger.success("Validated successfully");

  const designData = transformToDesignData(record);

  await generateOutputs(designData, browser);

  logger.info(`Output generated for ${report.name}`);
}

async function main() {
  logger.headline("Starting Packaging Automation Workflow");

  const filePath = path.resolve("data/products.csv");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const records = await loadProducts(filePath);
    const limit = pLimit(3);

    await Promise.allSettled(
      records.map((record) => limit(() => processProduct(record, browser))),
    );

    logger.success("All products processed");
  } catch (err) {
    logger.error(`Fatal error: ${err.message}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();
