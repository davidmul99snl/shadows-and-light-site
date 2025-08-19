import { useEffect, useMemo, useRef, useState } from "react";

export default function AudioPlayer({ tracks }) {
  const audioRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const current = useMemo(() => tracks[index], [tracks, index]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.play().catch(() => setIsPlaying(false));
    }
  }, [index, isPlaying]);

  const playPause = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setIsPlaying(true);
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const next = () => setIndex((i) => (i + 1) % tracks.length);
  const prev = () => setIndex((i) => (i - 1 + tracks.length) % tracks.length);

  return (
    <div className="grid gap-4 md:grid-cols-[auto,1fr] items-start p-4 rounded-2xl shadow-lg bg-white/70 dark:bg-zinc-900/60">
      {current?.cover ? (
        <img src={current.cover} alt="Album cover" className="w-28 h-28 object-cover rounded-xl" loading="lazy" />
      ) : null}
      <div className="space-y-3">
        <div>
          <div className="text-lg font-semibold">{current?.title}</div>
          {current?.artist ? (<div className="text-sm opacity-70">{current.artist}</div>) : null}
        </div>
        <audio ref={audioRef} src={current?.src} preload="metadata" onEnded={next} className="w-full" controls />
        <div className="flex gap-2">
          <button onClick={prev} className="px-3 py-1 rounded-xl shadow">⏮ Prev</button>
          <button onClick={playPause} className="px-3 py-1 rounded-xl shadow">{isPlaying ? "⏸ Pause" : "▶️ Play"}</button>
          <button onClick={next} className="px-3 py-1 rounded-xl shadow">⏭ Next</button>
        </div>
        <ol className="mt-2 grid gap-1">
          {tracks.map((t, i) => (
            <li key={t.src}>
              <button onClick={() => setIndex(i)} className={`w-full text-left px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${i === index ? "font-semibold" : ""}`} aria-current={i === index ? "true" : undefined}>
                {t.title} {t.duration ? <span className="opacity-60">· {t.duration}</span> : null}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
