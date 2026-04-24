import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

describe("E2E pipeline", () => {
  it("runs full pipeline", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pipeline-test-"));

    const originalCwd = process.cwd();

    try {
      process.chdir(tempDir);

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

      const projectRoot = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../../",
      );

      execSync(`node ${path.join(projectRoot, "src/index.js")}`, {
        stdio: "inherit",
        cwd: tempDir,
      });

      const outputDir = path.join(tempDir, "output");

      expect(fs.existsSync(outputDir)).toBe(true);

      const files = fs.readdirSync(outputDir);

      expect(files.some((f) => f.endsWith(".html"))).toBe(true);
      expect(files.some((f) => f.endsWith(".pdf"))).toBe(true);
    } finally {
      process.chdir(originalCwd);
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
