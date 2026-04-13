import chalk from "chalk";

const prefix = (label) => `[${label}]`;

export const logger = {
  info: (msg) => console.log(chalk.blue(prefix("INFO")), msg),
  success: (msg) => console.log(chalk.green(prefix("SUCCESS")), msg),
  warn: (msg) => console.log(chalk.yellow(prefix("WARN")), msg),
  error: (msg) => console.error(chalk.red(prefix("ERROR")), msg),

  headline: (msg) => console.log(chalk.blue.bold(`\n${msg}\n`)),
  section: (msg) => console.log(chalk.bold(`\n${msg}`)),

  muted: (msg) => console.log(chalk.gray(msg)),
};
