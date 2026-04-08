import { describe, it } from "node:test";
import assert from "node:assert";
import { parseMd } from "../src/core/markdown.js";

describe("parseMd", () => {
  // ─── Headings ───

  it("converts h1", () => {
    assert.strictEqual(parseMd("# Hello"), "<h1>Hello</h1>");
  });

  it("converts h2", () => {
    assert.strictEqual(parseMd("## Section"), "<h2>Section</h2>");
  });

  it("converts h3", () => {
    assert.strictEqual(parseMd("### Subsection"), "<h3>Subsection</h3>");
  });

  it("converts h4", () => {
    assert.strictEqual(parseMd("#### Detail"), "<h4>Detail</h4>");
  });

  // ─── Inline formatting ───

  it("converts bold text", () => {
    const result = parseMd("**bold**");
    assert.ok(result.includes("<strong>bold</strong>"));
  });

  it("converts italic text", () => {
    const result = parseMd("*italic*");
    assert.ok(result.includes("<em>italic</em>"));
  });

  it("converts bold-italic text", () => {
    const result = parseMd("***both***");
    assert.ok(result.includes("<strong><em>both</em></strong>"));
  });

  // ─── Lists ───

  it("converts unordered lists", () => {
    const md = "- Alpha\n- Beta\n- Gamma";
    const result = parseMd(md);
    assert.ok(result.includes("<ul>"));
    assert.ok(result.includes("<li>Alpha</li>"));
    assert.ok(result.includes("<li>Beta</li>"));
    assert.ok(result.includes("<li>Gamma</li>"));
    assert.ok(result.includes("</ul>"));
  });

  it("converts ordered lists", () => {
    const md = "1. First\n2. Second\n3. Third";
    const result = parseMd(md);
    assert.ok(result.includes("<ol>"));
    assert.ok(result.includes("<li>First</li>"));
    assert.ok(result.includes("<li>Second</li>"));
    assert.ok(result.includes("</ol>"));
  });

  // ─── Tables ───

  it("converts a basic table", () => {
    const md = "| Name | Value |\n| --- | --- |\n| A | 1 |\n| B | 2 |";
    const result = parseMd(md);
    assert.ok(result.includes("<table>"));
    assert.ok(result.includes("<thead>"));
    assert.ok(result.includes("<th>Name</th>"));
    assert.ok(result.includes("<th>Value</th>"));
    assert.ok(result.includes("<tbody>"));
    assert.ok(result.includes("<td>A</td>"));
    assert.ok(result.includes("<td>1</td>"));
    assert.ok(result.includes("</table>"));
  });

  // ─── Images ───

  it("converts block images with caption", () => {
    const md = '![Chart](chart.png "Q1 Results")';
    const result = parseMd(md);
    assert.ok(result.includes('<figure class="doc-figure">'));
    assert.ok(result.includes('src="chart.png"'));
    assert.ok(result.includes('alt="Chart"'));
    assert.ok(result.includes("<figcaption>Q1 Results</figcaption>"));
  });

  it("converts block images without caption", () => {
    const md = "![Logo](logo.svg)";
    const result = parseMd(md);
    assert.ok(result.includes('<figure class="doc-figure">'));
    assert.ok(result.includes('src="logo.svg"'));
    assert.ok(result.includes('alt="Logo"'));
    assert.ok(!result.includes("<figcaption>"));
  });

  it("converts inline images", () => {
    const md = "See the icon ![icon](icon.png) here";
    const result = parseMd(md);
    assert.ok(result.includes('class="doc-img-inline"'));
    assert.ok(result.includes('src="icon.png"'));
  });

  // ─── Code blocks ───

  it("preserves code blocks", () => {
    const md = "```js\nconst x = 1;\n```";
    const result = parseMd(md);
    assert.ok(result.includes('<pre class="doc-code">'));
    assert.ok(result.includes("const x = 1;"));
  });

  it("escapes HTML inside code blocks", () => {
    const md = "```\n<div>test</div>\n```";
    const result = parseMd(md);
    assert.ok(result.includes("&lt;div&gt;"));
    assert.ok(!result.includes("<div>test</div>"));
  });

  // ─── XSS prevention ───

  it("escapes script tags in image alt text", () => {
    const md = "![<script>alert(1)</script>](x.jpg)";
    const result = parseMd(md);
    assert.ok(!result.includes("<script>"), "raw <script> tag must not appear in output");
    assert.ok(result.includes("&lt;script&gt;"), "script tag should be escaped");
  });

  // ─── Horizontal rules ───

  it("converts horizontal rules", () => {
    const result = parseMd("---");
    assert.ok(result.includes("<hr/>"));
  });

  it("converts long horizontal rules", () => {
    const result = parseMd("------");
    assert.ok(result.includes("<hr/>"));
  });

  // ─── Paragraphs ───

  it("wraps plain text in paragraph tags", () => {
    const result = parseMd("Hello world");
    assert.ok(result.includes("<p>Hello world</p>"));
  });

  it("does not double-wrap headings in paragraphs", () => {
    const result = parseMd("# Title");
    assert.ok(!result.includes("<p><h1>"));
    assert.ok(!result.includes("<p># Title</p>"));
  });
});
