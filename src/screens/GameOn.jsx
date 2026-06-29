import { useEffect, useState } from 'react'
import styles from './GameOn.module.css'

export default function GameOn({ players, onDone }) {
  const [starter] = useState(() => players[Math.floor(Math.random() * players.length)])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Lille forsinkelse så animationen kicker ind
    const t1 = setTimeout(() => setVisible(true), 100)
    // Auto-gå videre efter 4 sekunder
    const t2 = setTimeout(() => onDone(), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>
        <div className={styles.badge}>🕵️</div>

        <div className={styles.gameOn}>GAME IS ON</div>
        <div className={styles.findImposter}>Find the imposter</div>

        <div className={styles.divider} />

        <div className={styles.starterLabel}>Starting player</div>
        <div className={styles.starterName}>{starter}</div>
        <div className={styles.starterSub}>Talk about the word — without saying it!</div>
      </div>

      <button className={styles.skipBtn} onClick={onDone}>
        Let's go →
      </button>
    </div>
  )
}
