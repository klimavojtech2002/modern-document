function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function parseMd(md) {
  // Extract fenced code blocks before any processing
  const codeBlocks = [];
  md = md.replace(/^```[^\n]*\n([\s\S]*?)^```$/gm, (_, code) => {
    const escaped = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    codeBlocks.push(`<pre class="doc-code">${escaped.trimEnd()}</pre>`);
    return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
  });

  // Wrap consecutive lines containing box-drawing characters in <pre>
  const diagBlocks = [];
  md = md.replace(
    /(^.*[┌┐└┘├┤┬┴┼─│▲▼►◄].*$(?:\n(?:.*[┌┐└┘├┤┬┴┼─│▲▼►◄].*|[ \t]*$))*)/gm,
    (block) => {
      const escaped = block.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      diagBlocks.push(`<pre class="doc-diagram">${escaped}</pre>`);
      return `%%DIAGBLOCK_${diagBlocks.length - 1}%%`;
    },
  );

  return md
    // Images: ![alt](src) and ![alt](src "caption")
    .replace(
      /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/gm,
      (_, alt, src, caption) => {
        const img = `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy"/>`;
        if (caption) {
          return `<figure class="doc-figure">${img}<figcaption>${escapeHtml(caption)}</figcaption></figure>`;
        }
        return `<figure class="doc-figure">${img}</figure>`;
      },
    )
    // Inline images (within text): ![alt](src)
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (_, alt, src) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="doc-img-inline" loading="lazy"/>`,
    )
    // Tables
    .replace(
      /^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm,
      (_, header, _sep, body) => {
        const ths = header
          .split("|")
          .slice(1, -1)
          .map((c) => `<th>${c.trim() || "&nbsp;"}</th>`)
          .join("");
        const rows = body
          .trim()
          .split("\n")
          .map((row) => {
            const cells = row
              .split("|")
              .slice(1, -1)
              .map((c) => {
                const t = c.trim();
                if (!t) return `<td>&nbsp;</td>`;
                const bold = t.startsWith("**") && t.endsWith("**");
                return `<td>${bold ? `<strong>${t.slice(2, -2)}</strong>` : t}</td>`;
              })
              .join("");
            return `<tr>${cells}</tr>`;
          })
          .join("\n");
        return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
      },
    )
    // Headings
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Horizontal rule
    .replace(/^---+$/gm, "<hr/>")
    // Inline formatting
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Lists
    .replace(/^(\d+)\. (.+)$/gm, "<oli>$2</oli>")
    .replace(/^[-*] (.+)$/gm, "<uli>$1</uli>")
    .replace(/((?:<uli>.+<\/uli>\n?)+)/g, (m) =>
      `<ul>${m.replace(/<\/?uli>/g, (s) => (s === "<uli>" ? "<li>" : "</li>"))}</ul>`,
    )
    .replace(/((?:<oli>.+<\/oli>\n?)+)/g, (m) =>
      `<ol>${m.replace(/<\/?oli>/g, (s) => (s === "<oli>" ? "<li>" : "</li>"))}</ol>`,
    )
    // Blockquotes
    .replace(/(^>.*$(?:\n^>.*$)*)/gm, (block) => {
      const inner = block.replace(/^> ?/gm, "");
      const wrapped = inner.replace(/^(?!<(?:h[1-4]|ul|ol|li|table|thead|tbody|tr|td|th|pre|hr|figure|blockquote|div)|%%CODEBLOCK_|%%DIAGBLOCK_|$)(.+)$/gm, "<p>$1</p>");
      return `<blockquote>${wrapped}</blockquote>`;
    })
    // Paragraphs (lines not starting with HTML tag or code block placeholder)
    .replace(/^(?!<[a-z/]|%%CODEBLOCK_|%%DIAGBLOCK_|$)(.+)$/gm, "<p>$1</p>")
    // Restore extracted blocks
    .replace(/%%CODEBLOCK_(\d+)%%/g, (_, i) => codeBlocks[i])
    .replace(/%%DIAGBLOCK_(\d+)%%/g, (_, i) => diagBlocks[i]);
}
