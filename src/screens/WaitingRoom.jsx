import { useState, useEffect, useRef } from 'react'
import { getParty, kickPlayer } from '../api/party.js'
import styles from './WaitingRoom.module.css'

export default function WaitingRoom({ playerName, code, isHost, onGameStart, onBack }) {
  const [players, setPlayers] = useState([])
  const [status, setStatus] = useState('waiting')
  const pollRef = useRef(null)

  useEffect(() => {
    async function poll() {
      const party = await getParty(code)
      if (!party) return
      setPlayers(party.players)
      setStatus(party.status)
      if (party.status === 'playing') {
        clearInterval(pollRef.current)
        onGameStart({
          players: party.players,
          word: party.word,
          imposterIndex: party.imposterIndex,
        })
      }
    }

    poll()
    pollRef.current = setInterval(poll, 2000)
    return () => clearInterval(pollRef.current)
  }, [code])

  async function handleKick(name) {
    const result = await kickPlayer(code, name)
    if (result.players) setPlayers(result.players)
  }

  const canStart = players.length >= 3

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        {/* Party code */}
        <div className={styles.codeBox}>
          <div className={styles.codeLabel}>Party code</div>
          <div className={styles.codeValue}>{code}</div>
          <div className={styles.codeSub}>Share this with your friends</div>
        </div>

        {/* Player list */}
        <div className={styles.playerSection}>
          <div className={styles.playerHeader}>
            {players.length} player{players.length !== 1 ? 's' : ''} joined
          </div>
          <div className={styles.playerList}>
            {players.map((p, i) => (
              <div key={i} className={styles.playerRow}>
                <div className={styles.playerAvatar}>{p.name[0].toUpperCase()}</div>
                <div className={styles.playerName}>
                  {p.name}
                  {p.isHost && <span className={styles.hostBadge}>Host</span>}
                  {p.name === playerName && !p.isHost && <span className={styles.youBadge}>You</span>}
                </div>
                {isHost && !p.isHost && (
                  <button className={styles.kickBtn} onClick={() => handleKick(p.name)}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        {isHost ? (
          <>
            {!canStart && (
              <p className={styles.hint}>
                Need {3 - players.length} more player{3 - players.length !== 1 ? 's' : ''} to start
              </p>
            )}
            <button
              className={styles.startBtn}
              disabled={!canStart}
              onClick={() => onGameStart({ fromHost: true, players })}
            >
              Start game 🎉
            </button>
          </>
        ) : (
          <div className={styles.waitingMsg}>
            <div className={styles.waitingDots}>
              <span /><span /><span />
            </div>
            Waiting for host to start...
          </div>
        )}

        <button className={styles.leaveBtn} onClick={onBack}>Leave party</button>
      </div>
    </div>
  )
}
