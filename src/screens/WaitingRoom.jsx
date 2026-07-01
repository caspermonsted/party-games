import { useState, useEffect, useRef } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import { getParty, kickPlayer } from '../api/party.js'
import Avatar from '../components/Avatar.jsx'
import styles from './WaitingRoom.module.css'

function getJoinUrl(code) {
  return `${window.location.origin}?join=${code}`
}
function getQrUrl(code) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=1a0b2e&bgcolor=ffffff&data=${encodeURIComponent(getJoinUrl(code))}&margin=10`
}

export default function WaitingRoom({ playerName, code, isHost, onGameStart, onBack }) {
  const { t } = useLang()
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
        onGameStart({ players: party.players, word: party.word, imposterIndex: party.imposterIndex, starterIndex: party.starterIndex ?? 0 })
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
        <div className={styles.joinBox}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${!showQr ? styles.tabActive : ''}`} onClick={() => setShowQr(false)}>
              {t.pinCode}
            </button>
            <button className={`${styles.tab} ${showQr ? styles.tabActive : ''}`} onClick={() => setShowQr(true)}>
              {t.qrCode}
            </button>
          </div>
          {!showQr ? (
            <div className={styles.pinView}>
              <div className={styles.codeLabel}>{t.partyCode}</div>
              <div className={styles.codeValue}>{code}</div>
              <div className={styles.codeSub}>{t.goToApp}</div>
            </div>
          ) : (
            <div className={styles.qrView}>
              <img className={styles.qrImg} src={getQrUrl(code)} alt={code} />
              <div className={styles.codeSub}>{t.scanToJoin}</div>
            </div>
          )}
        </div>

        <div className={styles.playerSection}>
          <div className={styles.playerHeader}>{t.playersJoined(players.length)}</div>
          <div className={styles.playerList}>
            {players.map((p, i) => (
              <div key={i} className={styles.playerRow}>
                <Avatar photo={p.photo} name={p.name} size="sm" />
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

        {isHost ? (
          <>
            {!canStart && <p className={styles.hint}>{t.needMore(3 - players.length)}</p>}
            <button className={styles.startBtn} disabled={!canStart} onClick={() => onGameStart({ fromHost: true, players })}>
              {t.startGame}
            </button>
          </>
        ) : (
          <div className={styles.waitingMsg}>
            <div className={styles.waitingDots}><span /><span /><span /></div>
            {t.waitingForHost}
          </div>
        )}

        <button className={styles.leaveBtn} onClick={onBack}>{t.leaveParty}</button>
      </div>
    </div>
  )
}
