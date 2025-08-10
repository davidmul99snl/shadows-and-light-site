import Link from 'next/link'
import styles from '../styles/About.module.css'

const HERO = '/hero-about.jpg'

export default function About() {
  return (
    <div className={styles.wrap}>
      <div className={styles.hero} style={{ backgroundImage: `url(${HERO})` }}>
        <div className={styles.scrim} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.pageTitle}>About Us</h1>

        <p>
          Maura, Dave and Paul have a long musical pedigree — Dave and Paul have been playing together
          for 25 years, while Maura has been singing with the guys as part of Shadows &amp; Light in Dublin.
          Dave has a Degree in Jazz Performance from Newpark Music School, Paul is a full-time composer,
          and Maura has a Masters in Music and is a full-time music teacher.
        </p>

        <div className={styles.photo}>
          <img src="/live.jpg" alt="Shadows & Light performing live" />
        </div>

        <p>
          The show features songs across Joni’s huge repertoire, including classics from <em>Blue</em> and
          deeper cuts like “Hejira,” “Secret Place” and “The Hissing of Summer Lawns.”
        </p>
      </div>
    </div>
  )
}
