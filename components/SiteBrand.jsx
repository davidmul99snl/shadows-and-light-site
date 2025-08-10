import Link from 'next/link'
import styles from './SiteBrand.module.css'

export default function SiteBrand() {
  return (
    <div className={styles.brandBar}>
      <Link href="/" className={styles.brand}>Shadows & Light</Link>
    </div>
  );
}
