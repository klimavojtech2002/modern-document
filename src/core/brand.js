export const DEFAULT_BRAND = {
  name: "Modern Document",
  tagline: "Documents worth reading.",
  web: "moderndocument.app",
  email: "hello@moderndocument.app",
  logo: null,
  icon: null,
  colors: {
    primary: "#0F0F0F",
    accent: "#2563EB",
    muted: "#868B93",
    surface: "#F6F6F8",
  },
  fonts: {
    heading: "Georgia, serif",
    body: "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  style: "modern",
  footer: {
    showContact: true,
    note: "",
  },
};

export function mergeBrand(custom = {}) {
  return {
    ...DEFAULT_BRAND,
    ...custom,
    colors: { ...DEFAULT_BRAND.colors, ...custom.colors },
    fonts: { ...DEFAULT_BRAND.fonts, ...custom.fonts },
    footer: { ...DEFAULT_BRAND.footer, ...custom.footer },
  };
}

export async function loadBrand(brandPath) {
  const { readFile } = await import("node:fs/promises");
  const { resolve, dirname } = await import("node:path");
  let raw;
  try {
    raw = JSON.parse(await readFile(brandPath, "utf-8"));
  } catch (e) {
    throw new Error(`Failed to parse brand file "${brandPath}": ${e.message}`);
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error(`Brand file "${brandPath}" must contain a JSON object`);
  }

  const brandDir = dirname(resolve(brandPath));

  for (const key of ["logo", "icon"]) {
    if (raw[key] && !raw[key].startsWith("data:")) {
      const filePath = resolve(brandDir, raw[key]);
      const buf = await readFile(filePath);
      const ext = filePath.split(".").pop().toLowerCase();
      const mime = ext === "svg" ? "image/svg+xml" : `image/${ext}`;
      raw[key] = `data:${mime};base64,${buf.toString("base64")}`;
    }
  }

  return mergeBrand(raw);
}
