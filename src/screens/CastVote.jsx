import { useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import Avatar from '../components/Avatar.jsx'
import styles from './CastVote.module.css'

// Same-phone: én spiller ad gangen
export function CastVoteSamePhone({ players, currentVoterIndex, onVote }) {
  const { t } = useLang()
  const [phase, setPhase] = useState('pass') // pass | vote
  const [selected, setSelected] = useState(null)
  const voter = players[currentVoterIndex]
  const others = players.filter((_, i) => i !== currentVoterIndex)

  function handleConfirm() {
    if (!selected) return
    onVote(voter, selected)
    setPhase('pass')
    setSelected(null)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={styles.content}>
        {phase === 'pass' ? (
          <div className={styles.passBox}>
            <div className={styles.passEmoji}>📱</div>
            <div className={styles.passLabel}>{t.passPhone}</div>
            <div className={styles.passName}>{voter}</div>
            <p className={styles.passSub}>{t.dontLook}</p>
            <button className={styles.readyBtn} onClick={() => setPhase('vote')}>
              {t.imReady}
            </button>
          </div>
        ) : (
          <>
            <div className={styles.voteTitle}>{t.voteTitle}</div>
            <div className={styles.voteSub}>{t.voteSub}</div>
            <div className={styles.playerGrid}>
              {others.map(name => (
                <button
                  key={name}
                  className={`${styles.playerBtn} ${selected === name ? styles.playerBtnSelected : ''}`}
                  onClick={() => setSelected(name)}
                >
                  <div className={styles.playerInitial}>{name[0].toUpperCase()}</div>
                  <div className={styles.playerName}>{name}</div>
                  {selected === name && <div className={styles.checkmark}>✓</div>}
                </button>
              ))}
            </div>
            <button className={styles.confirmBtn} disabled={!selected} onClick={handleConfirm}>
              {t.confirmVote}
            </button>
          </>
        )}

        <div className={styles.progress}>
          {t.votingProgress(currentVoterIndex + 1, players.length)}
        </div>
      </div>
    </div>
  )
}

// Multi-phone: spilleren stemmer selv
export function CastVoteMulti({ playerName, players, onVote, photoMap = {} }) {
  const { t } = useLang()
  const [selected, setSelected] = useState(null)
  const others = players.filter(p => p !== playerName)

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={styles.content}>
        <div className={styles.voteTitle}>{t.voteTitle}</div>
        <div className={styles.voteSub}>{t.voteSub}</div>
        <div className={styles.playerGrid}>
          {others.map(name => (
            <button
              key={name}
              className={`${styles.playerBtn} ${selected === name ? styles.playerBtnSelected : ''}`}
              onClick={() => setSelected(name)}
            >
              <Avatar photo={photoMap[name] || null} name={name} size="md" />
              <div className={styles.playerName}>{name}</div>
              {selected === name && <div className={styles.checkmark}>✓</div>}
            </button>
          ))}
        </div>
        <button className={styles.confirmBtn} disabled={!selected} onClick={() => onVote(playerName, selected)}>
          {t.confirmVote}
        </button>
      </div>
    </div>
  )
}
