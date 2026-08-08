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

// Index of the quote closing the string opened at `start`, or the end of the
// text when it is never closed.
function skipString(text, start) {
  const quote = text[start];
  for (let i = start + 1; i < text.length; i++) {
    if (text[i] === "\\") i++;
    else if (text[i] === quote) return i;
  }
  return text.length;
}

// Index of the `}` matching the `{` at `open`, or -1. Counts depth so object
// literals inside an interpolation do not close it early.
function matchBrace(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    const c = text[i];
    if (c === "\\") i++;
    else if (c === '"' || c === "'" || c === "`") i = skipString(text, i);
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return i;
  }
  return -1;
}

// A template literal: the quoted parts stay string-coloured, every `${...}`
// interpolation gets its own token so it reads apart from the text.
function highlightTemplate(text) {
  let out = "";
  let buf = "";
  let i = 0;

  while (i < text.length) {
    if (text[i] === "\\") {
      buf += text.slice(i, i + 2);
      i += 2;
    } else if (text[i] === "$" && text[i + 1] === "{") {
      const end = matchBrace(text, i + 1);
      if (end === -1) break;
      if (buf) out += span("string", buf);
      buf = "";
      out += span("interp", text.slice(i, end + 1));
      i = end + 1;
    } else {
      buf += text[i++];
    }
  }

  buf += text.slice(i);
  if (buf) out += span("string", buf);
  return out;
}

// Ordered rules; first match at the cursor wins.
const RULES = [
  ["comment", /^\/\/[^\n]*/],
  ["comment", /^\/\*[\s\S]*?\*\//],
  ["template", /^`(?:\\.|[^`\\])*`/],
  ["string", /^"(?:\\.|[^"\\])*"/],
  ["string", /^'(?:\\.|[^'\\])*'/],
  ["number", /^\b(?:0[xX][0-9a-fA-F]+|\d+\.?\d*(?:[eE][+-]?\d+)?)\b/],
  ["ident", /^[A-Za-z_$][\w$]*/],
  ["op", /^[+\-*/%=<>!&|^~?:]+/],
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
      } else if (kind === "template") {
        out += highlightTemplate(text);
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
