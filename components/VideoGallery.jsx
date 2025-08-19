export default function VideoGallery({ videos }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {videos.map((v) => {
        const key = v.src || v.embedUrl || v.title;
        return (
          <figure key={key} className="space-y-2">
            {v.src ? (
              <video
                src={v.src}
                poster={v.poster}
                preload="metadata"
                controls
                playsInline
                className="w-full rounded-2xl shadow-lg"
              >
                {v.captions ? (
                  <track
                    src={v.captions}
                    kind="captions"
                    srcLang="en"
                    label="English"
                    default
                  />
                ) : null}
              </video>
            ) : v.embedUrl ? (
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={v.embedUrl}
                  title={v.title || "Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full rounded-2xl shadow-lg"
                />
              </div>
            ) : null}
            <figcaption className="text-sm opacity-80">{v.title}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
