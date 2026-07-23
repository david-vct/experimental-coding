import "./style.css";
import manifest from "../experiments.json";
import { highlightJs } from "./highlight.js";
import asciiName from "./ascii-name.txt?raw";

const BASE = import.meta.env.BASE_URL; // "./" — relative, host-agnostic
const { repo, branch, experiments } = manifest;

const bySlug = new Map(experiments.map((e) => [`${e.category}/${e.slug}`, e]));

/* ---------- helpers ---------------------------------------------------- */

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function")
      node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
};

const assetUrl = (entry) => `${BASE}experiments/${entry}`;
const staticUrl = (path) => `${BASE}${path}`;
const repoUrl = (entry) => `${repo}/blob/${branch}/${entry}`;
const idOf = (exp) => `${exp.category}/${exp.slug}`;

const sourceCache = new Map();
async function loadSource(exp) {
  const key = idOf(exp);
  if (!sourceCache.has(key)) {
    sourceCache.set(
      key,
      fetch(assetUrl(exp.entry)).then((r) => (r.ok ? r.text() : "// source unavailable")),
    );
  }
  return sourceCache.get(key);
}

/* ---------- live-preview lazy loading ---------------------------------- */
// Only mount a live <iframe> when its card scrolls near the viewport, so the
// animated quines don't all run setInterval() at once.

const lazyIframes = new IntersectionObserver(
  (entries, obs) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.src = target.dataset.src;
      obs.unobserve(target);
    }
  },
  { rootMargin: "200px" },
);

/* ---------- cards ------------------------------------------------------- */

function previewNode(exp) {
  // An explicit screenshot always wins over a live iframe / code snippet.
  if (exp.image) {
    return el(
      "div",
      { class: "preview preview--image" },
      el("img", {
        class: "preview-img",
        src: staticUrl(exp.image),
        alt: `${exp.title} — screenshot`,
        loading: "lazy",
      }),
    );
  }

  if (exp.type === "live") {
    const frame = el("iframe", {
      class: "preview-frame",
      title: `${exp.title} — preview`,
      loading: "lazy",
      tabindex: "-1",
      "aria-hidden": "true",
      scrolling: "no",
    });
    frame.dataset.src = assetUrl(exp.entry);
    lazyIframes.observe(frame);
    return el("div", { class: "preview preview--live" }, frame);
  }

  const pre = el("pre", { class: "preview-code" }, el("code", {}, "loading…"));
  loadSource(exp).then((src) => {
    const snippet = src.split("\n").slice(0, 14).join("\n");
    pre.firstChild.innerHTML = highlightJs(snippet);
  });
  return el(
    "div",
    { class: "preview preview--code" },
    pre,
    el("span", { class: "preview-lang" }, exp.language),
  );
}

function card(exp) {
  const open = (e) => {
    if (e.target.closest("a")) return; // let real links behave normally
    location.hash = `#/${idOf(exp)}`;
  };

  return el(
    "article",
    {
      class: "card",
      onclick: open,
      tabindex: "0",
      "data-type": exp.type,
      onkeydown: (e) => { if (e.key === "Enter") open(e); },
    },
    previewNode(exp),
    el(
      "div",
      { class: "card-body" },
      el(
        "header",
        { class: "card-head" },
        el("h2", { class: "card-title" }, exp.title),
        el("span", { class: `badge badge--${exp.type}` }, exp.type),
      ),
      el("p", { class: "card-desc" }, exp.description),
      el(
        "ul",
        { class: "tags" },
        exp.tags.map((t) => el("li", { class: "tag" }, `#${t}`)),
      ),
      el(
        "footer",
        { class: "card-links" },
        exp.type === "live"
          ? el("a", { href: assetUrl(exp.entry), target: "_blank", rel: "noopener" }, "open ↗")
          : el("a", { href: repoUrl(exp.entry), target: "_blank", rel: "noopener" }, "file ↗"),
        el("a", { href: repoUrl(exp.entry), target: "_blank", rel: "noopener", class: "muted" }, "git ↗"),
      ),
    ),
  );
}

/* ---------- gallery layout --------------------------------------------- */

function gallery() {
  const categories = [...new Set(experiments.map((e) => e.category))];
  const frag = document.createDocumentFragment();

  frag.append(
    el(
      "header",
      { class: "site-head" },
      el("pre", { class: "ascii-name", "aria-label": "david-vct" }, asciiName),
      el("h1", { class: "site-title" }, el("span", { class: "prompt" }, "> "), "experimental-coding"),
      el(
        "p",
        { class: "site-sub" },
        "Small explorations of programming concepts: quines, fractals, code golf, esolangs. ",
        el("a", { href: repo, target: "_blank", rel: "noopener" }, "repo ↗"),
      ),
    ),
  );

  for (const cat of categories) {
    const items = experiments.filter((e) => e.category === cat);
    frag.append(
      el(
        "section",
        { class: "cat" },
        el(
          "h2",
          { class: "cat-title" },
          el("span", { class: "comment" }, "// "),
          cat,
          el("span", { class: "cat-count" }, `(${items.length})`),
        ),
        el("div", { class: "grid" }, items.map(card)),
      ),
    );
  }

  frag.append(
    el(
      "footer",
      { class: "site-foot" },
      el("span", { class: "comment" }, `// ${experiments.length} experiments · (c) 2026 David Vicente · MIT License`),
    ),
  );

  return frag;
}

/* ---------- overlay (in-page open) ------------------------------------- */

let overlay = null;

function closeOverlay() {
  if (!overlay) return;
  overlay.remove();
  overlay = null;
  document.body.classList.remove("no-scroll");
}

async function openOverlay(exp) {
  closeOverlay();
  document.body.classList.add("no-scroll");

  const bar = el(
    "div",
    { class: "ov-bar" },
    el(
      "div",
      { class: "ov-meta" },
      el("span", { class: "ov-path" }, `${exp.category}/`),
      el("strong", { class: "ov-title" }, exp.title),
      el("span", { class: `badge badge--${exp.type}` }, exp.type),
    ),
    el(
      "div",
      { class: "ov-actions" },
      exp.type === "live" &&
        el("a", { href: assetUrl(exp.entry), target: "_blank", rel: "noopener" }, "fullscreen ↗"),
      el("a", { href: repoUrl(exp.entry), target: "_blank", rel: "noopener" }, "git ↗"),
      el("button", { class: "ov-close", "aria-label": "Close", onclick: () => { location.hash = "#/"; } }, "✕"),
    ),
  );

  let stage;
  if (exp.type === "live") {
    stage = el("iframe", {
      class: "ov-frame",
      src: assetUrl(exp.entry),
      title: exp.title,
    });
  } else {
    const pre = el("pre", { class: "ov-code" }, el("code", {}, "loading…"));
    loadSource(exp).then((src) => {
      pre.firstChild.innerHTML = highlightJs(src);
    });
    stage = el("div", { class: "ov-codewrap" }, pre);
  }

  overlay = el(
    "div",
    {
      class: "overlay",
      onclick: (e) => { if (e.target === overlay) location.hash = "#/"; },
    },
    el("div", { class: "ov-panel" }, bar, stage),
  );
  document.body.append(overlay);
}

/* ---------- router ----------------------------------------------------- */

function route() {
  const hash = location.hash.replace(/^#\/?/, "");
  const exp = bySlug.get(hash);
  if (exp) openOverlay(exp);
  else closeOverlay();
}

window.addEventListener("hashchange", route);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay) location.hash = "#/";
});

/* ---------- boot ------------------------------------------------------- */

document.getElementById("app").append(gallery());
route();
