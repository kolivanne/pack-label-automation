import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";
import assert from "node:assert";
import { fileURLToPath } from "url";

console.log("Running E2E Pipeline Test\n");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "../../");

if (!fs.existsSync(path.join(projectRoot, "src/index.js"))) {
  throw new Error("Project root resolution failed");
}

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pipeline-test-"));

// isolate cwd mutation safely
const originalCwd = process.cwd();
process.chdir(tempDir);

try {
  fs.mkdirSync("data");

  fs.writeFileSync(
    "data/products.csv",
    `product_name,flavor,brand_color,weight,claims
Test Product,Chicken,#FFAA00,1kg,"Healthy,Tasty"`,
  );

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

  execSync(`node ${projectRoot}/src/index.js`, {
    stdio: "inherit",
  });

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
} finally {
  process.chdir(originalCwd);
  fs.rmSync(tempDir, { recursive: true, force: true });
}
