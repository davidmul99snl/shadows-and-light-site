// pages/media.jsx
import Head from "next/head";
import fs from "fs/promises";
import path from "path";

// Helper to safely read JSON from /public/site-data
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
        <meta
          name="description"
          content="Watch and Listen"
        />
      </Head>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Music &amp; Video
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Listen and watch — updated via JSON files.
        </p>

        {/* VIDEOS */}
{videos?.length > 0 && (
  <section className="mt-8 space-y-8">
    <h2 className="text-xl font-medium">Videos</h2>

    <ul className="grid gap-8 md:grid-cols-2">
      {videos.map((v, idx) => (
        <li key={v.embedUrl || v.src || v.id || idx} className="flex flex-col">
          {/* Aspect ratio wrapper to prevent stretching */}
          {/* Aspect-ratio wrapper: fixed 16:9 for ALL items */}
<div className="relative aspect-video overflow-hidden rounded-xl shadow-sm">
  {v.embedUrl ? (
    <iframe
      className="absolute inset-0 w-full h-full"
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
      className="absolute inset-0 w-full h-full object-contain bg-black"
      poster={v.poster || v.thumbnail}
    >
      <source src={v.src} type={v.type || "video/mp4"} />
    </video>
  )}
</div>

          <div className="mt-3">
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
        {audios?.length > 0 && (
          <section className="mt-12 space-y-6">
            <h2 className="text-xl font-medium">Audio</h2>
            <ul className="space-y-6">
              {audios.map((a, idx) => (
                <li
                  key={a.id ?? idx}
                  className="rounded-xl border border-neutral-200 p-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium">
                        {a.title ?? "Untitled"}
                      </h3>
                      {a.duration && (
                        <span className="text-xs text-neutral-500">
                          {a.duration}
                        </span>
                      )}
                    </div>
                    <audio controls className="w-full">
                      <source
                        src={a.src}
                        type={a.type ?? "audio/mpeg"}
                      />
                      Your browser does not support the audio element.
                    </audio>
                    {a.description && (
                      <p className="text-sm text-neutral-600">
                        {a.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Empty state */}
        {(!videos || videos.length === 0) &&
          (!audios || audios.length === 0) && (
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

  return {
    props: { videos, audios },
  };
}
