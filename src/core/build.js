import { parseMd } from "./markdown.js";

export const PAGE_MARGINS = { top: "20mm", right: "18mm", bottom: "22mm", left: "18mm" };

// ─── Style presets ───
// Styles define LAYOUT PERSONALITY only (sizes, weights, spacing, density).
// They never override brand colors/fonts — those always flow through CSS vars.
const STYLE_PRESETS = {
  // ── General document styles ──
  modern: {
    label: "Modern",
    desc: "Airy, large light headings. Proposals, presentations.",
    h1Size: "2.75rem", h1Weight: "400", h1Spacing: "-0.025em",
    h2Size: "1.75rem", h2Weight: "400", h2Border: "line", h2Accent: false,
    h3Size: "1.0625rem", h4Style: "uppercase",
    bodySize: "0.9375rem", lineHeight: "1.75",
    tableStyle: "minimal", boxRadius: "8px",
    coverStyle: "center", headerStyle: "border",
    sectionSpacing: "3rem", componentSpacing: "1.5rem",
  },
  formal: {
    label: "Formal",
    desc: "Conservative, compact. Contracts, legal documents.",
    h1Size: "2.25rem", h1Weight: "400", h1Spacing: "-0.01em",
    h2Size: "1.5rem", h2Weight: "400", h2Border: "line", h2Accent: false,
    h3Size: "1rem", h4Style: "uppercase",
    bodySize: "0.875rem", lineHeight: "1.7",
    tableStyle: "bordered", boxRadius: "4px",
    coverStyle: "top", headerStyle: "border",
    sectionSpacing: "2.5rem", componentSpacing: "1.25rem",
  },
  minimal: {
    label: "Minimal",
    desc: "Clean, bold headings, max whitespace. Reports, tech docs.",
    h1Size: "2rem", h1Weight: "600", h1Spacing: "-0.02em",
    h2Size: "1.375rem", h2Weight: "600", h2Border: "none", h2Accent: false,
    h3Size: "1.0625rem", h4Style: "normal",
    bodySize: "0.9375rem", lineHeight: "1.8",
    tableStyle: "clean", boxRadius: "6px",
    coverStyle: "center", headerStyle: "clean",
    sectionSpacing: "3rem", componentSpacing: "1.5rem",
  },
  executive: {
    label: "Executive",
    desc: "Authoritative, accent lines. Board reports, C-level.",
    h1Size: "2.5rem", h1Weight: "700", h1Spacing: "-0.02em",
    h2Size: "1.5rem", h2Weight: "600", h2Border: "accent", h2Accent: true,
    h3Size: "1.0625rem", h4Style: "uppercase",
    bodySize: "0.9375rem", lineHeight: "1.7",
    tableStyle: "bordered", boxRadius: "6px",
    coverStyle: "hero", headerStyle: "border",
    sectionSpacing: "3rem", componentSpacing: "1.5rem",
  },
  creative: {
    label: "Creative",
    desc: "Bold, high contrast. Agency proposals, portfolios.",
    h1Size: "3.25rem", h1Weight: "800", h1Spacing: "-0.03em",
    h2Size: "1.875rem", h2Weight: "700", h2Border: "none", h2Accent: true,
    h3Size: "1.125rem", h4Style: "uppercase",
    bodySize: "1rem", lineHeight: "1.75",
    tableStyle: "clean", boxRadius: "12px",
    coverStyle: "hero", headerStyle: "clean",
    sectionSpacing: "3.5rem", componentSpacing: "2rem",
  },
  technical: {
    label: "Technical",
    desc: "Data-dense, monospace accents. Analyses, audits, API docs.",
    h1Size: "1.875rem", h1Weight: "600", h1Spacing: "-0.01em",
    h2Size: "1.375rem", h2Weight: "600", h2Border: "line", h2Accent: false,
    h3Size: "1rem", h4Style: "mono",
    bodySize: "0.875rem", lineHeight: "1.65",
    tableStyle: "bordered", boxRadius: "4px",
    coverStyle: "top", headerStyle: "border",
    sectionSpacing: "2rem", componentSpacing: "1rem",
  },

  // ── Specialized document styles ──
  invoice: {
    label: "Invoice",
    desc: "Invoice-specific layout — from/to, line items, totals.",
    h1Size: "2rem", h1Weight: "700", h1Spacing: "-0.01em",
    h2Size: "1.25rem", h2Weight: "600", h2Border: "none", h2Accent: false,
    h3Size: "1rem", h4Style: "uppercase",
    bodySize: "0.875rem", lineHeight: "1.6",
    tableStyle: "invoice", boxRadius: "4px",
    coverStyle: "none", headerStyle: "invoice",
    sectionSpacing: "2rem", componentSpacing: "1rem",
  },
  compact: {
    label: "Compact",
    desc: "Maximum content per page. SOWs, contracts, detailed specs.",
    h1Size: "1.75rem", h1Weight: "600", h1Spacing: "-0.01em",
    h2Size: "1.25rem", h2Weight: "600", h2Border: "line", h2Accent: false,
    h3Size: "0.9375rem", h4Style: "normal",
    bodySize: "0.8125rem", lineHeight: "1.6",
    tableStyle: "bordered", boxRadius: "4px",
    coverStyle: "none", headerStyle: "border",
    sectionSpacing: "1.75rem", componentSpacing: "0.75rem",
  },
};

