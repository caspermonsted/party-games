import { useState } from 'react'
import styles from './PlayerSetup.module.css'

export default function PlayerSetup({ hostName, onBack, onDone }) {
  const [players, setPlayers] = useState([hostName, ''])
  const [focusIndex, setFocusIndex] = useState(null)

  function updatePlayer(index, value) {
    setPlayers(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
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

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>

        <h1 className={styles.title}>Who's playing?</h1>
        <p className={styles.sub}>Add at least 3 players</p>

        <div className={styles.playerList}>
          {players.map((name, i) => (
            <div key={i} className={styles.playerRow}>
              <div className={styles.playerNumber}>{i + 1}</div>
              <input
                className={styles.playerInput}
                type="text"
                placeholder={i === 0 ? 'You (host)' : `Player ${i + 1}`}
                value={name}
                onChange={e => updatePlayer(i, e.target.value)}
                maxLength={20}
                autoFocus={i === focusIndex}
                readOnly={i === 0}
              />
              {i > 1 && (
                <button
                  className={styles.removeBtn}
                  onClick={() => removePlayer(i)}
                  aria-label="Remove player"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button className={styles.addBtn} onClick={addPlayer}>
            + Add player
          </button>
        </div>

        <div className={styles.footer}>
          {!canStart && (
            <p className={styles.hint}>
              {3 - filledPlayers.length} more player{3 - filledPlayers.length !== 1 ? 's' : ''} needed
            </p>
          )}
          <button
            className={styles.startBtn}
            disabled={!canStart}
            onClick={() => onDone(filledPlayers)}
          >
            Let's go! 🎉
          </button>
        </div>
      </div>
    </div>
  )
}
