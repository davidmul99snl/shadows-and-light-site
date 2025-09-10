// pages/index.jsx
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const HERO = '/hero-home.jpg'

export default function Home() {
  return (
    <main>
      {/* Full-bleed banner image */}
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${HERO})` }}
        aria-hidden="true"
      />

      {/* Text BELOW the image, centered */}
      <section className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Joni's music from across the decades.{' '}
          <span className={styles.gradientText}>The play of shadows &amp; light.</span>
        </h1>

        <p className={styles.heroTagline}>
          Eclectic songs and styles, luminous arrangements
        </p>

        <div className={styles.ctaRow}>
          <Link className={styles.button} href="/gigs">Next shows</Link>
          <Link className={styles.buttonOutline} href="/media">Watch &amp; listen</Link>
        </div>
      </section>
    </main>
  )
}