export { STYLE_PRESETS };

// ─── Table CSS variants ───
function tableCSS(style) {
  if (style === "bordered")
    return `table{border:1px solid var(--border)} thead th{border-bottom:2px solid var(--primary);background:var(--surface);padding:0.625rem 1rem} tbody td{padding:0.625rem 1rem;border-bottom:1px solid var(--border)}`;
  if (style === "clean")
    return `thead th{border-bottom:1px solid var(--border-strong);padding:0 1rem 0.5rem 0;font-weight:600;text-transform:none;letter-spacing:0;font-size:0.8125rem;color:var(--primary)} tbody td{padding:0.625rem 1rem 0.625rem 0;border-bottom:1px solid var(--border)}`;
  if (style === "invoice")
    return `table{border:1px solid var(--border);border-radius:4px;overflow:hidden} thead th{background:var(--primary);color:#fff;padding:0.625rem 1rem;font-size:0.75rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;text-align:left} thead th:last-child{text-align:right} tbody td{padding:0.625rem 1rem;border-bottom:1px solid var(--border);font-size:0.8125rem} tbody td:last-child{text-align:right;font-weight:600;font-variant-numeric:tabular-nums} tbody tr:last-child td{border-bottom:none}`;
  // minimal (default)
  return `thead th{font-weight:700;text-align:left;color:var(--text-light);font-size:0.6875rem;letter-spacing:0.08em;text-transform:uppercase;padding:0 1rem 0.75rem 0;border-bottom:2px solid var(--primary)} tbody td{padding:0.75rem 1rem 0.75rem 0;border-bottom:1px solid var(--border)} tbody tr:last-child td{border-bottom:2px solid var(--primary)}`;
}

// ─── Style-specific CSS overrides ───
function styleCSS(s) {
  let css = "";

  // h2 accent bar (short colored line instead of full border)
  if (s.h2Accent) {
    css += `h2::before{content:"";display:block;width:40px;height:3px;background:var(--accent);margin-bottom:0.75rem;border-radius:2px}`;
  }

  // h4 mono style for technical preset
  if (s.h4Style === "mono") {
    css += `h4{font-family:var(--mono, 'SF Mono', Consolas, monospace);font-size:0.75rem;font-weight:600;letter-spacing:0.02em;text-transform:none;color:var(--accent);margin:1.5rem 0 0.5rem}`;
  } else if (s.h4Style === "normal") {
    css += `h4{font-family:var(--body);font-size:0.8125rem;font-weight:600;letter-spacing:0;text-transform:none;color:var(--primary);margin:1.5rem 0 0.5rem}`;
  }

  // Cover hero style (colored background block)
  if (s.coverStyle === "hero") {
    css += `.cover{background:var(--primary);color:#fff;border-radius:${s.boxRadius};padding:3rem 2.5rem;margin:-3rem -2rem 2.5rem;min-height:50vh;display:flex;flex-direction:column;justify-content:center}
.cover h1,.cover h2,.cover h3,.cover h4,.cover p,.cover strong{color:#fff}
.cover p{opacity:0.85}`;
  }

  // Header clean (no border)
  if (s.headerStyle === "clean") {
    css += `.doc-header{border-bottom:none;padding-bottom:0.5rem}`;
  }

  // Invoice-specific components
  if (s.headerStyle === "invoice") {
    css += `.doc-header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:none;padding-bottom:1.5rem;margin-bottom:1.5rem}
.invoice-label{font-family:var(--heading);font-size:2.5rem;font-weight:700;color:var(--primary);letter-spacing:-0.02em;text-transform:uppercase;line-height:1}
.invoice-meta{text-align:right}
.invoice-meta .kv-row{justify-content:flex-end;gap:1rem;border:none;padding:0.2rem 0}
.invoice-parties{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin:0 0 2rem}
.invoice-party h4{margin-top:0}
.invoice-total{display:flex;justify-content:flex-end;margin:1.5rem 0}
.invoice-total-box{background:var(--surface);border-radius:${s.boxRadius};padding:1rem 1.5rem;min-width:250px}
.invoice-total-box .kv-row{border-color:var(--border)}
.invoice-total-box .kv-row:last-child{border-bottom:none;font-size:1.25rem;padding-top:0.75rem;margin-top:0.25rem;border-top:2px solid var(--primary)}
.invoice-total-box .kv-row:last-child .kv-val{font-size:1.25rem}
.invoice-payment{background:var(--surface);border-radius:${s.boxRadius};padding:1.25rem 1.5rem;margin:2rem 0}`;
  }

  return css;
}

