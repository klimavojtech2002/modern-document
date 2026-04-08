#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve, extname, basename } from "node:path";
import { build, mergeBrand, loadBrand, listComponents, exportPdf } from "../core/index.js";

const args = process.argv.slice(2);
const cmd = args[0];

function flag(name) {
  const i = args.indexOf(name);
  if (i === -1) return null;
  return args[i + 1] || true;
}

function usage() {
  console.log(`
  moddoc — Modern Document CLI

  Usage:
    moddoc build <file.md>           Build HTML from markdown
    moddoc pdf <file.html>           Convert HTML to PDF
    moddoc pipe <file.md>            Full pipeline: MD → HTML + PDF
    moddoc components                List available components
    moddoc styles                    List available style presets
    moddoc mcp                       Start MCP server (for Claude Code)

  Options:
    -o <path>        Output file path
    --brand <path>   Path to brand.json
    --style <name>   Style preset: modern | formal | minimal | executive | creative | technical | invoice | compact
    --title <text>   Document title
  `);
}

async function getBrand() {
  const brandPath = flag("--brand");
  const style = flag("--style");
  if (brandPath) {
    const b = await loadBrand(resolve(brandPath));
    if (style) b.style = style;
    return b;
  }
  return mergeBrand(style ? { style } : {});
}

async function main() {
  if (!cmd || cmd === "--help" || cmd === "-h") {
    usage();
    process.exit(0);
  }

  if (cmd === "build") {
    const input = args[1];
    if (!input) { console.error("Error: specify input file"); process.exit(1); }
    const md = await readFile(resolve(input), "utf-8");
    const brand = await getBrand();
    const title = flag("--title");
    const html = build(md, brand, { title });
    const out = flag("-o") || input.replace(extname(input), ".html");
    await writeFile(resolve(out), html, "utf-8");
    console.log(`✓ ${out} (${(Buffer.byteLength(html, "utf-8") / 1024).toFixed(1)} KB)`);
  }

  else if (cmd === "pdf") {
    const input = args[1];
    if (!input) { console.error("Error: specify input HTML file"); process.exit(1); }
    const html = await readFile(resolve(input), "utf-8");
    const out = flag("-o") || input.replace(extname(input), ".pdf");
    await exportPdf(html, resolve(out));
    console.log(`✓ ${out}`);
  }

  else if (cmd === "pipe") {
    const input = args[1];
    if (!input) { console.error("Error: specify input file"); process.exit(1); }
    const md = await readFile(resolve(input), "utf-8");
    const brand = await getBrand();
    const title = flag("--title");
    const html = build(md, brand, { title });
    const base = basename(input, extname(input));
    const htmlOut = flag("-o") || `${base}.html`;
    const pdfOut = htmlOut.replace(extname(htmlOut), ".pdf");
    await writeFile(resolve(htmlOut), html, "utf-8");
    console.log(`✓ ${htmlOut} (${(Buffer.byteLength(html, "utf-8") / 1024).toFixed(1)} KB)`);
    await exportPdf(html, resolve(pdfOut));
    console.log(`✓ ${pdfOut}`);
  }

  else if (cmd === "components") {
    const components = listComponents();
    for (const c of components) {
      console.log(`\n${c.name} — ${c.description}`);
      console.log(`  Variants: ${c.variants.join(", ")}`);
      console.log(`  Example:  ${c.example}`);
    }
  }

  else if (cmd === "styles") {
    const { STYLE_PRESETS } = await import("../core/build.js");
    for (const [key, s] of Object.entries(STYLE_PRESETS)) {
      console.log(`  ${key.padEnd(12)} ${s.label} — ${s.desc}`);
    }
  }

  else if (cmd === "mcp") {
    await import("../mcp/server.js");
  }

  else {
    console.error(`Unknown command: ${cmd}`);
    usage();
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
