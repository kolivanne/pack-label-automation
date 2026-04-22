import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";
import assert from "node:assert";
import { fileURLToPath } from "url";

console.log("Running E2E Pipeline Test\n");

/**
 * In ES Modules, __dirname does NOT exist (unlike CommonJS).
 * We recreate it manually using import.meta.url.
 *
 * Why we need this:
 * - We want a stable reference to the location of THIS test file
 * - This allows us to resolve the real project root reliably
 * - It works независимо of process.cwd() or process.chdir()
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve the project root based on the test file location.
 *
 * Our structure:
 * tests/e2e/pipeline.test.js
 * → ../../ brings us back to the project root
 *
 * IMPORTANT:
 * We do this BEFORE changing the working directory.
 */
const projectRoot = path.resolve(__dirname, "../../");

/**
 * Optional safety check:
 * Ensures we actually resolved the correct project root.
 * This prevents silent failures in CI.
 */
if (!fs.existsSync(path.join(projectRoot, "src/index.js"))) {
  throw new Error("Project root resolution failed");
}

/**
 * Create a temporary working directory.
 *
 * Why:
 * - Keeps the test isolated
 * - Prevents pollution of real project files
 * - Avoids conflicts between test runs
 */
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pipeline-test-"));

/**
 * Change the current working directory.
 *
 * Why:
 * - Your application uses process.cwd() internally
 * - So we "simulate" a fresh project environment
 */
process.chdir(tempDir);

/**
 * --- TEST SETUP ---
 * We recreate the minimal environment your app expects:
 * - data/products.csv
 * - templates/layout.html
 */

/**
 * Create CSV input
 *
 * IMPORTANT:
 * Claims must be quoted because they contain commas.
 */
fs.mkdirSync("data");

fs.writeFileSync(
  "data/products.csv",
  `product_name,flavor,brand_color,weight,claims
Test Product,Chicken,#FFAA00,1kg,"Healthy,Tasty"`,
);

/**
 * Create minimal Handlebars template
 *
 * Only include what we actually need for the test.
 * Keep it small to reduce brittleness.
 */
fs.mkdirSync("templates");

fs.writeFileSync(
  "templates/layout.html",
  `
<html>
  <body>
    <h1>{{PRODUCT_NAME}}</h1>
    <p>{{FLAVOR}}</p>
    <p>{{WEIGHT}}</p>
    <p>{{COLOR}}</p>
    <ul>
      {{#each CLAIMS}}
        <li>{{this}}</li>
      {{/each}}
    </ul>
  </body>
</html>
`,
);

/**
 * --- EXECUTION ---
 *
 * Run the real application entry point.
 *
 * Why execSync:
 * - Simulates real CLI execution
 * - Blocks until finished (simpler for testing)
 * - Ensures the full pipeline runs
 *
 * Note:
 * This will launch Puppeteer (real browser).
 */
execSync(`node ${projectRoot}/src/index.js`, {
  stdio: "inherit", // show logs for debugging
});

/**
 * --- ASSERTIONS ---
 *
 * We only check what matters:
 * - Output directory exists
 * - HTML file generated
 * - PDF file generated
 *
 * We DO NOT over-assert (keeps test robust).
 */
const outputDir = path.join(tempDir, "output");

assert.ok(fs.existsSync(outputDir), "Output directory should exist");

const files = fs.readdirSync(outputDir);

assert.ok(
  files.some((f) => f.endsWith(".html")),
  "HTML file should be generated",
);

assert.ok(
  files.some((f) => f.endsWith(".pdf")),
  "PDF file should be generated",
);

console.log("E2E test passed!");

/**
 * --- CLEANUP ---
 *
 * Remove temp directory completely.
 *
 * Why:
 * - Prevent disk clutter
 * - Avoid cross-test interference
 */
fs.rmSync(tempDir, { recursive: true, force: true });
