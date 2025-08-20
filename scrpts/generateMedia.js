/* scripts/generateMedia.js */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const AUDIO_DIR = path.join(ROOT, "public", "audio");
const VIDEO_DIR = path.join(ROOT, "public", "video");
const POSTER_DIR = path.join(ROOT, "public", "video", "posters");
const OUT_DIR = path.join(ROOT, "site-data");
const OUT_FILE = path.join(OUT_DIR, "media.json");
const OVERRIDES_FILE = path.join(OUT_DIR, "media-overrides.json"); // optional

const AUDIO_EXT = new Set([".mp3", ".m4a", ".wav", ".ogg", ".flac"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const MIME_MAP = {
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".flac": "audio/flac",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v",
};

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function safeReadJSON(p, fallback = {}) {
  try {
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback;
  } catch (e) {
    console.warn(`⚠ Failed to parse JSON at ${p}:`, e.message);
    return fallback;
  }
}

function titleFromFilename(filename) {
  const base = filename.replace(/\.[^/.]+$/, "");
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function scanDir(dir, typeSet, type) {
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => typeSet.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return files.map((filename) => {
    const ext = path.extname(filename).toLowerCase();
    const id = `${type}-${filename}`;
    const base = filename.replace(ext, "");
    const src =
      type === "audio" ? `/audio/${filename}` : `/video/${filename}`;

    // Try to auto-pick a poster (same basename) if present
    let poster = null;
    if (type === "video" && fs.existsSync(POSTER_DIR)) {
      const posterCandidate = ["jpg", "jpeg", "png", "webp"]
        .map((p) => path.join(POSTER_DIR, `${base}.${p}`))
        .find((p) => fs.existsSync(p));
      if (posterCandidate) {
        poster =
          "/video/posters/" + path.basename(posterCandidate);
      }
    }

    return {
      id,
      type,
      title: titleFromFilename(filename),
      src,
      mime: MIME_MAP[ext] || (type === "audio" ? "audio/mpeg" : "video/mp4"),
      ...(poster ? { poster } : {}),
      description: "",
      order: null, // can be overridden
    };
  });
}

function applyOverrides(items, overrides) {
  if (!overrides || typeof overrides !== "object") return items;
  const byId = new Map(items.map((it) => [it.id, it]));
  const bySrc = new Map(items.map((it) => [it.src, it]));

  // Overrides can be keyed by id OR src or filename
  const entries = Object.entries(overrides);
  for (const [key, patch] of entries) {
    const target =
      byId.get(key) ||
      bySrc.get(key) ||
      bySrc.get("/audio/" + key) ||
      bySrc.get("/video/" + key);
    if (target) {
      Object.assign(target, patch);
    }
  }
  return items;
}

function main() {
  ensureDir(OUT_DIR);
  const overrides = safeReadJSON(OVERRIDES_FILE, null);

  const audio = scanDir(AUDIO_DIR, AUDIO_EXT, "audio");
  const video = scanDir(VIDEO_DIR, VIDEO_EXT, "video");

  let items = [...audio, ...video];

  // Apply optional overrides (titles, descriptions, custom order, poster, mime, etc.)
  items = applyOverrides(items, overrides);

  // Sort: first by explicit order if present, then by type, then title
  items.sort((a, b) => {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    if (ao !== bo) return ao - bo;
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.title.localeCompare(b.title, undefined, { numeric: true });
  });

  fs.writeFileSync(OUT_FILE, JSON.stringify(items, null, 2));
  console.log(`✅ media.json generated with ${items.length} items at ${OUT_FILE}`);
}

main();
