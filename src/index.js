import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { validateProduct } from "./validate.js";
import { transformToDesignData } from "./transform.js";
import { generateOutputs } from "./generate.js";
import { logger } from "./logger.js";
import puppeteer from "puppeteer";

async function main() {
  logger.headline("Starting Packaging Automation Workflow");

  const filePath = path.resolve("data/products.csv");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const rawData = fs.readFileSync(filePath, "utf8");

    const records = parse(rawData, {
      columns: true,
      skip_empty_lines: true,
    });

    if (!Array.isArray(records) || records.length === 0) {
      logger.error("No valid product records found");
      process.exit(1);
    }

    for (const record of records) {
      const report = validateProduct(record);

      logger.section(report.name);

      if (!report.isValid) {
        report.errors.forEach((err) =>
          logger.error(`Validation failed: ${err}`),
        );
        logger.warn("Skipping generation due to critical errors");
        continue;
      }

      report.warnings.forEach((warn) => logger.warn(warn));
      logger.success("Validated successfully");

      const designData = transformToDesignData(record);
      await generateOutputs(designData, browser);

      logger.info("Output generated in /output");
    }
  } catch (err) {
    logger.error(`Failed to load or parse data: ${err.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
