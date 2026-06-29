import { useEffect, useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './GameOn.module.css'

export default function GameOn({ players, onStartVoting }) {
  const { t } = useLang()
  const [starter] = useState(() => players[Math.floor(Math.random() * players.length)])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>
        <div className={styles.badge}>🕵️</div>
        <div className={styles.gameOn}>{t.gameOn}</div>
        <div className={styles.findImposter}>{t.findImposter}</div>
        <div className={styles.divider} />
        <div className={styles.starterLabel}>{t.startingPlayer}</div>
        <div className={styles.starterName}>{starter}</div>
        <div className={styles.starterSub}>{t.gameOnSub}</div>
        <button className={styles.votingBtn} onClick={onStartVoting}>
          {t.startVoting}
        </button>
      </div>
    </div>
  )
}
