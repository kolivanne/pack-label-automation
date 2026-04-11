import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { validateProduct } from './validate.js';

async function main() {
  console.log(chalk.blue.bold("Starting Packaging Automation Workflow\n"));

  const filePath = path.resolve("data/products.csv");

  try {
    const rawData = fs.readFileSync(filePath, "utf8");

    const records = parse(rawData, {
      columns: true,
      skip_empty_lines: true
    });

    if (!Array.isArray(records) || records.length === 0) {
      console.error(chalk.red("No valid product records found"));
      process.exit(1);
    }

    for (const record of records) {
      const report = validateProduct(record);

      console.log(chalk.bold(`\n${report.name}:`));

      if (!report.isValid) {
        report.errors.forEach(err => console.log(chalk.red(`Error: ${err}`)));
        console.log(chalk.red("Skipping generation due to critical errors.\n"));
        continue;
      }

      report.warnings.forEach(warn => console.log(chalk.yellow(`Warning: ${warn}`)));
      console.log(chalk.green("Validated successfully."));
    }

  } catch (err) {
    console.error(chalk.red("Failed to load or parse data:"), err.message);
    process.exit(1);
  }
}

main();