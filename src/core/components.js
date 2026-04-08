export const COMPONENTS = [
  {
    name: "box",
    description: "Highlighted box with background",
    variants: ["box", "box-dark", "box-outline", "box-accent"],
    example: '<div class="box"><h3>Title</h3><p>Box content</p></div>',
  },
  {
    name: "note",
    description: "Note / callout",
    variants: ["note", "note-important"],
    example: '<div class="note"><p>Important note</p></div>',
  },
  {
    name: "kv",
    description: "Key-value pairs",
    variants: ["kv"],
    example:
      '<div class="kv"><div class="kv-row"><span class="kv-key">Client</span><span class="kv-val">ACME Corp.</span></div></div>',
  },
  {
    name: "metrics",
    description: "Large numbers in a grid",
    variants: ["metrics"],
    example:
      '<div class="metrics"><div class="metric"><div class="metric-value">42</div><div class="metric-label">Projects</div></div></div>',
  },
  {
    name: "timeline",
    description: "Timeline",
    variants: ["timeline"],
    example:
      '<div class="timeline"><div class="timeline-item"><div class="timeline-date">January 2026</div><div class="timeline-content"><h4>Kick-off</h4><p>Project launch</p></div></div></div>',
  },
  {
    name: "steps",
    description: "Numbered steps",
    variants: ["steps"],
    example:
      '<div class="steps"><div class="step"><div class="step-num">1</div><div class="step-content"><h4>Analysis</h4><p>Map out requirements</p></div></div></div>',
  },
  {
    name: "columns",
    description: "Multi-column layout",
    variants: ["cols cols-2", "cols cols-3", "cols cols-60-40"],
    example:
      '<div class="cols cols-2"><div>Left column</div><div>Right column</div></div>',
  },
  {
    name: "comparison",
    description: "Side-by-side comparison",
    variants: ["comparison"],
    example:
      '<div class="comparison"><div class="comp-a"><h4>Option A</h4><p>Description</p></div><div class="comp-b"><h4>Option B</h4><p>Description</p></div></div>',
  },
  {
    name: "badge",
    description: "Status badge",
    variants: ["badge", "badge-success", "badge-warning", "badge-danger"],
    example: '<span class="badge badge-success">Active</span>',
  },
  {
    name: "checklist",
    description: "Checklist with checkboxes",
    variants: ["checklist"],
    example:
      '<ul class="checklist"><li class="done">Done</li><li>Remaining</li></ul>',
  },
  {
    name: "pull-quote",
    description: "Large pull quote",
    variants: ["pull-quote"],
    example:
      '<blockquote class="pull-quote">Design is not how it looks, but how it works.</blockquote>',
  },
  {
    name: "cover",
    description: "Document cover page",
    variants: ["cover"],
    example:
      '<div class="cover"><h1>Document Title</h1><p>Subtitle</p></div>',
  },
  {
    name: "page-break",
    description: "Page break for print",
    variants: ["page-break"],
    example: '<div class="page-break"></div>',
  },
  {
    name: "figure",
    description: "Image with optional caption (markdown syntax)",
    variants: ["doc-figure"],
    example: '![Image description](path/photo.jpg "Caption below image")',
  },
  {
    name: "image-layout",
    description: "CSS classes for image positioning",
    variants: ["doc-img-full", "doc-img-half", "doc-img-float-left", "doc-img-float-right"],
    example: '<img src="photo.jpg" class="doc-img-float-left" alt="Photo"/>',
  },
  {
    name: "gallery",
    description: "Image gallery grid",
    variants: ["doc-gallery"],
    example: '<div class="doc-gallery"><img src="a.jpg" alt=""/><img src="b.jpg" alt=""/><img src="c.jpg" alt=""/></div>',
  },
  {
    name: "signatures",
    description: "Signature blocks",
    variants: ["signatures"],
    example:
      '<div class="signatures"><div class="sig"><div class="sig-line"></div><div class="sig-name">John Smith</div></div></div>',
  },
  // ── Invoice-specific components ──
  {
    name: "invoice-label",
    description: "Large INVOICE heading (for invoice style)",
    variants: ["invoice-label"],
    example: '<div class="invoice-label">INVOICE</div>',
  },
  {
    name: "invoice-parties",
    description: "Two-column supplier/client layout (for invoice style)",
    variants: ["invoice-parties"],
    example:
      '<div class="invoice-parties"><div><h4>Supplier</h4><p><strong>Company Ltd.</strong><br>123 Main St<br>New York</p></div><div><h4>Client</h4><p><strong>Client Inc.</strong><br>456 Oak Ave<br>Boston</p></div></div>',
  },
  {
    name: "invoice-total",
    description: "Invoice totals — subtotal, tax, total (for invoice style)",
    variants: ["invoice-total", "invoice-total-box"],
    example:
      '<div class="invoice-total"><div class="invoice-total-box"><div class="kv"><div class="kv-row"><span class="kv-key">Subtotal</span><span class="kv-val">$5,000</span></div><div class="kv-row"><span class="kv-key">Tax 20%</span><span class="kv-val">$1,000</span></div><div class="kv-row"><span class="kv-key">Total</span><span class="kv-val">$6,000</span></div></div></div></div>',
  },
  {
    name: "invoice-payment",
    description: "Payment details (for invoice style)",
    variants: ["invoice-payment"],
    example:
      '<div class="invoice-payment"><h4>Payment Details</h4><div class="kv"><div class="kv-row"><span class="kv-key">Bank</span><span class="kv-val">First National Bank</span></div><div class="kv-row"><span class="kv-key">Account</span><span class="kv-val">1234567890</span></div><div class="kv-row"><span class="kv-key">Ref</span><span class="kv-val">INV-20260001</span></div></div></div>',
  },
];

export function listComponents() {
  return COMPONENTS;
}