// ─── Base component CSS ───
function componentCSS(s) {
  const r = s.boxRadius;
  const cs = s.componentSpacing;
  return `
.box{background:var(--surface);border-radius:${r};padding:1.25rem 1.5rem;margin:${cs} 0}
.box-dark{background:var(--primary);color:#fff;border-radius:${r};padding:1.25rem 1.5rem;margin:${cs} 0}
.box-dark h3,.box-dark h4,.box-dark strong{color:#fff}
.box-outline{border:1.5px solid var(--border);border-radius:${r};padding:1.25rem 1.5rem;margin:${cs} 0}
.box-accent{border-left:3px solid var(--accent);padding:1rem 1.5rem;margin:${cs} 0;background:var(--surface)}
.note{font-size:0.8125rem;color:var(--muted);border-left:2px solid var(--border);padding:0.5rem 1rem;margin:1rem 0}
.note-important{border-left-color:var(--accent);color:var(--text)}
.kv{margin:${cs} 0}
.kv-row{display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--border);font-size:0.875rem}
.kv-key{color:var(--muted)}.kv-val{font-weight:600;color:var(--primary)}
.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:1.5rem;margin:2rem 0}
.metric{text-align:center}
.metric-value{font-family:var(--heading);font-size:2.5rem;font-weight:700;color:var(--primary);line-height:1.1}
.metric-label{font-size:0.75rem;color:var(--muted);margin-top:0.25rem;text-transform:uppercase;letter-spacing:0.06em}
.stats-row{display:flex;gap:2rem;margin:${cs} 0}
.stat{text-align:center;flex:1}
.progress{margin:${cs} 0}
.progress-row{margin-bottom:0.75rem}
.progress-row label{display:flex;justify-content:space-between;font-size:0.8125rem;margin-bottom:0.25rem}
.progress-bar{height:6px;background:var(--surface);border-radius:3px;overflow:hidden}
.progress-fill{height:100%;background:var(--accent);border-radius:3px}
.timeline{position:relative;padding-left:2rem;margin:2rem 0}
.timeline::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--border)}
.timeline-item{position:relative;margin-bottom:2rem}
.timeline-item::before{content:"";position:absolute;left:-2rem;top:0.3rem;width:10px;height:10px;border-radius:50%;background:var(--accent);border:2px solid var(--bg)}
.timeline-date{font-size:0.75rem;color:var(--muted);margin-bottom:0.25rem;text-transform:uppercase;letter-spacing:0.06em}
.steps{counter-reset:step;margin:2rem 0}
.step{display:flex;gap:1rem;margin-bottom:1.5rem;align-items:flex-start}
.step-num{width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.8125rem;font-weight:700;flex-shrink:0}
.step-content{flex:1}
.cols{display:grid;gap:2rem;margin:${cs} 0}
.cols-2{grid-template-columns:1fr 1fr}
.cols-3{grid-template-columns:1fr 1fr 1fr}
.cols-60-40{grid-template-columns:3fr 2fr}
.comparison{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:2rem 0;border:1px solid var(--border);border-radius:${r};overflow:hidden}
.comp-a,.comp-b{padding:1.25rem 1.5rem}
.comp-a{border-right:1px solid var(--border)}
ul.checklist{list-style:none;padding-left:0}
ul.checklist li{padding-left:1.75rem;position:relative;margin-bottom:0.5rem}
ul.checklist li::before{content:"☐";position:absolute;left:0;color:var(--muted)}
ul.checklist li.done::before{content:"☑";color:var(--accent)}
.badge{display:inline-block;font-size:0.6875rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:4px;text-transform:uppercase;letter-spacing:0.04em;background:var(--surface);color:var(--muted)}
.badge-success{background:#E8F5E9;color:#2E7D32}
.badge-warning{background:#FFF8E1;color:#F57F17}
.badge-danger{background:#FFEBEE;color:#C62828}
.cover{min-height:60vh;display:flex;flex-direction:column;justify-content:center;padding:3rem 0;margin-bottom:2rem}
.page-break{break-after:page;height:0;margin:0;border:none}
.divider-logo{text-align:center;margin:${s.sectionSpacing} 0;opacity:0.15}
.divider-logo img{height:24px}
.pull-quote{font-family:var(--heading);font-size:1.5rem;font-weight:400;line-height:1.4;color:var(--primary);border:none;padding:2rem 0;margin:2rem 0;text-align:center;font-style:italic}
.signatures{display:flex;gap:3rem;margin:3rem 0}
.sig{flex:1;text-align:center}
.sig-line{border-top:1px solid var(--primary);margin-bottom:0.5rem;margin-top:3rem}
.sig-name{font-size:0.8125rem;font-weight:600}
.doc-figure{margin:2rem 0;text-align:center}
.doc-figure img{max-width:100%;height:auto;border-radius:6px;display:block;margin:0 auto}
.doc-figure figcaption{font-size:0.75rem;color:var(--muted);margin-top:0.5rem;font-style:italic}
.doc-img-inline{max-height:1.5em;vertical-align:middle;display:inline}
.doc-img-full{width:100%;height:auto;border-radius:6px;margin:${cs} 0}
.doc-img-half{width:50%;height:auto;border-radius:6px;margin:1rem}
.doc-img-float-left{float:left;max-width:40%;margin:0.5rem 1.5rem 1rem 0;border-radius:6px}
.doc-img-float-right{float:right;max-width:40%;margin:0.5rem 0 1rem 1.5rem;border-radius:6px}
.doc-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin:2rem 0}
.doc-gallery img{width:100%;height:auto;border-radius:6px;object-fit:cover;aspect-ratio:4/3}
.doc-nav{position:sticky;top:0;z-index:10;background:var(--bg);border-bottom:1px solid var(--border);padding:0.75rem 0;margin-bottom:2rem}
@media(max-width:600px){.cols-2,.cols-3,.cols-60-40{grid-template-columns:1fr}.comparison{grid-template-columns:1fr}.comp-a{border-right:none;border-bottom:1px solid var(--border)}.signatures{flex-direction:column;gap:1.5rem}}
@media print{.doc-nav{display:none}.cover{min-height:auto;page-break-after:always}.page-break{break-after:page}.box,.box-dark,.box-outline,.box-accent,.note,.kv,.metrics,.timeline-item,.step,.comparison,.doc-figure{break-inside:avoid}.doc-figure img{max-height:40vh}.doc-img-float-left,.doc-img-float-right{float:none;max-width:60%;margin:1rem auto;display:block}}
`;
}

