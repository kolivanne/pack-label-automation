import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

export async function generateOutputs(data) {
  const templatePath = path.join(process.cwd(), 'templates', 'layout.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  const mapping = {
    '{{PRODUCT_NAME}}': data.product_name,
    '{{FLAVOR}}': data.flavor,
    '{{WEIGHT}}': data.weight,
    '{{COLOR}}': data.brand_color,
    '{{CLAIMS}}': (data.claims || []).map(c => `<li>${c}</li>`).join('')
  };

  Object.entries(mapping).forEach(([key, val]) => {
    html = html.replaceAll(key, val);
  });

  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const fileName = `${data.product_name.replace(/\s+/g, '_')}`;
  const htmlFilePath = path.join(outputDir, `${fileName}.html`);
  fs.writeFileSync(htmlFilePath, html);


const browser = await puppeteer.launch({
  headless: "new", 
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({ path: path.join(outputDir, `${fileName}.pdf`), format: 'A4' });
  await browser.close();

  return htmlFilePath;
}