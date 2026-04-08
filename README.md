# mcp-md-html-pdf

**AI speaks Markdown. The world reads HTML.**

[![npm version](https://img.shields.io/npm/v/mcp-md-html-pdf)](https://www.npmjs.com/package/mcp-md-html-pdf)
[![license](https://img.shields.io/npm/l/mcp-md-html-pdf)](./LICENSE)
[![CI](https://github.com/klimavojtech2002/modern-document/actions/workflows/ci.yml/badge.svg)](https://github.com/klimavojtech2002/modern-document/actions/workflows/ci.yml)
[![node](https://img.shields.io/node/v/mcp-md-html-pdf)](https://nodejs.org)

---

## Why this exists

Every AI model thinks in Markdown. Ask Claude to write a proposal, a report, an invoice — you get Markdown. It is the lingua franca between humans and machines.

But nobody sends a `.md` file to a client.

**HTML is the new PDF.** A single self-contained `.html` file weighs 10-150 KB, opens instantly on any device — phone, tablet, desktop — and travels anywhere: WhatsApp, Signal, email, Slack. The recipient taps the file and reads. No app required. No viewer. No account.

This is not just any HTML. Every document is optimized for **A4 print layout** with proper margins, page breaks, and print-specific CSS. Hit Ctrl+P and you get a clean, professional PDF. No export workflow. No third-party service. The browser _is_ the PDF engine.

One file. Zero runtime dependencies. No accounts, no subscriptions, no vendor lock-in.

`mcp-md-html-pdf` bridges the gap: it takes Markdown (what AI produces) and your brand (logo, colors, fonts) and outputs a document that looks like it was designed by a professional — because the design system already was.

---

## Quick Start (30 seconds)

Add the MCP server to your Claude Code config (`~/.claude/settings.json` or `.mcp.json`):

```json
{
  "mcpServers": {
    "modern-document": {
      "command": "npx",
      "args": ["-y", "mcp-md-html-pdf", "mcp"],
      "env": { "MODDOC_BRAND": "/path/to/brand.json" }
    }
  }
}
```

Then tell Claude:

> "Make a proposal for ACME Corp, web redesign for $5,000, executive style"

Claude calls `build_document` → you get a branded HTML file → done.

---

## Three ways to use it

### 1. MCP Server (primary)

Works with any MCP-compatible client: **Claude Code**, **Claude Desktop**, **VS Code**.

The `MODDOC_BRAND` environment variable loads your brand automatically. Set it once and every document gets your logo, colors, and fonts without specifying them each time.

<details>
<summary>Claude Desktop config</summary>

`~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "modern-document": {
      "command": "npx",
      "args": ["-y", "mcp-md-html-pdf", "mcp"],
      "env": { "MODDOC_BRAND": "/absolute/path/to/brand.json" }
    }
  }
}
```

</details>

<details>
<summary>VS Code config</summary>

`.vscode/mcp.json`:

```json
{
  "servers": {
    "modern-document": {
      "command": "npx",
      "args": ["-y", "mcp-md-html-pdf", "mcp"],
      "env": { "MODDOC_BRAND": "/absolute/path/to/brand.json" }
    }
  }
}
```

</details>

### 2. CLI

```bash
npm install -g mcp-md-html-pdf

# Markdown → branded HTML
moddoc build proposal.md --style executive --brand ./brand.json

# Full pipeline: Markdown → HTML + PDF
moddoc pipe report.md --style technical

# Explore what's available
moddoc components
moddoc styles
```

PDF export requires Puppeteer: `npm install puppeteer`

### 3. Library

```js
import { build, mergeBrand } from "mcp-md-html-pdf";

const brand = mergeBrand({
  name: "ACME Corp",
  colors: { primary: "#1E3A5F", accent: "#C9A84C" },
  style: "executive",
});

const html = build("# My Proposal\n\nContent here...", brand);
// → self-contained HTML string
```

---

## Brand Setup

Create a folder for your brand (e.g. `~/my-brand/`) and add a `brand.json`:

```json
{
  "name": "Your Company",
  "tagline": "We build great things.",
  "web": "yourcompany.com",
  "email": "hello@yourcompany.com",
  "logo": "./logo.svg",
  "icon": "./icon.svg",
  "colors": {
    "primary": "#1E3A5F",
    "accent": "#C9A84C",
    "muted": "#7F8C8D",
    "surface": "#F4F6F7"
  },
  "fonts": {
    "heading": "Georgia, serif",
    "body": "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
  },
  "style": "modern",
  "footer": {
    "showContact": true,
    "note": ""
  }
}
```

Place your logo file (SVG or PNG) in the same folder. It gets converted to base64 and embedded into the HTML — the output is always a single self-contained file.

**All fields are optional.** Start with just `name` and `colors`, add the rest later.

### Brand fields

| Field | What it does |
|---|---|
| `name` | Company name — shown in header and footer |
| `tagline` | Short tagline below the logo |
| `web`, `email` | Shown in footer (if `footer.showContact` is true) |
| `logo` | Path to logo file (SVG, PNG) — shown in document header |
| `icon` | Path to small icon — shown in document footer |
| `colors.primary` | Headings, borders, strong elements |
| `colors.accent` | Links, highlights, accent lines |
| `colors.muted` | Captions, labels, secondary text |
| `colors.surface` | Background of boxes, table headers |
| `fonts.heading` | Font stack for headings (h1-h4) |
| `fonts.body` | Font stack for body text |
| `style` | Document style preset (see below) |
| `footer.showContact` | Show web/email in footer |
| `footer.note` | Small note at the bottom (e.g. "Confidential") |

### Brand layering

You can override the brand at multiple levels. Each layer takes priority over the one below it:

```
brandOverrides     ← highest priority (inline in tool call)
brand path         ← tool call parameter (path to a different brand.json)
MODDOC_BRAND       ← env var (your default brand)
built-in default   ← fallback (generic neutral style)
```

Set up your default brand via `MODDOC_BRAND` and override specific fields per document — use a different style or accent color for a particular client without touching your base config.

---

## MCP Tools

| Tool | Description | Key inputs |
|---|---|---|
| `build_document` | Markdown → branded HTML | `content`, `outputPath`, `brandOverrides` |
| `export_pdf` | HTML → A4 PDF | `htmlPath`, `format` (A4/Letter) |
| `full_pipeline` | Markdown → HTML + PDF in one step | `content`, `filename`, `formats` |
| `list_components` | List all available HTML components with examples | — |
| `list_styles` | List all style presets | — |

### build_document inputs

| Input | Type | Description |
|---|---|---|
| `content` | string | Markdown or HTML content |
| `title` | string? | Document title |
| `brand` | string? | Path to brand.json (overrides MODDOC_BRAND) |
| `brandOverrides` | object? | Inline overrides: `name`, `colors`, `fonts`, `style`, etc. |
| `outputPath` | string? | Where to save the HTML file |
| `isHtml` | boolean? | Set to true if content is already HTML |

---

## Style Presets

Styles define layout personality — typography, spacing, density. They never override your brand colors or fonts.

| Style | Description | Best for |
|---|---|---|
| `modern` | Airy layout with large, light headings | Proposals, presentations |
| `formal` | Compact and conservative serif typography | Contracts, legal documents |
| `minimal` | Clean lines, bold headings, maximum whitespace | Reports, tech docs |
| `executive` | Authoritative presence with accent lines | Board reports, C-level memos |
| `creative` | Bold contrasts and expressive spacing | Agency proposals, portfolios |
| `technical` | Data-dense with monospace accents | Analyses, audits, API docs |
| `invoice` | Structured from/to blocks, line items, totals | Invoices, billing |
| `compact` | Maximum content per page, tight spacing | SOWs, contracts, specs |

---

## Components

21 HTML components available in documents. Claude uses them automatically when building your content.

**Layout:** columns (2, 3, 60/40), comparison, cover page, page break, signatures

**Content:** box (4 variants), note, pull quote, badge (4 variants), checklist

**Data:** key-value pairs, metrics grid, progress bars, tables (4 styles), timeline, steps

**Images:** figure with caption, inline, full-width, float left/right, gallery grid

**Invoice:** invoice label, parties (from/to), total box, payment details

---

## Examples

See the [`examples/`](./examples) directory for sample documents across different styles and use cases.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

[MIT](./LICENSE) — Vojtech Klima
