// pages/media.jsx
import Head from "next/head";
import fs from "fs/promises";
import path from "path";

// Small helpers to safely read JSON from /public/site-data
async function readJsonFromPublic(filename) {
  try {
    const filePath = path.join(process.cwd(), "public", "site-data", filename);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return []; // tolerate missing files during first runs
  }
}

export default function Media({ videos = [], audios = [] }) {
  return (
    <>
      <Head>
        <title>Music &amp; Video — Shadows &amp; Light</title>
        <meta name="description" content="Listen and watch — updated via JSON files." />
      </Head>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Music &amp; Video</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Listen and watch — updated via JSON files.
        </p>

        {/* VIDEOS */}
        {videos?.length > 0 && (
          <section className="mt-8 space-y-8">
            <h2 className="text-xl font-medium">Videos</h2>

            <ul className="grid gap-8 md:grid-cols-2">
              {videos.map((v, idx) => (
                <li key={v.id ?? idx} className="flex flex-col">
                  {/* 
                    Aspect ratio wrapper fixes stretching.
                    If you don’t use the Tailwind aspect plugin, replace the wrapper with:
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <video className="absolute inset-0 w-full h-full object-contain" ... />
                    </div>
                  */}
                  <div
                    className={
                      // Use per-item ratio when provided, else 16:9
                      v?.aspectRatio ? undefined : "aspect-video"
                    }
                    style={
                      v?.aspectRatio
                        ? { aspectRatio: v.aspectRatio } // e.g., "4 / 3" or "16 /
