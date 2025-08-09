import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Image from 'next/image'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.backdrop}/>
      <header className={styles.nav}>
        <div className={styles.brand}>Shadows & Light</div>
        <nav className={styles.links}>
          <Link href="/gigs">Gigs</Link>
          <Link href="/media">Media</Link>
          <a href="mailto:info@example.com">Contact</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <h1>
          Eclectic songs, luminous arrangements —
          <span className={styles.gradientText}>the play of shadows & light.</span>
        </h1>
        <p>A modern, accessible site for fast gig updates and rich media.</p>
        <div className={styles.ctaRow}>
          <Link className={styles.button} href="/gigs">Next shows</Link>
          <Link className={styles.buttonOutline} href="/media">Watch & listen</Link>
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
