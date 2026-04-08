import { describe, it } from "node:test";
import assert from "node:assert";
import { build } from "../src/core/build.js";
import { mergeBrand } from "../src/core/brand.js";

/**
 * Helper: produce a full HTML document with sensible defaults.
 * Callers can override brand properties and build options as needed.
 */
function buildDoc(content = "", brandOverrides = {}, opts = {}) {
  const brand = mergeBrand(brandOverrides);
  return build(content, brand, opts);
}

describe("build", () => {
  it("returns a string containing <!DOCTYPE html>", () => {
    const html = buildDoc();
    assert.ok(html.includes("<!DOCTYPE html>"));
  });

  it("contains lang=\"en\"", () => {
    const html = buildDoc();
    assert.ok(html.includes('lang="en"'));
  });

  it("applies brand name in the title tag", () => {
    const html = buildDoc("Hello", { name: "Acme Corp" });
    assert.ok(html.includes("<title>Acme Corp</title>"));
  });

  it("uses explicit title over brand name when provided", () => {
    const html = buildDoc("Hello", { name: "Acme Corp" }, { title: "Custom Title" });
    assert.ok(html.includes("<title>Custom Title</title>"));
    assert.ok(!html.includes("<title>Acme Corp</title>"));
  });

  it("defaults title to 'Document' when no title or brand.name given", () => {
    const brand = mergeBrand({ name: "" });
    const html = build("Hello", brand, {});
    assert.ok(html.includes("<title>Document</title>"));
  });

  it("contains CSS variables for brand colors", () => {
    const html = buildDoc("text", {
      colors: { primary: "#112233", accent: "#445566" },
    });
    assert.ok(html.includes("--primary:#112233"));
    assert.ok(html.includes("--accent:#445566"));
  });

  it("applies style preset layout values", () => {
    const html = buildDoc("text", { style: "executive" });
    // Executive preset uses h1 font-size of 2.5rem
    assert.ok(html.includes("2.5rem"));
  });

  it("applies default modern style when style is unrecognized", () => {
    const html = buildDoc("text", { style: "nonexistent" });
    // Falls back to modern — h1 size 2.75rem
    assert.ok(html.includes("2.75rem"));
  });

  it("passes content through without markdown parsing when isHtml is true", () => {
    const raw = '<div class="custom">Already HTML</div>';
    const html = buildDoc(raw, {}, { isHtml: true });
    assert.ok(html.includes(raw), "raw HTML should appear verbatim in output");
    // Should NOT be wrapped in <p> tags (which parseMd would do)
    assert.ok(!html.includes("<p>" + raw + "</p>"));
  });

  it("parses markdown content by default", () => {
    const html = buildDoc("# Big Title");
    assert.ok(html.includes("<h1>Big Title</h1>"));
  });

  it("includes brand name in the header", () => {
    const html = buildDoc("content", { name: "TestBrand" });
    assert.ok(html.includes("TestBrand"));
  });

  it("includes footer with brand details", () => {
    const html = buildDoc("content", {
      name: "FooterCo",
      web: "footerco.com",
      email: "hi@footerco.com",
    });
    assert.ok(html.includes("FooterCo"));
    assert.ok(html.includes("footerco.com"));
    assert.ok(html.includes("hi@footerco.com"));
  });
});
