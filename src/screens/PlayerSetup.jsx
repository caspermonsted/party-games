import { useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './PlayerSetup.module.css'

export default function PlayerSetup({ hostName, onBack, onDone }) {
  const { t } = useLang()
  const [players, setPlayers] = useState([hostName, ''])
  const [focusIndex, setFocusIndex] = useState(null)

  function updatePlayer(index, value) {
    setPlayers(prev => { const next = [...prev]; next[index] = value; return next })
  }

  function addPlayer() {
    setPlayers(prev => [...prev, ''])
    setTimeout(() => setFocusIndex(players.length), 50)
  }

  function removePlayer(index) {
    if (players.length <= 2) return
    setPlayers(prev => prev.filter((_, i) => i !== index))
  }

  const filledPlayers = players.filter(p => p.trim())
  const canStart = filledPlayers.length >= 3
  const needed = 3 - filledPlayers.length

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 className={styles.title}>{t.whosPlaying}</h1>
        <p className={styles.sub}>{t.addAtLeast}</p>
        <div className={styles.playerList}>
          {players.map((name, i) => (
            <div key={i} className={styles.playerRow}>
              <div className={styles.playerNumber}>{i + 1}</div>
              <input
                className={styles.playerInput}
                type="text"
                placeholder={i === 0 ? t.youHost : `${t.player} ${i + 1}`}
                value={name}
                onChange={e => updatePlayer(i, e.target.value)}
                maxLength={20}
                autoFocus={i === focusIndex}
                readOnly={i === 0}
              />
              {i > 1 && (
                <button className={styles.removeBtn} onClick={() => removePlayer(i)}>✕</button>
              )}
            </div>
          ))}
          <button className={styles.addBtn} onClick={addPlayer}>{t.addPlayer}</button>
        </div>
        <div className={styles.footer}>
          {!canStart && <p className={styles.hint}>{t.moreNeeded(needed)}</p>}
          <button className={styles.startBtn} disabled={!canStart} onClick={() => onDone(filledPlayers)}>
            {t.letsGo}
          </button>
        </div>
      </div>
    </div>
  )
}
