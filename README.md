# Packaging Workflow Automation

This project demonstrates a simplified workflow for packaging automation, connecting structured product data to production-ready design previews.

## How it Works

1. **Ingest**: Reads `products.csv` containing Stock Keeping Unit (SKU) details.
2. **Validate**: Checks hex codes and required packaging copy.
3. **Transform**: Formats data into JSON "Design Tokens" for Adobe Illustrator.
4. **Generate**: Produces HTML and PDF previews using Puppeteer.

## Setup

1. `npm install`
2. `npm run test:all`
3. `node src/index.js`

## Tech Stack

- **Node.js**: Core orchestrator.
- **Vitest**: Unit, integration, and E2E testing.
- **Puppeteer**: PDF rendering engine.
- **Handlebars**: HTML templating engine.
- **CSV Parse**: Data ingestion layer.
- **Chalk**: CLI visual feedback.
