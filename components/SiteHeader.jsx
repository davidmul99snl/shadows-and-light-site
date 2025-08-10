import Link from 'next/link'
import styles from './SiteHeader.module.css'

export default function SiteHeader() {
  return (
    <header className={styles.nav}>
      <div className={styles.brand}>
        <Link href="/">Shadows & Light</Link>
      </div>
      <nav className={styles.links}>
        <Link href="/gigs">Gigs</Link>
        <Link href="/media">Media</Link>
        <Link href="/about">About Us</Link>
        <Link href="/press">Press</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
