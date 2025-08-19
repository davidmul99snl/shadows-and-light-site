import Link from 'next/link'
import styles from './SiteHeader.module.css'

export default function SiteHeader() {
  return (
    <header className={styles.nav}>
      <nav className={styles.links}>
        <Link href="/">Home</Link>
        <Link href="/gigs">Gigs</Link>
        <Link href="/media">Music</Link>
        <Link href="/about">About</Link>
        <Link href="/press">Press</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
