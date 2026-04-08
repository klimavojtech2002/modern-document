import { useState, useRef, useEffect, useCallback } from "react";
import { build, DEFAULT_BRAND } from "../core/index.js";

// ─── Design tokens (standalone, no external CSS vars needed) ───
const T = {
  bg: "#FFFFFF",
  bgAlt: "#FAFAFA",
  bgHover: "#F4F4F5",
  text: "#18181B",
  textSec: "#52525B",
  textMut: "#A1A1AA",
  border: "#E4E4E7",
  borderLight: "#F4F4F5",
  accent: "#2563EB",
  accentText: "#FFFFFF",
  font: "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  mono: "'SF Mono', 'Cascadia Code', 'Fira Code', Consolas, monospace",
  radius: 6,
};

// ─── Sample content ───
const SAMPLE_MD = `# Modern Document

Every day, thousands of proposals, reports, contracts and analyses are created. Most end up in Word or Google Docs. They look average. And the person who receives them notices.

Modern Document solves this. You take a text file — and get a professional document that looks like it was made by a designer. A single HTML file that opens everywhere.

## Why not just Word or PDF?

<div class="comparison">
<div class="comp-a">
<h4>Traditional approach</h4>
<p>You write content. Open Word. Format. Find the logo, insert colors, adjust spacing. Export PDF. The recipient opens it on their phone — and has to zoom and scroll sideways. Every document starts from scratch.</p>
</div>
<div class="comp-b">
<h4>Modern Document</h4>
<p>You write content in Markdown. Your brand is set up once. One command — and you have an HTML file under 150 KB. Looks perfect on mobile. On desktop too. Need print? Ctrl+P and you get clean A4.</p>
</div>
</div>

## HTML is a better format than you think

PDF was designed in 1993 for printers. HTML was designed for screens — and today we read most documents on them.

<div class="cols cols-2">
<div>

### HTML document
- Adapts to screen — phone, tablet, monitor
- Single file, everything embedded, works offline
- Under 150 KB even with logo and fonts
- Send via WhatsApp, email, Slack — recipient clicks and sees it
- Need print? Ctrl+P → clean A4 with margins

</div>
<div>

### PDF
- Fixed dimensions — on mobile you have to zoom
- Large files (often MBs)
- Every change = new export
- No responsiveness
- Only advantage: "that's how we've always done it"

</div>
</div>

<div class="note note-important">
<p>We're not saying PDF is bad. We're saying an HTML document is a <strong>better default format</strong> for most situations — and you can make a PDF from it with one click, whenever you need it.</p>
</div>

## Why Markdown?

Here's the key piece of the puzzle. Why not write directly in HTML? Why not write in Word?

<div class="box">
<h3>Markdown is content without clutter</h3>
<p>Markdown is plain text with markers — <code># Heading</code>, <code>**bold**</code>, <code>- list</code>. Nothing more. No hidden formatting, no binary files, no versioning issues.</p>
<p>This makes it the ideal format for three things:</p>
</div>

### 1. Working at scale

Have 50 documents? In Markdown, that's 50 text files. You can search them in bulk, find-and-replace, version in Git, merge, split. Try that with 50 Word files.

### 2. Templates and automation

A Markdown file can be generated programmatically. Connected to a database. Fill a template with CRM data. Let a CI/CD pipeline automatically generate reports. It's text — any script can work with it.

### 3. Separation of content and design

You know this principle from the web: HTML is content, CSS is appearance. Here it's the same — **Markdown is content, brand is appearance**. Change the brand once and all documents update. No reformatting 50 files by hand.

<div class="box-accent">
<p><strong>What about AI?</strong> AI models generate Markdown natively — it's their natural output format. But Modern Document isn't an "AI tool". It's a document tool that <em>among other things</em> works great with AI output. It works equally well with text you write yourself, generate from a template, or export from a database.</p>
</div>

## How it works

<div class="steps">
<div class="step"><div class="step-num">1</div><div class="step-content"><h4>Content as Markdown</h4><p>Write it yourself, generate it, import it — it's a text file. Simple, readable, versionable.</p></div></div>
<div class="step"><div class="step-num">2</div><div class="step-content"><h4>Set up brand once</h4><p>Logo, colors, fonts, footer style. Save as a profile. From then on, every document looks consistent — like it was made by a designer.</p></div></div>
<div class="step"><div class="step-num">3</div><div class="step-content"><h4>Build → finished document</h4><p>One HTML file, everything embedded. Open it offline, a year from now, on any device. Need PDF? Ctrl+P.</p></div></div>
</div>

## What documents can do

It's not just headings and paragraphs. The design system includes components you know from the best web apps — and they all work in print too:

<div class="metrics">
<div class="metric"><div class="metric-value">21</div><div class="metric-label">Components</div></div>
<div class="metric"><div class="metric-value">8</div><div class="metric-label">Styles</div></div>
<div class="metric"><div class="metric-value">~150 KB</div><div class="metric-label">File size</div></div>
<div class="metric"><div class="metric-value">0</div><div class="metric-label">Dependencies</div></div>
</div>

Boxes, timelines, metrics, steps, tables, comparisons, checklists, image galleries, signature blocks, quotes. Images? Drag into the editor — they're automatically embedded in the document.

## Who it's for

| Who | What they solve | How they use it |
|---|---|---|
| **Freelancer** | Proposals that look professional | MD template → brand → send to client |
| **Consultant** | Monthly reports and analyses | Structured data → clean document |
| **Small business** | Contracts, pricing, onboarding | Consistent visuals without a designer on payroll |
| **Developer** | Documentation in CI/CD | Build pipeline generates HTML + PDF automatically |

## Three ways to use it

<div class="box-outline">
<h4>Web App</h4>
<p>You're looking at it right now. Markdown on the left, preview on the right. Set your brand, drag in a logo, download HTML. No sign-up required.</p>
</div>

<div class="box-outline">
<h4>CLI</h4>
<p><code>moddoc build proposal.md --brand ./my-brand</code> — for developers, scripts, and automation. Hook into CI/CD and documents generate themselves.</p>
</div>

<div class="box-outline">
<h4>MCP Server</h4>
<p>Connect to AI assistants like Claude Code. Say "make a proposal" — and get a finished branded document. AI writes the content, Modern Document wraps it up.</p>
</div>

---

<blockquote class="pull-quote">The content is yours. The design is handled by Modern Document. The output looks like it came from a studio — and takes two minutes.</blockquote>`;


