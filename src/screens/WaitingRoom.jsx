import { useState, useEffect, useRef } from 'react'
import { getParty, kickPlayer } from '../api/party.js'
import styles from './WaitingRoom.module.css'

function getJoinUrl(code) {
  return `${window.location.origin}?join=${code}`
}

function getQrUrl(code) {
  const joinUrl = encodeURIComponent(getJoinUrl(code))
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=1a0b2e&bgcolor=ffffff&data=${joinUrl}&margin=10`
}

export default function WaitingRoom({ playerName, code, isHost, onGameStart, onBack }) {
  const [players, setPlayers] = useState([])
  const [showQr, setShowQr] = useState(false)
  const pollRef = useRef(null)

  useEffect(() => {
    async function poll() {
      const party = await getParty(code)
      if (!party) return
      setPlayers(party.players)
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

        {/* Join methods */}
        <div className={styles.joinBox}>
          {/* Toggle tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${!showQr ? styles.tabActive : ''}`}
              onClick={() => setShowQr(false)}
            >
              📋 PIN code
            </button>
            <button
              className={`${styles.tab} ${showQr ? styles.tabActive : ''}`}
              onClick={() => setShowQr(true)}
            >
              📷 QR code
            </button>
          </div>

          {!showQr ? (
            /* PIN code view */
            <div className={styles.pinView}>
              <div className={styles.codeLabel}>Party code</div>
              <div className={styles.codeValue}>{code}</div>
              <div className={styles.codeSub}>Go to the app and enter this code</div>
            </div>
          ) : (
            /* QR code view */
            <div className={styles.qrView}>
              <img
                className={styles.qrImg}
                src={getQrUrl(code)}
                alt={`Join code: ${code}`}
              />
              <div className={styles.codeSub}>Scan to join instantly</div>
            </div>
          )}
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
