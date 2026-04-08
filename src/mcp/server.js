import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { writeFile, readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { resolve, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { build, mergeBrand, loadBrand, listComponents, exportPdf } from "../core/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(resolve(__dirname, "../../package.json"), "utf-8"));

const server = new McpServer({
  name: pkg.name,
  version: pkg.version,
  description: "Build branded HTML/PDF documents from markdown",
});

// Load default brand from MODDOC_BRAND env var if set
let defaultBrandConfig = null;
if (process.env.MODDOC_BRAND) {
  try {
    defaultBrandConfig = await loadBrand(resolve(process.env.MODDOC_BRAND));
  } catch (e) {
    console.error(`Warning: Could not load brand from MODDOC_BRAND="${process.env.MODDOC_BRAND}": ${e.message}`);
  }
}

// ─── build_document ───
server.tool(
  "build_document",
  "Build a branded HTML document from markdown content. Returns the HTML and optionally saves to file.",
  {
    content: z.string().describe("Markdown or HTML content to render"),
    title: z.string().optional().describe("Document title"),
    brand: z.string().optional().describe("Path to brand.json file"),
    brandOverrides: z
      .object({
        name: z.string().optional(),
        tagline: z.string().optional(),
        web: z.string().optional(),
        email: z.string().optional(),
        colors: z
          .object({
            primary: z.string().optional(),
            accent: z.string().optional(),
            muted: z.string().optional(),
            surface: z.string().optional(),
          })
          .optional(),
        fonts: z
          .object({
            heading: z.string().optional(),
            body: z.string().optional(),
          })
          .optional(),
        style: z.enum(["modern", "formal", "minimal", "executive", "creative", "technical", "invoice", "compact"]).optional(),
      })
      .optional()
      .describe("Inline brand overrides"),
    outputPath: z.string().optional().describe("Where to save the HTML file"),
    isHtml: z
      .boolean()
      .optional()
      .describe("Set to true if content is already HTML, not markdown"),
  },
  async ({ content, title, brand: brandPath, brandOverrides, outputPath, isHtml }) => {
    let brandConfig;
    if (brandPath) {
      brandConfig = await loadBrand(resolve(brandPath));
      if (brandOverrides) brandConfig = mergeBrand({ ...brandConfig, ...brandOverrides });
    } else if (defaultBrandConfig) {
      brandConfig = brandOverrides ? mergeBrand({ ...defaultBrandConfig, ...brandOverrides }) : defaultBrandConfig;
    } else {
      brandConfig = mergeBrand(brandOverrides);
    }

    const html = build(content, brandConfig, { title, isHtml });
    const sizeKB = (Buffer.byteLength(html, "utf-8") / 1024).toFixed(1);

    if (outputPath) {
      const fullPath = resolve(outputPath);
      await writeFile(fullPath, html, "utf-8");
      return {
        content: [
          {
            type: "text",
            text: `Document saved to ${fullPath} (${sizeKB} KB)\n\nThe HTML file is self-contained — it can be opened directly in any browser, sent via email/chat, or printed to PDF.`,
          },
        ],
      };
    }

    return {
      content: [{ type: "text", text: html }],
    };
  },
);

// ─── export_pdf ───
server.tool(
  "export_pdf",
  "Convert an HTML document to A4 PDF using headless browser rendering.",
  {
    htmlPath: z.string().describe("Path to the HTML file to convert"),
    outputPath: z.string().optional().describe("Where to save the PDF (default: same name .pdf)"),
    format: z.enum(["A4", "Letter"]).optional().describe("Paper format"),
  },
  async ({ htmlPath, outputPath, format }) => {
    const fullHtmlPath = resolve(htmlPath);
    const html = await readFile(fullHtmlPath, "utf-8");
    const pdfPath = outputPath
      ? resolve(outputPath)
      : fullHtmlPath.replace(extname(fullHtmlPath), ".pdf");

    await exportPdf(html, pdfPath, { format: format || "A4" });

    return {
      content: [
        {
          type: "text",
          text: `PDF saved to ${pdfPath}`,
        },
      ],
    };
  },
);

// ─── full_pipeline ───
server.tool(
  "full_pipeline",
  "Complete pipeline: markdown → branded HTML → PDF in one step.",
  {
    content: z.string().describe("Markdown content"),
    title: z.string().optional().describe("Document title"),
    brand: z.string().optional().describe("Path to brand.json"),
    brandOverrides: z
      .object({
        name: z.string().optional(),
        colors: z
          .object({
            primary: z.string().optional(),
            accent: z.string().optional(),
          })
          .optional(),
        style: z.enum(["modern", "formal", "minimal", "executive", "creative", "technical", "invoice", "compact"]).optional(),
      })
      .optional(),
    outputDir: z.string().optional().describe("Output directory (default: current)"),
    filename: z.string().optional().describe("Base filename without extension"),
    formats: z
      .array(z.enum(["html", "pdf"]))
      .optional()
      .describe("Which formats to generate (default: both)"),
  },
  async ({ content, title, brand: brandPath, brandOverrides, outputDir, filename, formats }) => {
    let brandConfig;
    if (brandPath) {
      brandConfig = await loadBrand(resolve(brandPath));
      if (brandOverrides) brandConfig = mergeBrand({ ...brandConfig, ...brandOverrides });
    } else if (defaultBrandConfig) {
      brandConfig = brandOverrides ? mergeBrand({ ...defaultBrandConfig, ...brandOverrides }) : defaultBrandConfig;
    } else {
      brandConfig = mergeBrand(brandOverrides);
    }

    const base = filename || "document";
    const dir = outputDir ? resolve(outputDir) : process.cwd();
    const wantHtml = !formats || formats.includes("html");
    const wantPdf = !formats || formats.includes("pdf");

    const html = build(content, brandConfig, { title });
    const results = [];

    if (wantHtml) {
      const htmlPath = resolve(dir, `${base}.html`);
      await writeFile(htmlPath, html, "utf-8");
      results.push(`HTML: ${htmlPath} (${(Buffer.byteLength(html, "utf-8") / 1024).toFixed(1)} KB)`);
    }

    if (wantPdf) {
      const pdfPath = resolve(dir, `${base}.pdf`);
      await exportPdf(html, pdfPath);
      results.push(`PDF: ${pdfPath}`);
    }

    return {
      content: [{ type: "text", text: results.join("\n") }],
    };
  },
);

// ─── list_components ───
server.tool(
  "list_components",
  "List all available HTML components you can use in documents (boxes, timelines, metrics, etc.).",
  {},
  async () => {
    const components = listComponents();
    const text = components
      .map(
        (c) =>
          `### ${c.name}\n${c.description}\nVariants: ${c.variants.join(", ")}\n\`\`\`html\n${c.example}\n\`\`\``,
      )
      .join("\n\n");
    return {
      content: [{ type: "text", text }],
    };
  },
);

// ─── list_styles ───
server.tool(
  "list_styles",
  "List available document style presets.",
  {},
  async () => {
    const { STYLE_PRESETS } = await import("../core/build.js");
    const lines = Object.entries(STYLE_PRESETS).map(
      ([key, s]) => `**${key}** — ${s.label}: ${s.desc}`
    );
    return {
      content: [{ type: "text", text: lines.join("\n\n") }],
    };
  },
);

// ─── Start ───
const transport = new StdioServerTransport();
await server.connect(transport);
