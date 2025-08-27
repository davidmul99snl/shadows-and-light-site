// scripts/generateMedia.cjs
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const SITE_DATA = path.join(PUBLIC, "site-data");

const AUDIO_DIR = path.join(PUBLIC, "audio");
const VIDEO_DIR = path.join(PUBLIC, "videos");

const AUDIO_JSON = path.join(SITE_DATA, "audio.json");
const VIDEOS_JSON = path.join(SITE_DATA, "videos.json");

const AUDIO_EXTS = new Set([".mp3", ".wav", ".m4a", ".ogg"]);
const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov"]);

function toTitle(name) {
  // "river-live" -> "River Live"
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

async function listMedia(dir, allowed) {
  try {
    const items = await fsp.readdir(dir, { withFileTypes: true });
    return items
      .filter(d => d.isFile())
      .map(d => d.name)
      .filter(n => allowed.has(path.extname(n).toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

async function readJsonIfExists(file) {
  try {
    const buf = await fsp.readFile(file, "utf8");
    return JSON.parse(buf);
  } catch {
    return null;
  }
}

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

async function main() {
  console.log("🔧 Generating site-data from /public/audio and /public/video...");

  await ensureDir(SITE_DATA);

  // AUDIO
  const audioFiles = await listMedia(AUDIO_DIR, AUDIO_EXTS);
  const audio = audioFiles.map(file => {
    const base = path.parse(file).name;
    return {
      title: toTitle(base),
      src: `/audio/${file}`
      // add artist/duration/cover later if you want
    };
  });

  // VIDEOS (local files only; we preserve existing embed entries)
  const videoFiles = await listMedia(VIDEO_DIR, VIDEO_EXTS);
  const localVideos = videoFiles.map(file => {
    const base = path.parse(file).name;
    return {
      title: toTitle(base),
      src: `/video/${file}`
      // poster/captions can be added manually later
    };
  });

  // Preserve existing embedUrl entries in videos.json, if any
  const existingVideos = (await readJsonIfExists(VIDEOS_JSON)) || [];
  const embeds = existingVideos.filter(v => v && v.embedUrl);

  // De-dupe local srcs if videos.json already had some
  const existingLocalSrcs = new Set(
    existingVideos.filter(v => v && v.src).map(v => v.src)
  );
  const newLocal = localVideos.filter(v => !existingLocalSrcs.has(v.src));

  const videos = [...embeds, ...existingVideos.filter(v => v && v.src), ...newLocal];

  // WRITE
  await fsp.writeFile(AUDIO_JSON, JSON.stringify(audio, null, 2) + "\n");
  await fsp.writeFile(VIDEOS_JSON, JSON.stringify(videos, null, 2) + "\n");

  console.log(`✅ Wrote ${AUDIO_JSON} (${audio.length} items)`);
  console.log(`✅ Wrote ${VIDEOS_JSON} (${videos.length} items)`);
}

main().catch(err => {
  console.error("❌ generateMedia failed:", err);
  process.exit(1);
});
