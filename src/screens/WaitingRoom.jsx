import { useState } from 'react'
import styles from './WaitingRoom.module.css'

export default function WaitingRoom({ playerName, code, initialPlayers, send, isHost, onGameStart, onDisbanded }) {
  const [players, setPlayers] = useState(initialPlayers)

  // Updates come from App.jsx via partyPlayers state
  // We sync when initialPlayers changes
  useState(() => { setPlayers(initialPlayers) }, [initialPlayers])

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        <div className={styles.codeBox}>
          <div className={styles.codeLabel}>Party code</div>
          <div className={styles.codeValue}>{code}</div>
          <div className={styles.codeSub}>Share this with your friends</div>
        </div>

        <div className={styles.playerSection}>
          <div className={styles.playerHeader}>
            {initialPlayers.length} player{initialPlayers.length !== 1 ? 's' : ''} in the party
          </div>
          <div className={styles.playerList}>
            {initialPlayers.map((p, i) => (
              <div key={i} className={styles.playerRow}>
                <div className={styles.playerAvatar}>{p.name[0].toUpperCase()}</div>
                <div className={styles.playerName}>
                  {p.name}
                  {p.isHost && <span className={styles.hostBadge}>Host</span>}
                  {p.name === playerName && !p.isHost && <span className={styles.youBadge}>You</span>}
                </div>
                {isHost && !p.isHost && (
                  <button
                    className={styles.kickBtn}
                    onClick={() => send({ type: 'kick_player', code, name: p.name })}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <button
            className={styles.startBtn}
            disabled={initialPlayers.length < 3}
            onClick={() => onGameStart({ fromHost: true, players: initialPlayers })}
          >
            {initialPlayers.length < 3
              ? `Need ${3 - initialPlayers.length} more player${3 - initialPlayers.length !== 1 ? 's' : ''}`
              : 'Start game 🎉'}
          </button>
        ) : (
          <div className={styles.waitingMsg}>
            <div className={styles.waitingDots}>
              <span /><span /><span />
            </div>
            Waiting for host to start...
          </div>
        )}
      </div>
    </div>
  )
}
