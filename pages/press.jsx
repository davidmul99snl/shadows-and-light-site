import Link from 'next/link'
import styles from '../styles/Press.module.css'

const HERO = '/hero-press.jpg'

const QUOTES = [
  { quote: "An unquestionable highlight of this year’s Out to Lunch was the performance of Joni Mitchell’s material by Dublin based Shadows and Light. A sold out Black Box was held enthralled for over two hours...", cite: "Sean Kelly, Director of the Out to Lunch Festival, Belfast" },
  { quote: "If you are a Joni Mitchell fan, you will love Shadows and Light... great musicianship and vocals to die for!", cite: "Damien Murray – Belfast Telegraph, U105 and Belfast 89FM" },
  { quote: "Amazing. Our music highlight of the year so far. Bring them back straight away", cite: "Audience member, Culture Night Belfast" },
];

export default function Press() {
  return (
    <div className={styles.wrap}>
      <div className={styles.hero} style={{ backgroundImage: `url(${HERO})` }}>
        <div className={styles.scrim} />
      </div>

      <h1 className={styles.pageTitle}>Press</h1>

      <div className={styles.grid}>
        {QUOTES.map((q, i) => (
          <blockquote className={styles.card} key={i}>
            <p>“{q.quote}”</p>
            <footer>— {q.cite}</footer>
          </blockquote>
        ))}
      </div>

      <div className={styles.back}>
        <Link href="/">← Back to home</Link>
      </div>
    </div>
  );
}
