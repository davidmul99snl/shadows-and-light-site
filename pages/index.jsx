// pages/index.jsx
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const HERO = '/hero-home.jpg'

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section
        className={`${styles.hero ?? ''} ${styles.heroWithImage ?? ''}`}
        style={{ backgroundImage: `url(${HERO})` }}
      >
        <div className={styles.heroScrim ?? ''}>
          <h1 className={styles.heroTitle ?? ''}>
            Eclectic songs, luminous arrangements —{' '}
            <span className={styles.gradientText ?? ''}>
              the play of shadows &amp; light.
            </span>
          </h1>

          <p className={styles.heroTagline ?? ''}>
            A modern, accessible site for fast gig updates and rich media.
          </p>

          <div className={styles.ctaRow ?? ''}>
            <Link className={styles.button ?? ''} href="/gigs">Next shows</Link>
            <Link className={styles.buttonOutline ?? ''} href="/media">Watch &amp; listen</Link>
          </div>
        </div>
      </section>

      {/* Simple links section (kept minimal to avoid style coupling) */}
      <section style={{ padding: '24px' }}>
        <p>
          Explore: <Link href="/about">About Us</Link> · <Link href="/press">Press</Link> ·{' '}
          <Link href="/contact">Contact</Link>
        </p>
      </section>
    </main>
  )
}