// ─── Build HTML ───
export function build(content, brand, { title, isHtml = false } = {}) {
  const body = isHtml ? content : parseMd(content);
  const s = STYLE_PRESETS[brand.style] || STYLE_PRESETS.modern;
  const c = brand.colors;
  const f = brand.fonts;

  const logo = brand.logo
    ? `<div class="doc-header"><img src="${brand.logo}" alt="${brand.name}" class="doc-logo"/></div>`
    : brand.name
      ? `<div class="doc-header"><div class="doc-logo-text">${brand.name}</div>${brand.tagline ? `<div class="doc-tagline">${brand.tagline}</div>` : ""}</div>`
      : "";

  const footerParts = [];
  if (brand.name) footerParts.push(brand.name);
  if (brand.footer?.showContact && brand.web) footerParts.push(brand.web);
  if (brand.footer?.showContact && brand.email) footerParts.push(brand.email);
  const footerIcon = brand.icon
    ? `<img src="${brand.icon}" alt="" class="doc-footer-icon"/>`
    : "";
  const footerNote = brand.footer?.note
    ? `<div class="doc-footer-note">${brand.footer.note}</div>`
    : "";
  const footer = footerParts.length
    ? `<footer class="doc-footer">${footerIcon}<div class="doc-footer-meta">${footerParts.join(" · ")}</div>${footerNote}</footer>`
    : "";

  // h2 border style
  let h2BorderCSS = "";
  if (s.h2Border === "line") h2BorderCSS = `padding-top:2rem;border-top:1px solid var(--border);`;
  else if (s.h2Border === "accent") h2BorderCSS = `padding-top:2rem;`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title || brand.name || "Document"}</title>
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--primary:${c.primary};--accent:${c.accent};--muted:${c.muted};--surface:${c.surface};--bg:#FFFFFF;--border:#E8E8ED;--border-strong:#D2D2D7;--text:#2C2C2E;--text-light:#636366;--heading:${f.heading};--body:${f.body}}
html{font-size:16px;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
body{font-family:var(--body);font-size:${s.bodySize};font-weight:400;line-height:${s.lineHeight};color:var(--text);background:var(--bg);max-width:720px;margin:0 auto;padding:3rem 2rem 4rem}
.doc-header{margin-bottom:2.5rem;padding-bottom:1.75rem;border-bottom:1px solid var(--border)}
.doc-logo{max-height:40px;width:auto;display:block}
.doc-logo-text{font-family:var(--heading);font-size:1.25rem;font-weight:700;color:var(--primary);letter-spacing:-0.01em}
.doc-tagline{font-size:0.8125rem;color:var(--muted);margin-top:0.25rem}
h1{font-family:var(--heading);font-size:${s.h1Size};font-weight:${s.h1Weight};line-height:1.1;letter-spacing:${s.h1Spacing};color:var(--primary);margin-bottom:1.5rem}
h2{font-family:var(--heading);font-size:${s.h2Size};font-weight:${s.h2Weight};line-height:1.2;letter-spacing:-0.01em;color:var(--primary);margin:${s.sectionSpacing} 0 1.25rem;${h2BorderCSS}}
h2:first-child,h1+h2{border-top:none;padding-top:0}
h2:first-child::before{display:none}
h3{font-family:var(--body);font-size:${s.h3Size};font-weight:600;line-height:1.35;color:var(--primary);margin:2rem 0 0.625rem}
h4{font-family:var(--body);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin:1.5rem 0 0.5rem}
p{margin-bottom:1rem} strong{font-weight:600;color:var(--primary)} em{font-style:italic}
blockquote{border-left:3px solid var(--border-strong);padding:0.75rem 1.25rem;margin:1.5rem 0;color:var(--text-light);font-size:0.875rem}
blockquote p{margin-bottom:0.5rem} blockquote p:last-child{margin-bottom:0}
a{color:var(--accent);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
hr{border:none;height:1px;background:var(--border);margin:${s.sectionSpacing} 0}
ul,ol{margin:0 0 1rem;padding-left:1.25rem} li{margin-bottom:0.5rem;line-height:1.65} li::marker{color:var(--muted)}
table{width:100%;border-collapse:collapse;margin:${s.componentSpacing} 0 2rem;font-size:0.8125rem;line-height:1.5}
${tableCSS(s.tableStyle)}
${componentCSS(s)}
${styleCSS(s)}
.doc-footer{margin-top:4rem;padding-top:2rem;border-top:1px solid var(--border);text-align:center}
.doc-footer-icon{height:20px;width:auto;margin-bottom:0.75rem;opacity:0.25}
.doc-footer-meta{font-size:0.75rem;color:var(--muted);letter-spacing:0.02em}
.doc-footer-note{font-size:0.6875rem;color:var(--muted);margin-top:0.5rem;opacity:0.7}
@media print{
  @page{size:A4;margin:20mm 18mm 22mm 18mm}
  body{max-width:none;padding:0;font-size:10pt;line-height:1.6}
  h1{font-size:26pt} h2{font-size:15pt;margin-top:1.5rem;padding-top:1rem;break-before:auto}
  h2,h3,h4{break-after:avoid} table,blockquote{break-inside:avoid} tr{break-inside:avoid}
  thead{display:table-header-group} p{orphans:3;widows:3} .doc-footer{break-inside:avoid}
  a{text-decoration:none;color:var(--text)}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
</style>
</head>
<body>
${logo}
${body}
${footer}
</body>
</html>`;
}
