// scripts/generateMedia.cjs
/* Generate /public/site-data/{audio.json,videos.json} from files in
   /public/audio and /public/videos. Preserves existing embed entries
   in videos.json and merges extra fields (poster, captions, etc.).
*/

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const ROOT = process.cwd();
const PUB = path.join(ROOT, 'public');
const AUDIO_DIR = path.join(PUB, 'audio');   // ← audio
const VIDEO_DIR = path.join(PUB, 'videos');  // ← videos (plural)
const SITE_DATA = path.join(PUB, 'site-data');
const AUDIO_JSON = path.join(SITE_DATA, 'audio.json');
const VIDEOS_JSON = path.join(SITE_DATA, 'videos.json');

const AUDIO_EXTS = new Set(['.mp3', '.m4a', '.aac', '.wav', '.ogg', '.opus', '.flac']);
const VIDEO_EXTS = new Set(['.mp4', '.m4v', '.webm', '.ogv', '.ogg', '.mov']); // .mov may not stream everywhere

const EXT_MIME = {
  // audio
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.opus': 'audio/opus',
  '.flac': 'audio/flac',
  // video
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.webm': 'video/webm',
  '.ogv': 'video/ogg',
  '.mov': 'video/quicktime',
  '.ogg': 'video/ogg'
};

function toTitle(name) {
  // turn "our-favorites" -> "Our Favorites"
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
}

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

async function listRecursive(baseDir, allowed) {
  const out = [];
  async function walk(dir) {
    let entries = [];
    try {
      entries = await fsp.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const d of entries) {
      const full = path.join(dir, d.name);
      if (d.isDirectory()) {
        await walk(full);
      } else if (d.isFile()) {
        const ext = path.extname(d.name).toLowerCase();
        if (allowed.has(ext)) {
          const rel = toPosix(path.relative(baseDir, full));
          out.push(rel);
        }
      }
    }
  }
  await walk(baseDir);
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

async function readJsonIfExists(file) {
  try {
    return JSON.parse(await fsp.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

function mimeFor(ext, fallback) {
  return EXT_MIME[ext] || fallback;
}

function mergeExtras(existing, fresh) {
  // Merge "extras" from an existing item into fresh (poster, captions, etc.)
  const keep = [
    'poster', 'captions', 'subtitles', 'thumbnail',
    'description', 'credit', 'width', 'height', 'duration'
  ];
  for (const k of keep) {
    if (existing[k] != null && fresh[k] == null) fresh[k] = existing[k];
  }
  return fresh;
}

async function main() {
  console.log('🔧 Generating site-data from /public/audio and /public/videos...');

  await ensureDir(SITE_DATA);

  // AUDIO (local files only)
  const audioFiles = await listRecursive(AUDIO_DIR, AUDIO_EXTS);
  const audioItems = audioFiles.map(rel => {
    const ext = path.extname(rel).toLowerCase();
    const base = path.parse(rel).name;
    const title = toTitle(base);
    const src = encodeURI(`/audio/${rel}`); // keep spaces via %20
    return { title, src, type: mimeFor(ext, 'audio/mpeg') };
  });

  // VIDEOS (local files + preserve embeds from existing videos.json)
  const videoFiles = await listRecursive(VIDEO_DIR, VIDEO_EXTS);
  const localVideoItems = videoFiles.map(rel => {
    const ext = path.extname(rel).toLowerCase();
    const base = path.parse(rel).name;
    const title = toTitle(base);
    const src = encodeURI(`/videos/${rel}`); // IMPORTANT: /videos/
    return { title, src, type: mimeFor(ext, 'video/mp4') };
  });

  const existingVideos = (await readJsonIfExists(VIDEOS_JSON)) || [];
  const embeds = existingVideos.filter(v => v && (v.embedUrl || v.type === 'embed' || v.kind === 'embed'));

  // Merge extras for locals that already existed
  const existingBySrc = new Map(
    existingVideos.filter(v => v && v.src).map(v => [v.src, v])
  );

  const mergedLocals = localVideoItems.map(v => {
    const prev = existingBySrc.get(v.src);
    return prev ? mergeExtras(prev, v) : v;
  });

  // Final list: embeds first (preserved order), then locals
  const videos = [...embeds, ...mergedLocals];

  // WRITE
  await fsp.writeFile(AUDIO_JSON, JSON.stringify(audioItems, null, 2) + '\n');
  await fsp.writeFile(VIDEOS_JSON, JSON.stringify(videos, null, 2) + '\n');

  console.log(`✅ Wrote ${AUDIO_JSON} (${audioItems.length} items)`);
  console.log(`✅ Wrote ${VIDEOS_JSON} (${videos.length} items: ${embeds.length} embed(s), ${mergedLocals.length} local)`);
}

main().catch(err => {
  console.error('❌ generateMedia failed:', err);
  process.exit(1);
});
