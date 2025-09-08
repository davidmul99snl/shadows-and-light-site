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
          Maura, Dave M, Paul and Dave Mc have a long musical pedigree — Dave M and Paul have played music together
          for many years in the Netherlands and Ireland, and joined forces with Maura around 2005. While recording Joni tunes, they met with Dave Mc who joined as percussionist around 2016.
          Dave M has a Degree in Jazz Performance from Newpark Music School, Paul is a full-time composer and musician, and Maura has a Masters in Music and is a full-time music teacher. Dave Mc is owner, producer and engineer at Ventry Recording studios
        </p>

        <div className={styles.photo}>
          <img src="/hero-giglive.jpg" alt="Shadows & Light performing live" />
        </div>

        <p>
          The show features songs across Joni’s huge repertoire, including classics from <em>Blue</em> and
          deeper cuts like “Hejira,” “Secret Place” and “The Hissing of Summer Lawns.”
        </p>
      </div>
    </div>
  )
}
