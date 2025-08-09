import { useMemo, useState } from 'react'
import Link from 'next/link'
import styles from '../styles/Gigs.module.css'
import gigs from '../site-data/gigs.json'

function formatDate(dtStr, timeStr) {
  const dt = new Date(`${dtStr}T${timeStr || '00:00'}`)
  const date = dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  const time = dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  return { date, time }
}

export default function Gigs() {
  const [query, setQuery] = useState('')
  const filtered = gigs.filter(g => `${g.venue} ${g.city} ${g.country}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href="/">← Home</Link>
        <h1>Upcoming gigs</h1>
        <input
          className={styles.search}
          placeholder="Filter by city or venue…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </header>

      <div className={styles.grid}>
        {filtered.map(g => {
          const { date, time } = formatDate(g.date, g.time)
          return (
            <div key={g.id} className={styles.card}>
              <div className={styles.row}>
                <div className={styles.venue}>{g.venue}</div>
                <div className={styles.price}>{g.price}</div>
              </div>
              <div className={styles.meta}>
                <span>{date} • {time}</span>
                <span>{g.city}, {g.country}</span>
              </div>
              <div className={styles.actions}>
                {g.tickets && <a className={styles.button} href={g.tickets}>Tickets</a>}
                {g.eventUrl && <a className={styles.buttonOutline} href={g.eventUrl}>Event</a>}
              </div>
            </div>
          )
        })}
      </div>
      <p className={styles.hint}>Edit <code>site-data/gigs.json</code> to add or update gigs quickly. (We’ll swap this for a CMS later.)</p>
    </div>
  )
}
