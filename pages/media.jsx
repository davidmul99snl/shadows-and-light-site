import Head from "next/head";

export default function Media({ audio = [], videos = [], photos = [] }) {
  return (
    <>
      <Head>
        <title>Music &amp; Video | Shadows &amp; Light</title>
        <meta name="description" content="Listen and watch — updated via JSON files." />
      </Head>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1>Music &amp; Video</h1>

        {/* Audio */}
        <section style={{ marginTop: "2rem" }}>
          <h2>Audio</h2>
          {audio.length === 0 ? (
            <p>No audio yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {audio.map((item, i) => {
                const src = pickSrc(item, "audio");
                const caption =
                  item?.title || item?.name || item?.filename || `Track ${i + 1}`;
                return (
                  <li key={`audio-${i}`} style={{ marginBottom: "1.25rem" }}>
                    {caption && <div style={{ marginBottom: "0.25rem" }}>{caption}</div>}
                    {src ? (
                      <audio controls src={src} style={{ width: "100%" }}>
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <em>Missing audio source</em>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Video */}
        <section style={{ marginTop: "2rem" }}>
          <h2>Video</h2>
          {videos.length === 0 ? (
            <p>No videos yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {videos.map((item, i) => {
                const src = pickSrc(item, "video");
                const title =
                  item?.title || item?.name || item?.filename || `Video ${i + 1}`;

                // Basic YouTube/Vimeo link support (embed if URL looks like it)
                const isYouTube = typeof src === "string" && /youtube\.com|youtu\.be/.test(src);
                const isVimeo = typeof src === "string" && /vimeo\.com/.test(src);

                return (
                  <li key={`video-${i}`} style={{ marginBottom: "1.5rem" }}>
                    {title && <div style={{ marginBottom: "0.25rem" }}>{title}</div>}
                    {isYouTube ? (
                      <iframe
                        title={title}
                        width="100%"
                        height="360"
                        src={toYouTubeEmbed(src)}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : isVimeo ? (
                      <iframe
                        title={title}
                        width="100%"
                        height="360"
                        src={toVimeoEmbed(src)}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                        allowFullScreen
                      />
                    ) : src ? (
                      <video controls src={src} style={{ width: "100%" }}>
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <em>Missing video source</em>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Photos */}
        <section style={{ marginTop: "2rem" }}>
          <h2>Photos</h2>
          {photos.length === 0 ? (
            <p>No photos yet.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {photos.map((item, i) => {
                const src = pickSrc(item, "images");
                const alt = item?.alt || item?.title || item?.name || `Photo ${i + 1}`;
                return src ? (
                  <figure key={`photo-${i}`} style={{ margin: 0 }}>
                    <img src={src} alt={alt} style={{ width: "100%", height: "auto" }} />
                    {(item?.title || item?.caption) && (
                      <figcaption style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
                        {item?.title || item?.caption}
                      </figcaption>
                    )}
                  </figure>
                ) : (
                  <em key={`photo-${i}`}>Missing photo source</em>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

/**
 * Build-time data: prefer media.json; fall back to audio.json/videos.json/photos.json.
 * Works with static export and public/ hosting.
 */
export async function getStaticProps() {
  const fs = require("fs");
  const path = require("path");

  const base = path.join(process.cwd(), "public", "site-data");

  const readJSON = (file) => {
    try {
      const s = fs.readFileSync(path.join(base, file), "utf-8");
      return JSON.parse(s);
    } catch {
      return null;
    }
  };

  let audio = [];
  let videos = [];
  let photos = [];

  const media = readJSON("media.json");
  if (media) {
    audio = media.audio || [];
    videos = media.videos || [];
    photos = media.photos || [];
  } else {
    audio = readJSON("audio.json") || [];
    videos = readJSON("videos.json") || [];
    photos = readJSON("photos.json") || [];
  }

  return {
    props: { audio, videos, photos },
  };
}

/* ---------------- helpers ---------------- */

function pickSrc(item, baseDir) {
  if (!item) return "";
  const cand =
    item.src ||
    item.url ||
    item.path ||
    item.file ||
    item.filename ||
    item.name ||
    "";
  if (!cand) return "";
  if (typeof cand !== "string") return "";

  // Absolute or external — return as-is
  if (cand.startsWith("/") || /^https?:\/\//i.test(cand)) return cand;

  // Otherwise assume it's a filename living under /{baseDir}
  return `/${baseDir}/${cand}`;
}

function toYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      // e.g. https://youtu.be/VIDEOID
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {}
  return url;
}

function toVimeoEmbed(url) {
  try {
    const u = new URL(url);
    const id = u.pathname.split("/").filter(Boolean).pop();
    if (id) return `https://player.vimeo.com/video/${id}`;
  } catch {}
  return url;
}
