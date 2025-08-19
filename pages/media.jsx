import { useEffect, useState } from "react";
import AudioPlayer from "../components/AudioPlayer";
import VideoGallery from "../components/VideoGallery";

export default function MediaPage() {
  const [tracks, setTracks] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch("/site-data/audio.json").then(r => r.json()).then(setTracks).catch(() => setTracks([]));
    fetch("/site-data/videos.json").then(r => r.json()).then(setVideos).catch(() => setVideos([]));
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* HERO / BANNER AREA — replace this block with your shared banner if you have one */}
      <section className="mb-8">
        {/* If you already have a shared Banner component, drop it in here instead */}
        {/* <Banner src="/media-hero.jpg" title="Music & Video" /> */}
        <img
          src="/media-hero.jpg"
          alt="Music & Video"
          className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg"
        />
        <h1 className="mt-4 text-3xl font-semibold">Music & Video</h1>
        <p className="opacity-80">Listen and watch — updated via JSON files.</p>
      </section>

      {tracks.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">Music</h2>
          <AudioPlayer tracks={tracks} />
        </section>
      )}

      {videos.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-3">Videos</h2>
          <VideoGallery videos={videos} />
        </section>
      )}
    </main>
  );
}
