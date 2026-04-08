import { describe, it } from "node:test";
import assert from "node:assert";
import { mergeBrand, DEFAULT_BRAND } from "../src/core/brand.js";

describe("mergeBrand", () => {
  it("returns default brand when called with no arguments", () => {
    const brand = mergeBrand();
    assert.deepStrictEqual(brand, DEFAULT_BRAND);
  });

  it("returns default brand when called with empty object", () => {
    const brand = mergeBrand({});
    assert.deepStrictEqual(brand, DEFAULT_BRAND);
  });

  it("overrides top-level name while preserving other defaults", () => {
    const brand = mergeBrand({ name: "Acme Inc." });
    assert.strictEqual(brand.name, "Acme Inc.");
    assert.strictEqual(brand.tagline, DEFAULT_BRAND.tagline);
    assert.strictEqual(brand.style, DEFAULT_BRAND.style);
    assert.deepStrictEqual(brand.colors, DEFAULT_BRAND.colors);
  });

  it("deep merges colors — overrides one, keeps the rest", () => {
    const brand = mergeBrand({ colors: { accent: "#FF0000" } });
    assert.strictEqual(brand.colors.accent, "#FF0000");
    assert.strictEqual(brand.colors.primary, DEFAULT_BRAND.colors.primary);
    assert.strictEqual(brand.colors.muted, DEFAULT_BRAND.colors.muted);
    assert.strictEqual(brand.colors.surface, DEFAULT_BRAND.colors.surface);
  });

  it("deep merges fonts — overrides heading, keeps body", () => {
    const brand = mergeBrand({ fonts: { heading: "Inter, sans-serif" } });
    assert.strictEqual(brand.fonts.heading, "Inter, sans-serif");
    assert.strictEqual(brand.fonts.body, DEFAULT_BRAND.fonts.body);
  });

  it("deep merges footer — overrides note, keeps showContact", () => {
    const brand = mergeBrand({ footer: { note: "Confidential" } });
    assert.strictEqual(brand.footer.note, "Confidential");
    assert.strictEqual(brand.footer.showContact, DEFAULT_BRAND.footer.showContact);
  });

  it("deep merges footer — overrides showContact, keeps note", () => {
    const brand = mergeBrand({ footer: { showContact: false } });
    assert.strictEqual(brand.footer.showContact, false);
    assert.strictEqual(brand.footer.note, DEFAULT_BRAND.footer.note);
  });

  it("handles multiple overrides simultaneously", () => {
    const brand = mergeBrand({
      name: "TestCo",
      colors: { primary: "#111111" },
      fonts: { body: "Roboto, sans-serif" },
      footer: { note: "Draft" },
    });
    assert.strictEqual(brand.name, "TestCo");
    assert.strictEqual(brand.colors.primary, "#111111");
    assert.strictEqual(brand.colors.accent, DEFAULT_BRAND.colors.accent);
    assert.strictEqual(brand.fonts.body, "Roboto, sans-serif");
    assert.strictEqual(brand.fonts.heading, DEFAULT_BRAND.fonts.heading);
    assert.strictEqual(brand.footer.note, "Draft");
    assert.strictEqual(brand.footer.showContact, true);
  });
});
