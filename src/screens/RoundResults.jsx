import { useEffect, useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './RoundResults.module.css'

export default function RoundResults({ roundPoints, totalScores, imposterName, imposterCaught, onContinue, onBack }) {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const sorted = Object.entries(roundPoints).sort((a, b) => b[1] - a[1])

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      {onBack && <button className={styles.backBtn} onClick={onBack}>{t.back}</button>}
      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>
        <div className={styles.title}>{t.roundResults}</div>
        <div className={styles.sub}>
          {imposterCaught ? t.imposterCaught : t.imposterEscaped}
        </div>

        <div className={styles.list}>
          {sorted.map(([name, pts], i) => (
            <div key={name} className={`${styles.row} ${name === imposterName ? styles.rowImposter : ''}`}>
              <div className={styles.rank}>#{i + 1}</div>
              <div className={styles.avatar}>{name[0].toUpperCase()}</div>
              <div className={styles.name}>{name}</div>
              <div className={styles.pts}>
                {pts > 0 ? `+${pts}` : pts} {t.pts}
              </div>
              <div className={styles.total}>
                {totalScores[name]} {t.ptsTotal}
              </div>
            </div>
          ))}
        </div>

        <button className={styles.btn} onClick={onContinue}>
          {t.seeLeaderboard}
        </button>
      </div>
    </div>
  )
}
