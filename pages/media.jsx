// pages/media.jsx
import React from "react";
import Head from "next/head";
import fs from "fs/promises";
import path from "path";

const HERO = "/hero-media.jpg";

/** Ensure only one audio element plays at a time across the page */
let ACTIVE_AUDIO_EL = null;

// Read JSON from /public/site-data at build time
async function readJsonFromPublic(filename) {
  try {
    const filePath = path.join(process.cwd(), "public", "site-data", filename);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return []; // tolerate missing files
  }
}

/**
 * Make YouTube embeds robust:
 * - Accepts embed URLs, watch URLs, youtu.be URLs, shorts URLs
 * - Converts to youtube-nocookie.com embed (more likely to work with privacy protections)
 */
function normalizeYouTubeEmbedUrl(input) {
  if (!input || typeof input !== "string") return null;

  let url;
  try {
    url = new URL(input);
  } catch {
    // If it's not a URL, just return null (we'll fall back to local <video>)
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  let id = null;

  // Standard embed: youtube.com/embed/VIDEOID
  if (
    (host === "youtube.com" || host === "m.youtube.com") &&
    url.pathname.startsWith("/embed/")
  ) {
    id = url.pathname.split("/embed/")[1]?.split(/[?&#/]/)[0] ?? null;
  }

  // Watch: youtube.com/watch?v=VIDEOID
  if (
    !id &&
    (host === "youtube.com" || host === "m.youtube.com") &&
    url.pathname === "/watch"
  ) {
    id = url.searchParams.get("v");
  }

  // Short links: youtu.be/VIDEOID
  if (!id && host === "youtu.be") {
    id = url.pathname.replace("/", "").split(/[?&#/]/)[0] ?? null;
  }

  // Shorts: youtube.com/shorts/VIDEOID
  if (
    !id &&
    (host === "youtube.com" || host === "m.youtube.com") &&
    url.pathname.startsWith("/shorts/")
  ) {
    id = url.pathname.split("/shorts/")[1]?.split(/[?&#/]/)[0] ?? null;
  }

  // If we can’t extract an ID, it’s not a YouTube URL we understand
  if (!id) return null;

  // Use privacy-enhanced domain
  const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`);

  // Keep a couple of safe params (optional)
  embed.searchParams.set("rel", "0");
  embed.searchParams.set("modestbranding", "1");

  return embed.toString();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Custom, brandable audio player UI:
 * - Play/Pause
 * - Slider to the right of Play button
 * - Time display at far right
 * - Ensures only one track plays at once
 */
function AudioPlayer({ src, type = "audio/mpeg" }) {
  const audioRef = React.useRef(null);
  const rafRef = React.useRef(null);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [current, setCurrent] = React.useState(0);
  const [isSeeking, setIsSeeking] = React.useState(false);

  const tick = React.useCallback(() => {
    const el = audioRef.current;
    if (!el) return;

    if (!isSeeking) setCurrent(el.currentTime || 0);
    rafRef.current = requestAnimationFrame(tick);
  }, [isSeeking]);

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onLoaded = () => setDuration(el.duration || 0);

    const onPlay = () => {
      // Pause any other audio that might be playing
      if (ACTIVE_AUDIO_EL && ACTIVE_AUDIO_EL !== el) {
        try {
          ACTIVE_AUDIO_EL.pause();
        } catch {
          // ignore
        }
      }
      ACTIVE_AUDIO_EL = el;
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
      if (ACTIVE_AUDIO_EL === el) ACTIVE_AUDIO_EL = null;
    };

    const onEnded = () => {
      setIsPlaying(false);
      if (ACTIVE_AUDIO_EL === el) ACTIVE_AUDIO_EL = null;
    };

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  React.useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
      return () => rafRef.current && cancelAnimationFrame(rafRef.current);
    }
  }, [isPlaying, tick]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;

    if (el.paused) {
      try {
        await el.play();
      } catch {
        // autoplay restrictions etc.
      }
    } else {
      el.pause();
    }
  };

  const onSeekChange = (e) => {
    const el = audioRef.current;
    if (!el) return;
    const val = Number(e.target.value);
    el.currentTime = val;
    setCurrent(val);
  };

  const progressPct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="player">
      {/* Hidden native audio element (no controls) */}
      <audio ref={audioRef} preload="metadata">
        <source src={src} type={type} />
      </audio>

      <div className="playerRow">
        <button
          type="button"
          className="playerBtn playerBtnPrimary"
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        {/* Slider to the right of the play button */}
        <div className="playerScrubInline">
          <div className="playerTrack" aria-hidden="true">
            <div className="playerFill" style={{ width: `${progressPct}%` }} />
          </div>

          <input
            className="playerRange"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(current, duration || 0)}
            onMouseDown={() => setIsSeeking(true)}
            onMouseUp={() => setIsSeeking(false)}
            onTouchStart={() => setIsSeeking(true)}
            onTouchEnd={() => setIsSeeking(false)}
            onChange={onSeekChange}
            aria-label="Seek"
          />
        </div>

        <div className="playerTime" aria-label="Time">
          <span>{formatTime(current)}</span>
          <span className="playerTimeSep">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Media({ videos = [], audios = [] }) {
  return (
    <>
      <Head>
        <title>Music &amp; Video — Shadows &amp; Light</title>
        <meta name="description" content="Watch and Listen" />
      </Head>

      {/* Hero banner */}
      <div className="mt-6">
        <img
          src={HERO}
          alt="Shadows & Light live"
          className="w-full h-auto rounded-xl shadow-sm"
        />
      </div>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Music &amp; Video</h1>
        <p className="mt-2 text-sm text-neutral-600">Live and studio recordings</p>

        {/* VIDEOS */}
        {Array.isArray(videos) && videos.length > 0 && (
          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-medium">Videos</h2>

            {/* Fixed-size thumbnail grid (styles in globals.css via .media-grid/.media-tile/.media-frame) */}
            <ul className="media-grid">
              {videos.map((v, idx) => {
                const yt = normalizeYouTubeEmbedUrl(v.embedUrl);
                const key = v.id || v.embedUrl || v.src || idx;

                return (
                  <li key={key} className="flex flex-col">
                    {/* Single, fixed 16:9 tile */}
                    <div className="media-tile">
                      {yt ? (
                        <iframe
                          className="media-frame"
                          src={yt}
                          title={v.title || "YouTube video"}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      ) : v.embedUrl ? (
                        // Non-YouTube embedUrl given but we couldn't parse it
                        <iframe
                          className="media-frame"
                          src={v.embedUrl}
                          title={v.title || "Embedded video"}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      ) : (
                        <video
                          controls
                          playsInline
                          preload="metadata"
                          className="media-frame object-contain"
                          poster={v.poster || v.thumbnail}
                        >
                          <source src={v.src} type={v.type || "video/mp4"} />
                          Sorry, your browser can’t play this video.
                        </video>
                      )}
                    </div>

                    <div className="mt-2">
                      <h3 className="text-base font-medium">
                        {v.title ?? "Untitled"}
                      </h3>
                      {v.description && (
                        <p className="mt-1 text-sm text-neutral-600">
                          {v.description}
                        </p>
                      )}
                      {v.credit && (
                        <p className="mt-1 text-xs text-neutral-500">{v.credit}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* AUDIO */}
        {Array.isArray(audios) && audios.length > 0 && (
          <section className="mt-12 space-y-6">
            <h2 className="text-xl font-medium">Audio</h2>
            <ul className="space-y-6">
              {audios.map((a, idx) => (
                <li
                  key={a.src || a.id || idx}
                  className="rounded-xl border border-neutral-200 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="audioTitle">
                        {a.title ?? "Untitled"}
                      </h3>
                      {a.duration && (
                        <span className="text-xs text-neutral-500">{a.duration}</span>
                      )}
                    </div>

                    <AudioPlayer src={a.src} type={a.type ?? "audio/mpeg"} />

                    {a.description && (
                      <p className="text-sm text-neutral-600">{a.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Empty state */}
        {(!videos || videos.length === 0) && (!audios || audios.length === 0) && (
          <p className="mt-10 text-neutral-600">
            No media found yet. Make sure your workflow generated{" "}
            <code>/public/site-data/videos.embeds.json</code> and{" "}
            <code>/public/site-data/audio.json</code>.
          </p>
        )}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const videos = await readJsonFromPublic("videos.embeds.json");
  const audios = await readJsonFromPublic("audio.json");
  return { props: { videos, audios } };
}
