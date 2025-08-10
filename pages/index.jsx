import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Image from 'next/image' // keep if you use <Image> elsewhere on the page

const HERO = '/hero-home.jpg'

export default function Home() {
  return (
    <>
      {/* HERO (replace just this section) */}
      <section
        className={`${styles.hero} ${styles.heroWithImage}`}
        style={{ backgroundImage: `url(${HERO})` }}
      >
        <div className={styles.heroScrim}>
          <h1 className={styles.heroTitle}>
            Eclectic songs, luminous arrangements —{" "}
            <span className={styles.gradientText}>the play of shadows &amp; light.</span>
          </h1>

          <p className={styles.heroTagline}>
            A modern, accessible site for fast gig updates and rich media.
          </p>

          <div className={styles.ctaRow}>
            <Link className={styles.button} href="/gigs">Next shows</Link>
            <Link className={styles.buttonOutline} href="/media">Watch &amp; listen</Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>© {new Date().getFullYear()} Shadows & Light</div>
        <div className={styles.footerLinks}>
          <a href="#" aria-label="YouTube">YouTube</a>
          <span>·</span>
          <a href="#" aria-label="Instagram">Instagram</a>
          <span>·</span>
          <a href="#" aria-label="Press">Press</a>
        </div>
      </footer>
    </main>
  )
}
