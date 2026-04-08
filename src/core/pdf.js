import { PAGE_MARGINS } from "./build.js";

export async function exportPdf(html, outputPath, { format = "A4" } = {}) {
  let puppeteer;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    throw new Error(
      "Puppeteer is required for PDF export. Install it: npm install puppeteer",
    );
  }

  const browser = await puppeteer.default.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: outputPath,
      format,
      printBackground: true,
      margin: PAGE_MARGINS,
    });
  } finally {
    await browser.close();
  }
}
