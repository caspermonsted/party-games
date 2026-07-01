import { useState, useEffect } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import Avatar from '../components/Avatar.jsx'
import styles from './VoteReveal.module.css'

export default function VoteReveal({ players, votes, imposterIndex, word, onContinue, showContinue = true, photoMap = {} }) {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)
  const imposterName = players[imposterIndex]

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  // Tæl stemmer
  const voteCounts = {}
  players.forEach(p => voteCounts[p] = 0)
  Object.values(votes).forEach(v => { if (voteCounts[v] !== undefined) voteCounts[v]++ })
  const maxVotes = Math.max(...Object.values(voteCounts))
  const topVoted = Object.entries(voteCounts).filter(([, v]) => v === maxVotes).map(([n]) => n)
  const imposterCaught = topVoted.length === 1 && topVoted[0] === imposterName

  // Sorter spillere efter stemmer
  const sorted = [...players].sort((a, b) => voteCounts[b] - voteCounts[a])

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={`${styles.content} ${visible ? styles.visible : ''}`}>

        <div className={styles.resultBadge}>
          {imposterCaught ? '🎯' : '🕵️'}
        </div>
        <div className={styles.resultTitle}>
          {imposterCaught ? t.imposterCaught : t.imposterEscaped}
        </div>
        <div className={styles.imposterReveal}>
          <span className={styles.imposterLabel}>{t.theImposterWas}</span>
          <span className={styles.imposterName}>{imposterName}</span>
        </div>

        {/* Stemmeoversigt */}
        <div className={styles.voteList}>
          {sorted.map(name => (
            <div key={name} className={`${styles.voteRow} ${name === imposterName ? styles.voteRowImposter : ''}`}>
              <Avatar photo={photoMap[name] || null} name={name} size="sm" />
              <div className={styles.voteName}>{name}</div>
              <div className={styles.voteBar}>
                <div
                  className={styles.voteBarFill}
                  style={{ width: maxVotes > 0 ? `${(voteCounts[name] / maxVotes) * 100}%` : '0%' }}
                />
              </div>
              <div className={styles.voteCount}>
                {voteCounts[name]} {t.votes}
              </div>
            </div>
          ))}
        </div>

        {showContinue && (
          <button className={styles.continueBtn} onClick={() => onContinue(imposterCaught)}>
            {imposterCaught ? t.letImposterGuess : t.seeResults}
          </button>
        )}
      </div>
    </div>
  )
}
