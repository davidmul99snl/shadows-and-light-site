// scripts/generateMedia.cjs
/* Generates /public/site-data/{audio.json,videos.json}
   - Locals: from /public/audio/** and /public/videos/**
   - Embeds: from /public/site-data/videos.embeds.json (optional)
   - Outputs a unified videos.json containing both local and embedded videos.

   Local item shape:
     { kind: "local", title, src, type }

   Embed (YouTube) item shape:
     { kind: "embed", provider: "youtube", title, videoId, embedUrl, thumbnail, order }
*/

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const ROOT = process.cwd();
const PUB = path.join(ROOT, 'public');
const AUDIO_DIR = path.join(PUB, 'audio');
const VIDEO_DIR = path.join(PUB, 'videos'); // IMPORTANT: plural
const SITE_DATA = path.join(PUB, 'site-data');

const AUDIO_JSON = path.join(SITE_DATA, 'audio.json');
const VIDEOS_JSON = path.join(SITE_DATA, 'videos.json');
const EMBEDS_JSON = path.join(SITE_DATA, 'videos.embeds.json'); // optional

const AUDIO_EXTS = new Set(['.mp3', '.m4a', '.aac', '.wav', '.ogg', '.opus', '.flac']);
const VIDEO_EXTS = new Set(['.mp4', '.m4v', '.webm', '.ogv', '.ogg', '.mov']);

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
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime'
};

function toTitle(name) {
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

async function listRecursive(baseDir, allowedExts) {
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
        if (allowedExts.has(ext)) {
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

function youtubeIdFromUrl(u) {
  try {
    const url = new URL(u);
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1);
    if (url.hostname.includes('youtube.com')) return url.searchParams.get('v');
  } catch {}
  return null;
}

function normalizeEmbed(e) {
  const provider = (e.provider || 'youtube').toLowerCase();
  if (provider !== 'youtube') return null; // currently only YouTube supported

  const id = e.videoId || (e.url ? youtubeIdFromUrl(e.url) : null);
  if (!id) return null;

  const title = e.title || 'YouTube Video';
  const order = e.order ?? 0;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
  const thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  // Allow extra fields (description, poster, etc.) to pass through
  const extra = { ...e };
  delete extra.videoId; delete extra.url; delete extra.provider; delete extra.title; delete extra.order;

  return {
    kind: 'embed',
    provider: 'youtube',
    title,
    videoId: id,
    embedUrl,
    thumbnail,
    order,
    ...extra
  };
}

function mergeExtras(existing, fresh) {
  // Copy selected fields from existing item into fresh if fresh lacks them
  const keep = ['poster', 'captions', 'subtitles', 'thumbnail', 'description', 'credit', 'width', 'height', 'duration'];
  for (const k of keep) {
    if (existing && existing[k] != null && fresh[k] == null) fresh[k] = existing[k];
  }
  return fresh;
}

function sortMedia(a, b) {
  const oa = a.order ?? 1000;
  const ob = b.order ?? 1000;
  if (oa !== ob) return oa - ob;
  const ta = (a.title || '').toLowerCase();
  const tb = (b.title || '').toLowerCase();
  return ta.localeCompare(tb);
}

async function main() {
  console.log('🔧 Generating site-data from /public/audio and /public/videos...');
  await ensureDir(SITE_DATA);

  // AUDIO
  const audioFiles = await listRecursive(AUDIO_DIR, AUDIO_EXTS);
  const audioItems = audioFiles.map(rel => {
    const ext = path.extname(rel).toLowerCase();
    const title = toTitle(path.parse(rel).name);
    const src = encodeURI(`/audio/${rel}`); // keep spaces encoded
    return { title, src, type: mimeFor(ext, 'audio/mpeg') };
  });

  // VIDEOS (locals)
  const videoFiles = await listRecursive(VIDEO_DIR, VIDEO_EXTS);
  const localItems = videoFiles.map(rel => {
    const ext = path.extname(rel).toLowerCase();
    const title = toTitle(path.parse(rel).name);
    const src = encodeURI(`/videos/${rel}`); // IMPORTANT: /videos/
    return { kind: 'local', title, src, type: mimeFor(ext, 'video/mp4') };
  });

  // Existing videos.json (to preserve any extras you previously hand-added)
  const existingVideos = (await readJsonIfExists(VIDEOS_JSON)) || [];
  const existingByKey = new Map(
    existingVideos.map(v => {
      // Use src for locals, embedUrl for embeds as key
      const key = v.kind === 'embed' ? v.embedUrl : v.src;
      return [key, v];
    })
  );

  // EMBEDS (optional)
  const embedsRaw = (await readJsonIfExists(EMBEDS_JSON)) || [];
  const embedItems = []
    .concat(Array.isArray(embedsRaw) ? embedsRaw : [embedsRaw])
    .map(normalizeEmbed)
    .filter(Boolean);

  // Merge extras from previous videos.json if available
  const mergedLocals = localItems.map(v => mergeExtras(existingByKey.get(v.src), v));
  const mergedEmbeds = embedItems.map(e => mergeExtras(existingByKey.get(e.embedUrl), e));

  // Final list: embeds + locals, sorted by order then title
  const videos = [...mergedEmbeds, ...mergedLocals].sort(sortMedia);

  // WRITE
  await fsp.writeFile(AUDIO_JSON, JSON.stringify(audioItems, null, 2) + '\n');
  await fsp.writeFile(VIDEOS_JSON, JSON.stringify(videos, null, 2) + '\n');

  console.log(`✅ Wrote ${AUDIO_JSON} (${audioItems.length} items)`);
  console.log(`✅ Wrote ${VIDEOS_JSON} (${videos.length} items: ${mergedEmbeds.length} embed(s), ${mergedLocals.length} local)`);
}

main().catch(err => {
  console.error('❌ generateMedia failed:', err);
  process.exit(1);
});
