import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

const templatePath = path.join(process.cwd(), "templates", "layout.html");
const templateContent = fs.readFileSync(templatePath, "utf8");
const template = Handlebars.compile(templateContent);

function ensureOutputDir() {
  const outputDir = path.join(process.cwd(), "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  return outputDir;
}

function safeFileName(name) {
  return (name || "product")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_|_$/g, "");
}

export function createHtml(data) {
  return template({
    PRODUCT_NAME: data.product_name,
    FLAVOR: data.flavor,
    WEIGHT: data.weight,
    COLOR: data.brand_color,
    CLAIMS: data.claims || [],
  });
}

export async function generateOutputs(data, browser) {
  if (!browser) {
    throw new Error("Browser instance is required");
  }

  const outputDir = ensureOutputDir();
  const fileName = safeFileName(data.product_name);

  const html = createHtml(data);

  const htmlFilePath = path.join(outputDir, `${fileName}.html`);
  fs.writeFileSync(htmlFilePath, html);

  const page = await browser.newPage();

  try {
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.emulateMediaType("screen");

    await page.pdf({
      path: path.join(outputDir, `${fileName}.pdf`),
      format: "A4",
      printBackground: true,
      timeout: 30000,
    });
  } catch (err) {
    throw new Error(`PDF generation failed for ${fileName}: ${err.message}`);
  } finally {
    await page.close();
  }

  return htmlFilePath;
}
