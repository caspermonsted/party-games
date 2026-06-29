import { useEffect, useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './Leaderboard.module.css'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard({ scores, onPlayAgain, onEndGame }) {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const leader = sorted[0]?.[0]

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>

        <div className={styles.trophy}>🏆</div>
        <div className={styles.title}>{t.leaderboard}</div>
        <div className={styles.leadSub}>{t.leadingSub(leader)}</div>

        <div className={styles.list}>
          {sorted.map(([name, pts], i) => (
            <div
              key={name}
              className={`${styles.row} ${i === 0 ? styles.rowFirst : ''}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={styles.medal}>{MEDALS[i] || `#${i + 1}`}</div>
              <div className={styles.avatar}>{name[0].toUpperCase()}</div>
              <div className={styles.name}>{name}</div>
              <div className={styles.score}>{pts} {t.pts}</div>
            </div>
          ))}
        </div>

        <button className={styles.playAgainBtn} onClick={onPlayAgain}>
          {t.playAgain} 🎉
        </button>
        <button className={styles.endBtn} onClick={onEndGame}>
          {t.endGame}
        </button>
      </div>
    </div>
  )
}
