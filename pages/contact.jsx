import Link from 'next/link'
import styles from '../styles/Contact.module.css'

const HERO = '/hero-contact.jpg'

export default function Contact() {
  return (
    <div className={styles.wrap}>
      <div className={styles.hero} style={{ backgroundImage: `url(${HERO})` }}>
        <div className={styles.scrim} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Contact</h1>

        <p>We’d love to hear from you — bookings, festivals, theatres, and private events.</p>

        <p>
          Email us: <a className={styles.link} href="mailto:YOUR_EMAIL_HERE">YOUR_EMAIL_HERE</a>
        </p>

        <div className={styles.socials}>
          <a href="https://www.facebook.com/shadowsandlightmusic" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://twitter.com/joni_shadows" target="_blank" rel="noreferrer">X / Twitter</a>
          <a href="/media">Videos &amp; Audio</a>
        </div>
      </div>
    </div>
  )
}
