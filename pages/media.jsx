// pages/media.jsx
import itemsData from "../data/media.json"; // <-- direct import, static-export friendly

export default function Media() {
  const items = Array.isArray(itemsData) ? itemsData : [];

  return (
    <>
      <section className="hero" role="img" aria-label="Music & Video banner">
        <div className="scrim">
          <h1>Music &amp; Video</h1>
          <p>Listen and watch — updated via JSON files.</p>
        </div>
      </section>

      <main className="container">
        {items.length === 0 ? (
          <div className="empty">
            <h3>No media found</h3>
            <p>
              I looked for <code>/data/media.json</code> and it has no playable items.
              Add files under <code>/public/audio</code> or <code>/public/video</code> and list them in <code>data/media.json</code>.
            </p>
            <details>
              <summary>Quick example</summary>
              <pre>{`[
  {
    "id": "track-001",
    "type": "audio",
    "title": "Eclectic Sons (Live)",
    "src": "/audio/eclectic-sons-live.mp3",
    "description": "Recorded at Civic Theatre."
  },
  {
    "id": "vid-001",
    "type": "video",
    "title": "The Play of Shadows & Light",
    "src": "/video/play-of-shadows.mp4",
    "poster": "/video/posters/play-of-shadows.jpg",
    "mime": "video/mp4",
    "description": "Highlights from the 2024 set."
  }
]`}</pre>
            </details>
          </div>
        ) : (
          <div className="grid">
            {items.map((it) => (
              <article key={it.id} className="card">
                <h3 className="title">{it.title}</h3>
                {it.type === "audio" ? (
                  <audio controls preload="metadata" src={it.src}>
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <video controls preload="metadata" poster={it.poster || undefined}>
                    <source src={it.src} type={it.mime || "video/mp4"} />
                    Your browser does not support the video tag.
                  </video>
                )}
                {it.description && <p className="desc">{it.description}</p>}
              </article>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        .hero {
          position: relative;
          height: 38vh;
          min-height: 240px;
          background: url("/banners/media.jpg") center/cover no-repeat;
          display: grid;
          place-items: center;
        }
        .scrim {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 1rem;
          background: linear-gradient(
            to bottom,
            rgba(76, 0, 130, 0.45),
            rgba(255, 253, 240, 0.45)
          );
          backdrop-filter: saturate(120%) blur(1px);
        }
        h1 { margin: 0; font-size: clamp(1.8rem, 3vw, 3rem); }
        .container { max-width: 1100px; margin: 2rem auto 4rem; padding: 0 1rem; }
        .empty { text-align: center; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.2rem;
        }
        .card {
          border-radius: 16px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.08);
          padding: 1rem;
          background: linear-gradient(180deg, #f7f2ff 0%, #fffaf0 100%);
        }
        .title { margin: 0 0 0.5rem; font-size: 1.1rem; }
        .desc { margin-top: 0.5rem; opacity: 0.85; font-size: 0.95rem; }
        audio, video { width: 100%; border-radius: 10px; display: block; margin-top: 0.25rem; }
      `}</style>
    </>
  );
}
