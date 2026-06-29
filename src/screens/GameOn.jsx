import { useEffect, useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './GameOn.module.css'

export default function GameOn({ players, onDone }) {
  const { t } = useLang()
  const [starter] = useState(() => players[Math.floor(Math.random() * players.length)])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100)
    const t2 = setTimeout(() => onDone(), 4500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
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
      </div>
      <button className={styles.skipBtn} onClick={onDone}>{t.letsGoBtn}</button>
    </div>
  )
}
