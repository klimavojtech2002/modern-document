# Changelog

## [0.2.0] - 2026-03-29

### Changed
- Translated all user-facing strings from Czech to English (style labels, component descriptions, web app UI, default brand)
- HTML output now uses `lang="en"` instead of `lang="cs"`

### Fixed
- **Security:** Fixed XSS vulnerability in markdown image/caption processing — alt text, src, and captions are now HTML-escaped
- MCP server version is now read dynamically from package.json instead of being hardcoded
- Page margin constants are now shared between build and PDF modules (no duplication)

### Added
- Input validation for brand JSON loading (descriptive error on invalid files)
- CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- GitHub Actions CI workflow (Node 18, 20, 22)
- GitHub issue templates and PR template
- `.editorconfig` for consistent formatting
- Example documents (proposal, invoice)
- JSDoc comments on all public API functions
- Basic test suite using Node.js built-in test runner

## [0.1.0] - 2026-03-13

### Added
- Core engine: Markdown → self-contained HTML with brand embedding
- PDF export via Puppeteer (optional dependency)
- 8 document style presets: modern, formal, minimal, executive, creative, technical, invoice, compact
- 21 HTML components: boxes, timelines, metrics, steps, tables, signatures, invoice blocks, and more
- Brand system: logo, colors, fonts, footer — all configurable via `brand.json`
- MCP server with 5 tools: `build_document`, `export_pdf`, `full_pipeline`, `list_components`, `list_styles`
- CLI: `moddoc build`, `moddoc pdf`, `moddoc pipe`, `moddoc components`, `moddoc styles`, `moddoc mcp`
- `MODDOC_BRAND` environment variable for persistent brand configuration
- Print CSS with A4 page setup, smart page breaks, and `print-color-adjust: exact`
