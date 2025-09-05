// pages/media.jsx
import Head from "next/head";
import fs from "fs/promises";
import path from "path";

const HERO = "/hero-media.jpg";

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
        
        {/* VIDEOS */}
        {Array.isArray(videos) && videos.length > 0 && (
          <section className="mt-8 space-y-6">
            <h2 className="text-xl font-medium">Videos</h2>

            {/* Fixed-size thumbnail grid (styles in globals.css via .media-grid/.media-tile/.media-frame) */}
            <ul className="media-grid">
              {videos.map((v, idx) => (
                <li key={v.embedUrl || v.src || v.id || idx} className="flex flex-col">
                  {/* Single, fixed 16:9 tile */}
                  <div className="media-tile">
                    {v.embedUrl ? (
                      <iframe
                        className="media-frame"
                        src={v.embedUrl}
                        title={v.title || "YouTube video"}
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
                    <h3 className="text-base font-medium">{v.title ?? "Untitled"}</h3>
                    {v.description && (
                      <p className="mt-1 text-sm text-neutral-600">{v.description}</p>
                    )}
                    {v.credit && (
                      <p className="mt-1 text-xs text-neutral-500">{v.credit}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* AUDIO */}
        {Array.isArray(audios) && audios.length > 0 && (
          <section className="mt-12 space-y-6">
            <h2 className="text-xl font-medium">Audio</h2>
            <ul className="space-y-6">
              {audios.map((a, idx) => (
                <li key={a.src || a.id || idx} className="rounded-xl border border-neutral-200 p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium">{a.title ?? "Untitled"}</h3>
                      {a.duration && (
                        <span className="text-xs text-neutral-500">{a.duration}</span>
                      )}
                    </div>
                    <audio controls preload="metadata" className="w-full">
                      <source src={a.src} type={a.type ?? "audio/mpeg"} />
                      Your browser does not support the audio element.
                    </audio>
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
            <code>/public/site-data/videos.json</code> and{" "}
            <code>/public/site-data/audio.json</code>.
          </p>
        )}
      </main>
    </>
  );
}

export async function getStaticProps() {
  const videos = await readJsonFromPublic("videos.json");
  const audios = await readJsonFromPublic("audio.json");
  return { props: { videos, audios } };
}
