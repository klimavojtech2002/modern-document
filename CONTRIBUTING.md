# Contributing to Modern Document

Thank you for your interest in contributing! This guide will help you get started.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm (comes with Node.js)

## Development Setup

```bash
git clone https://github.com/klimavojtech2002/modern-document.git
cd modern-document
npm install
```

**Run the web app** (live preview editor):

```bash
npm run dev
```

**Run tests:**

```bash
npm test
```

## Project Structure

```
src/
  core/          Core library (zero external dependencies)
    build.js       Markdown → HTML rendering, CSS generation, style presets
    brand.js       Brand config loading, merging, image embedding
    components.js  Component definitions and descriptions
    markdown.js    Regex-based Markdown parser
    pdf.js         Puppeteer-based PDF export
    index.js       Public API exports
  mcp/           MCP server (Model Context Protocol)
    server.js      5 tools for AI assistant integration
  cli/           CLI tool
    index.js       Command-line interface (moddoc)
  web/           Web app (React + Vite, dev only)
    App.jsx        Editor with live preview
    main.jsx       Entry point
brands/
  default/       Default brand configuration
examples/        Sample documents
test/            Test suite
```

## How to Add a Style Preset

Style presets live in `src/core/build.js` in the `STYLE_PRESETS` object. Each preset defines layout personality (typography, spacing, density) without overriding brand colors or fonts.

1. Add a new entry to `STYLE_PRESETS` with `label`, `desc`, and all style properties (follow existing presets as reference)
2. Add the new key to the `z.enum()` arrays in `src/mcp/server.js` (lines with style validation)
3. Add an option to the style select in `src/web/App.jsx`
4. Add it to the README style presets table

## How to Add a Component

Components are defined in `src/core/components.js` and styled in `src/core/build.js`.

1. Add the component definition to the `COMPONENTS` array in `components.js` with `name`, `description`, `variants`, and `example`
2. Add CSS rules in the `componentCSS()` function in `build.js`
3. Update the README components section

## Code Guidelines

- **ESM only** — all files use ES module syntax (`import`/`export`)
- **No external dependencies in core** — the `src/core/` directory must remain dependency-free (only Node.js built-ins)
- **No build step for library** — the library ships as plain `.js` files, no transpilation
- **Keep it simple** — prefer clarity over abstraction

## Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit with a clear message
6. Open a Pull Request against `main`

## Reporting Issues

Use [GitHub Issues](https://github.com/klimavojtech2002/modern-document/issues) with the provided templates for bug reports and feature requests.
