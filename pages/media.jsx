import Link from 'next/link'
import styles from '../styles/Media.module.css'
import photos from '../site-data/photos.json'
import videos from '../site-data/videos.json'
import audio from '../site-data/audio.json'
import Image from 'next/image'

export default function Media() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href="/">← Home</Link>
        <h1>Media</h1>
        <p>Photos, videos, and audio — easy to add after launch.</p>
      </header>

      <h2 className={styles.subhead}>Photos</h2>
      <div className={styles.grid}>
        {photos.map(p => (
          <div key={p.id} className={styles.photoCard}>
            {/* Using img for simplicity; can swap to next/image if needed */}
            <img src={p.src} alt={p.alt} />
          </div>
        ))}
      </div>

      <h2 className={styles.subhead}>Videos</h2>
      <div className={styles.gridVideos}>
        {videos.map(v => (
          <div key={v.id} className={styles.videoCard}>
            <div className={styles.videoPlaceholder}>
              <a href={v.url} target="_blank" rel="noreferrer">Play “{v.title}”</a>
            </div>
            <div className={styles.videoMeta}>
              <div className={styles.videoTitle}>{v.title}</div>
              <div className={styles.badge}>YouTube</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className={styles.subhead}>Audio</h2>
      <div className={styles.audioList}>
        {audio.map(a => (
          <div key={a.id} className={styles.audioItem}>
            <div className={styles.audioTitle}>{a.title}</div>
            <div className={styles.audioActions}>
              <a className={styles.buttonOutline} href={a.url}>Play</a>
              <a className={styles.buttonGhost} href={a.url} download>Download</a>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
