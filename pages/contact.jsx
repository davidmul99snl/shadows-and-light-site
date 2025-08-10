import Link from 'next/link'
import styles from '../styles/Contact.module.css'

const HERO = 'https://shadowsandlightmusic.com/wp-content/uploads/2015/12/featureimg012.jpg?w=1600'

export default function Contact() {
  return (
    <div className={styles.wrap}>
      <div className={styles.hero} style={{ backgroundImage: `url(${HERO})`}}>
        <div className={styles.scrim}>
      </div>
{/* Content starts below the banner */}
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Contact</h1>
      
        <p>We’d love to hear from you — bookings, festivals, theatres, and private events.</p>
        <p>
          Email us: <a className={styles.link} href="mailto:shadowsandlightmusic@gmail.com">YOUR_EMAIL_HERE</a>
        </p>
        <p className={styles.muted}>
          (Replace with your real inbox. We can add a contact form later via Azure Functions.)
        </p>

        <div className={styles.socials}>
          <a href="https://www.facebook.com/shadowsandlightmusic" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://twitter.com/joni_shadows" target="_blank" rel="noreferrer">X / Twitter</a>
          <a href="/media">Videos & Audio</a>
        </div>

        <div className={styles.back}>
          <Link href="/">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