// ─── Helpers ───
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

// ─── Tiny icons ───
const I = ({ d, s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// ─── UI primitives ───
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: T.textMut, marginBottom: 5 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

const inputStyle = (mono) => ({
  width: "100%", padding: "8px 11px", fontSize: 13,
  border: `1px solid ${T.border}`, borderRadius: T.radius,
  background: T.bg, color: T.text,
  outline: "none", fontFamily: mono ? T.mono : "inherit",
});

function ColorInput({ label, value, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
      <div style={{ width: 26, height: 26, borderRadius: T.radius, background: value, border: "2px solid rgba(128,128,128,0.12)", flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ position: "absolute", inset: -4, width: "calc(100% + 8px)", height: "calc(100% + 8px)", cursor: "pointer", opacity: 0 }} />
      </div>
      <span style={{ fontSize: 12, color: T.textSec }}>{label}</span>
    </label>
  );
}

function FileUpload({ dataUrl, onUpload, onRemove, label, h = 32 }) {
  const ref = useRef();
  const go = async (e) => {
    const f = e.target.files?.[0];
    if (f) onUpload(await toBase64(f));
  };
  return (
    <div>
      <input ref={ref} type="file" accept="image/*,.svg" onChange={go} style={{ display: "none" }} />
      {dataUrl ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 11px", background: T.bgAlt, borderRadius: T.radius }}>
          <img src={dataUrl} alt="" style={{ maxHeight: h, width: "auto" }} />
          <button onClick={onRemove} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: T.textMut, fontSize: 11 }}>remove</button>
        </div>
      ) : (
        <button onClick={() => ref.current?.click()} style={{ width: "100%", padding: "13px 11px", borderRadius: T.radius, border: `1.5px dashed ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: T.textMut, fontSize: 12, fontFamily: "inherit" }}>
          <I d="M2.5 11v2.5a1 1 0 001 1h9a1 1 0 001-1V11M8 2v8.5M5 5.5L8 2l3 3.5" s={16} /> {label}
        </button>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 12, color: T.textSec }}>
      <div onClick={() => onChange(!checked)} style={{ width: 32, height: 18, borderRadius: 9, padding: 2, background: checked ? T.accent : T.border, transition: "background 0.2s", cursor: "pointer", flexShrink: 0 }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: "#fff", transform: checked ? "translateX(14px)" : "translateX(0)", transition: "transform 0.2s" }} />
      </div>
      {label}
    </label>
  );
}

function Divider({ title }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMut, marginTop: 18, marginBottom: 10, paddingTop: 14, borderTop: `1px solid ${T.borderLight}`, opacity: 0.6 }}>
      {title}
    </div>
  );
}

// ─── Brand panel ───
function BrandPanel({ brand, setBrand }) {
  const set = (key) => (v) => setBrand((b) => ({ ...b, [key]: typeof v === "function" ? v(b[key]) : v }));
  const setColor = (key) => (v) => setBrand((b) => ({ ...b, colors: { ...b.colors, [key]: v } }));
  const setFont = (key) => (v) => setBrand((b) => ({ ...b, fonts: { ...b.fonts, [key]: v } }));
  const setFooter = (key) => (v) => setBrand((b) => ({ ...b, footer: { ...b.footer, [key]: v } }));

  return (
    <div style={{ padding: "10px 0 24px", fontSize: 13 }}>

      <Divider title="Document Style" />
      <Field label="Style">
        <select value={brand.style} onChange={(e) => set("style")(e.target.value)} style={inputStyle()}>
          <optgroup label="General">
            <option value="modern">Modern — airy, large headings</option>
            <option value="formal">Formal — compact, conservative</option>
            <option value="minimal">Minimal — clean, bold headings</option>
            <option value="executive">Executive — authoritative, accent lines</option>
            <option value="creative">Creative — bold, high contrast</option>
            <option value="technical">Technical — data-dense, monospace</option>
          </optgroup>
          <optgroup label="Specialized">
            <option value="invoice">Invoice — from/to, line items, totals</option>
            <option value="compact">Compact — max content per page</option>
          </optgroup>
        </select>
      </Field>

      <Divider title="Identity" />
      <Field label="Company Name">
        <input type="text" value={brand.name} onChange={(e) => set("name")(e.target.value)} placeholder="Your Company Ltd." style={inputStyle()} />
      </Field>
      <Field label="Tagline">
        <input type="text" value={brand.tagline} onChange={(e) => set("tagline")(e.target.value)} placeholder="We build great things." style={inputStyle()} />
      </Field>
      <Field label="Website">
        <input type="text" value={brand.web} onChange={(e) => set("web")(e.target.value)} placeholder="yourcompany.com" style={inputStyle(true)} />
      </Field>
      <Field label="Email">
        <input type="text" value={brand.email} onChange={(e) => set("email")(e.target.value)} placeholder="hello@yourcompany.com" style={inputStyle(true)} />
      </Field>

      <Divider title="Logos" />
      <Field label="Main logo (document header)">
        <FileUpload dataUrl={brand.logo} onUpload={set("logo")} onRemove={() => set("logo")(null)} label="Upload logo (SVG, PNG)" h={36} />
      </Field>
      <Field label="Symbol / icon (footer)">
        <FileUpload dataUrl={brand.icon} onUpload={set("icon")} onRemove={() => set("icon")(null)} label="Upload icon" h={22} />
      </Field>

      <Divider title="Typography" />
      <Field label="Heading font">
        <select value={brand.fonts.heading} onChange={(e) => setFont("heading")(e.target.value)} style={inputStyle()}>
          <optgroup label="Serif">
            <option value="Georgia, serif">Georgia — classic, readable</option>
            <option value="'Palatino Linotype', 'Book Antiqua', Palatino, serif">Palatino — elegant</option>
            <option value="Cambria, 'Hoefler Text', serif">Cambria — formal</option>
            <option value="'Times New Roman', Times, serif">Times New Roman — traditional</option>
          </optgroup>
          <optgroup label="Sans-serif">
            <option value="-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif">System Sans — modern</option>
            <option value="Calibri, 'Gill Sans', 'Helvetica Neue', sans-serif">Calibri — corporate</option>
            <option value="'Trebuchet MS', 'Lucida Grande', 'Lucida Sans', sans-serif">Trebuchet — friendly</option>
            <option value="Verdana, Geneva, 'DejaVu Sans', sans-serif">Verdana — screen-optimized</option>
          </optgroup>
        </select>
      </Field>
      <Field label="Body font">
        <select value={brand.fonts.body} onChange={(e) => setFont("body")(e.target.value)} style={inputStyle()}>
          <optgroup label="Sans-serif (recommended)">
            <option value="-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif">System Sans — default</option>
            <option value="Calibri, 'Gill Sans', 'Helvetica Neue', sans-serif">Calibri — corporate</option>
            <option value="Verdana, Geneva, 'DejaVu Sans', sans-serif">Verdana — max readability</option>
          </optgroup>
          <optgroup label="Serif (for longer texts)">
            <option value="Georgia, 'Times New Roman', serif">Georgia — book feel</option>
            <option value="'Palatino Linotype', 'Book Antiqua', Palatino, serif">Palatino — elegant</option>
            <option value="Cambria, 'Hoefler Text', serif">Cambria — formal</option>
          </optgroup>
        </select>
      </Field>

      <Divider title="Colors" />
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 6 }}>
        <ColorInput label="Primary — headings, borders" value={brand.colors.primary} onChange={setColor("primary")} />
        <ColorInput label="Accent — links, highlights" value={brand.colors.accent} onChange={setColor("accent")} />
        <ColorInput label="Muted — captions, meta text" value={brand.colors.muted} onChange={setColor("muted")} />
        <ColorInput label="Surface — box/table backgrounds" value={brand.colors.surface} onChange={setColor("surface")} />
      </div>

      <Divider title="Footer" />
      <Toggle checked={brand.footer.showContact} onChange={setFooter("showContact")} label="Show contact details" />
      <div style={{ height: 10 }} />
      <Field label="Footer note">
        <input type="text" value={brand.footer.note} onChange={(e) => setFooter("note")(e.target.value)} placeholder="Confidential. Do not distribute." style={inputStyle()} />
      </Field>
    </div>
  );
}

// ─── Preview ───
function Preview({ html }) {
  const ref = useRef();
  useEffect(() => {
    const d = ref.current?.contentDocument;
    if (d) { d.open(); d.write(html); d.close(); }
  }, [html]);
  return <iframe ref={ref} title="preview" sandbox="allow-same-origin" style={{ width: "100%", height: "100%", border: "none", borderRadius: 4, background: "#fff" }} />;
}

// ─── App ───
export default function App() {
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [content, setContent] = useState(SAMPLE_MD);
  const [tab, setTab] = useState("edit");
  const [preview, setPreview] = useState(true);
  const [flash, setFlash] = useState(null);
  const [dragging, setDragging] = useState(false);
  const editorRef = useRef();

  const STYLES = ["modern", "formal", "minimal", "executive", "creative", "technical", "invoice", "compact"];
  const STYLE_LABELS = { modern: "Modern", formal: "Formal", minimal: "Minimal", executive: "Executive", creative: "Creative", technical: "Technical", invoice: "Invoice", compact: "Compact" };
  const cycleStyle = (dir) => {
    const i = STYLES.indexOf(brand.style);
    const next = (i + dir + STYLES.length) % STYLES.length;
    setBrand((b) => ({ ...b, style: STYLES[next] }));
  };

  const fullHtml = build(content, brand);

  // Insert text at cursor position in textarea
  const insertAtCursor = useCallback((text) => {
    const ta = editorRef.current;
    if (!ta) { setContent((c) => c + "\n" + text); return; }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    setContent((c) => c.slice(0, start) + text + c.slice(end));
    requestAnimationFrame(() => {
      const pos = start + text.length;
      ta.selectionStart = ta.selectionEnd = pos;
      ta.focus();
    });
  }, []);

  // Handle image files (from drop or paste) → base64 → insert as markdown
  const handleImageFiles = useCallback(async (files) => {
    setTab("edit");
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const dataUrl = await toBase64(file);
      const name = file.name.replace(/\.[^.]+$/, "");
      insertAtCursor(`\n![${name}](${dataUrl} "${name}")\n`);
    }
  }, [insertAtCursor]);

  // Drag & drop
  const onDragOver = useCallback((e) => { e.preventDefault(); setDragging(true); }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleImageFiles([...e.dataTransfer.files]);
  }, [handleImageFiles]);

  // Paste images
  const onPaste = useCallback((e) => {
    const images = [...(e.clipboardData?.files || [])].filter((f) => f.type.startsWith("image/"));
    if (images.length) { e.preventDefault(); handleImageFiles(images); }
  }, [handleImageFiles]);

  const download = useCallback(() => {
    const b = new Blob([fullHtml], { type: "text/html" });
    const u = URL.createObjectURL(b);
    Object.assign(document.createElement("a"), { href: u, download: `${brand.name || "document"}.html` }).click();
    URL.revokeObjectURL(u);
    setFlash("html");
    setTimeout(() => setFlash(null), 1800);
  }, [fullHtml, brand.name]);

  const print = useCallback(() => {
    const w = window.open("", "_blank");
    if (w) { w.document.write(fullHtml); w.document.close(); setTimeout(() => w.print(), 400); }
    setFlash("pdf");
    setTimeout(() => setFlash(null), 1800);
  }, [fullHtml]);

  const tabBtn = (id, label) => (
    <button onClick={() => setTab(id)} style={{
      padding: "6px 13px", fontSize: 12.5, fontWeight: tab === id ? 600 : 400,
      color: tab === id ? T.text : T.textMut,
      background: tab === id ? T.bgAlt : "transparent",
      border: "none", borderRadius: T.radius, cursor: "pointer", fontFamily: "inherit",
    }}>{label}</button>
  );

  const actBtn = (label, icon, onClick, primary) => (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "6px 12px", fontSize: 12, fontWeight: 500, fontFamily: "inherit",
      borderRadius: T.radius, cursor: "pointer",
      border: primary ? "none" : `1px solid ${T.border}`,
      background: primary ? T.text : T.bg,
      color: primary ? T.bg : T.text,
    }}>{icon} {label}</button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: T.font, color: T.text, background: T.bg, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: T.text, letterSpacing: "-0.02em" }}>modern</span>
          <span style={{ fontSize: 13.5, fontWeight: 400, color: T.textMut }}>document</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {actBtn(flash === "html" ? "Downloaded" : "HTML", <I d="M9 1H4.5A1.5 1.5 0 003 2.5v11A1.5 1.5 0 004.5 15h7a1.5 1.5 0 001.5-1.5V5.5L9 1zM9 1v4.5h4" />, download, false)}
          {actBtn(flash === "pdf" ? "Printing" : "PDF", <I d="M4 6V1.5h8V6M4 12H2.5A1.5 1.5 0 011 10.5v-3A1.5 1.5 0 012.5 6h11A1.5 1.5 0 0115 7.5v3a1.5 1.5 0 01-1.5 1.5H12M4 10h8v5H4z" />, print, true)}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left panel */}
        <div style={{ width: preview ? "44%" : "100%", display: "flex", flexDirection: "column", borderRight: preview ? `1px solid ${T.border}` : "none", minHeight: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "5px 10px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
            {tabBtn("edit", "Content")}
            {tabBtn("brand", "Brand")}
            <div style={{ flex: 1 }} />
            <button onClick={() => setPreview(!preview)} style={{ fontSize: 11, color: T.textMut, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              {preview ? "hide preview" : "show preview"}
            </button>
          </div>
          <div
            style={{ flex: 1, overflow: "auto", padding: "0 12px", minHeight: 0, position: "relative" }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {tab === "edit" ? (
              <textarea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPaste={onPaste}
                placeholder="Markdown content... (drag or paste an image)"
                spellCheck={false}
                style={{ width: "100%", height: "100%", resize: "none", border: "none", outline: "none", padding: "12px 0", fontSize: 12.5, lineHeight: 1.7, fontFamily: T.mono, color: T.text, background: "transparent", tabSize: 2 }}
              />
            ) : (
              <BrandPanel brand={brand} setBrand={setBrand} />
            )}
            {dragging && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(37,99,235,0.06)",
                border: `2px dashed ${T.accent}`, borderRadius: T.radius,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none", zIndex: 5,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.accent }}>Drop image here</span>
              </div>
            )}
          </div>
        </div>

        {/* Right panel — preview */}
        {preview && (
          <div style={{ width: "56%", display: "flex", flexDirection: "column", background: T.bgAlt, minHeight: 0 }}>
            <div style={{ padding: "6px 12px", borderBottom: `1px solid ${T.border}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMut }}>Preview</span>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <button onClick={() => cycleStyle(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 5px", fontSize: 11, color: T.textMut, fontFamily: "inherit", lineHeight: 1 }} aria-label="Previous style">
                  <I d="M10 2L5 8l5 6" s={12} />
                </button>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: T.textSec, minWidth: 64, textAlign: "center", userSelect: "none" }}>
                  {STYLE_LABELS[brand.style] || brand.style}
                </span>
                <button onClick={() => cycleStyle(1)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 5px", fontSize: 11, color: T.textMut, fontFamily: "inherit", lineHeight: 1 }} aria-label="Next style">
                  <I d="M6 2l5 6-5 6" s={12} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1, padding: 10, minHeight: 0 }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 14px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                <Preview html={fullHtml} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
