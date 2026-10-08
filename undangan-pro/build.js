// Membangun satu halaman undangan per folder di klien/<nama-klien>/ dari template.html.
// Dijalankan otomatis oleh Netlify (lihat netlify.toml). Tidak butuh paket tambahan.
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const R = __dirname, OUT = path.join(R, "dist");
const SITE = (process.env.URL || process.env.DEPLOY_PRIME_URL || "").replace(/\/$/, "");
const PW = process.env.EDITOR_PASSWORD ? crypto.createHash("sha256").update(process.env.EDITOR_PASSWORD).digest("hex") : "";

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const d of ["assets", "alat"]) if (fs.existsSync(path.join(R, d))) fs.cpSync(path.join(R, d), path.join(OUT, d), { recursive: true });

const T = fs.readFileSync(path.join(R, "template.html"), "utf8");
const def = k => (T.match(new RegExp('data-t="' + k + '"[^>]*>([^<]*)<')) || [, ""])[1];
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const fix = (slug, p) => (!p || /^(data:|https?:|\/)/.test(p)) ? p : "/" + slug + "/" + String(p).replace(/^\.?\//, "");

function page(slug, cfg, editor) {
  cfg = JSON.parse(JSON.stringify(cfg));
  if (cfg.f) for (const k in cfg.f) cfg.f[k] = fix(slug, cfg.f[k]);
  if (cfg.musik) cfg.musik = fix(slug, cfg.musik);
  const t = cfg.t || {};
  const nama = (t.n1 || def("n1")).trim() + " & " + (t.n2 || def("n2")).trim();
  const title = cfg.judul || "Undangan Pernikahan " + nama;
  const desc = cfg.deskripsi || "Dengan penuh syukur, kami mengundang Anda di hari bahagia kami. " + (t.tgl || def("tgl"));
  let ogp = cfg.og ? fix(slug, cfg.og) : (cfg.f && cfg.f.cover && !/^data:/.test(cfg.f.cover) ? cfg.f.cover : "/assets/og-default.jpg");
  const og = SITE && ogp ? (/^https?:/.test(ogp) ? ogp : SITE + ogp) : "";
  const head = `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">${og ? `
<meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image">` : ""}
<meta name="robots" content="noindex,nofollow">`;
  const inj = `<script>window.__SLUG__=${JSON.stringify(slug)};window.__CFG__=${JSON.stringify(cfg).replace(/</g, "\\u003c")};window.__PW__=${JSON.stringify(editor ? PW : "")};</script>`;
  let h = T.replace("<!--HEAD-->", head).replace("<!--INJECT-->", inj);
  if (!editor) h = h.replace(/\/\*ED_START\*\/[\s\S]*?\/\*ED_END\*\//, "");
  return h;
}

// Folder klien boleh di klien/<nama>/ ATAU langsung di akar repo (asal berisi config.json).
const SKIP = new Set(["assets", "alat", "klien", "dist", "node_modules", "studio"]);
const dirs = [], KD = path.join(R, "klien"); let n = 0;
if (fs.existsSync(KD)) for (const s of fs.readdirSync(KD)) dirs.push([s, path.join(KD, s)]);
for (const s of fs.readdirSync(R)) {
  const d = path.join(R, s);
  if (!SKIP.has(s) && !s.startsWith(".") && fs.statSync(d).isDirectory() && fs.existsSync(path.join(d, "config.json"))) dirs.push([s, d]);
}
for (const [slug, d] of dirs) {
  if (!fs.statSync(d).isDirectory() || slug.startsWith("_")) continue;
  if (!/^[a-z0-9-]+$/.test(slug)) { console.warn("Lewati '" + slug + "': nama folder hanya boleh huruf kecil, angka, dan tanda minus."); continue; }
  let cfg = {};
  try { cfg = JSON.parse(fs.readFileSync(path.join(d, "config.json"), "utf8")); } catch (e) { console.warn("config.json bermasalah di '" + slug + "', memakai bawaan."); }
  const o = path.join(OUT, slug);
  fs.cpSync(d, o, { recursive: true });
  fs.rmSync(path.join(o, "config.json"), { force: true });
  fs.writeFileSync(path.join(o, "index.html"), page(slug, cfg, false));
  console.log("  + /" + slug + "/");
  n++;
}
fs.mkdirSync(path.join(OUT, "studio"), { recursive: true });
fs.writeFileSync(path.join(OUT, "studio", "index.html"), page("studio", {}, true));
fs.writeFileSync(path.join(OUT, "robots.txt"), "User-agent: *\nDisallow: /\n");
fs.writeFileSync(path.join(OUT, "index.html"), '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Undangan</title><p style="font:16px sans-serif;padding:40px">Gunakan link undangan yang Anda terima.</p>');
console.log("Selesai: " + n + " undangan klien + studio" + (PW ? " (editor berkata sandi)" : " (EDITOR_PASSWORD belum diatur)"));
