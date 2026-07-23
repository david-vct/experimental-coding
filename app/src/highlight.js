/**
 * Tiny dependency-free syntax highlighter.
 *
 * Not a real parser — a small, ordered tokenizer good enough for the short
 * self-contained snippets in this repo. Emits <span class="tok-*"> wrapping,
 * with the raw source HTML-escaped first so it is always safe to inject.
 */

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "for", "while", "do", "if",
  "else", "switch", "case", "break", "continue", "new", "class", "extends",
  "typeof", "instanceof", "in", "of", "await", "async", "yield", "throw",
  "try", "catch", "finally", "delete", "void", "this", "super", "import",
  "export", "from", "default", "require",
]);

const LITERALS = new Set(["true", "false", "null", "undefined", "NaN", "Infinity"]);

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function span(cls, text) {
  return `<span class="tok-${cls}">${escapeHtml(text)}</span>`;
}

// Ordered rules; first match at the cursor wins.
const RULES = [
  ["comment", /^\/\/[^\n]*/],
  ["comment", /^\/\*[\s\S]*?\*\//],
  ["string", /^`(?:\\.|[^`\\])*`/],
  ["string", /^"(?:\\.|[^"\\])*"/],
  ["string", /^'(?:\\.|[^'\\])*'/],
  ["number", /^\b(?:0[xX][0-9a-fA-F]+|\d+\.?\d*(?:[eE][+-]?\d+)?)\b/],
  ["ident", /^[A-Za-z_$][\w$]*/],
  ["ws", /^\s+/],
  ["other", /^[\s\S]/],
];

export function highlightJs(source) {
  let out = "";
  let src = source;

  while (src.length) {
    let matched = false;
    for (const [kind, re] of RULES) {
      const m = re.exec(src);
      if (!m) continue;
      const text = m[0];

      if (kind === "ident") {
        if (KEYWORDS.has(text)) out += span("keyword", text);
        else if (LITERALS.has(text)) out += span("literal", text);
        else out += escapeHtml(text);
      } else if (kind === "ws" || kind === "other") {
        out += escapeHtml(text);
      } else {
        out += span(kind, text);
      }

      src = src.slice(text.length);
      matched = true;
      break;
    }
    if (!matched) {
      out += escapeHtml(src[0]);
      src = src.slice(1);
    }
  }
  return out;
}
