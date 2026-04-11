import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

async function main() {
  console.log(chalk.blue.bold("Starting Packaging Automation Workflow\n"));

  const filePath = path.resolve('data/products.csv');

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');

    const records = parse(rawData, {
      columns: true,
      skip_empty_lines: true
    });

    if (!Array.isArray(records) || records.length === 0) {
      console.error(chalk.red("No valid product records found"));
      process.exit(1);
    }

    console.log(chalk.green("Data loaded and parsed successfully"));
    console.log(chalk.cyan(`Parsed ${records.length} products\n`));

  } catch (err) {
    console.error(chalk.red("Failed to load or parse data:"), err.message);
    process.exit(1);
  }
}

main();