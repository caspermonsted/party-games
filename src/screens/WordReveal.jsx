import { useState } from 'react'
import styles from './WordReveal.module.css'

// phase: 'pass' → 'reveal' → 'hide' → (next player)

export default function WordReveal({ players, imposterIndex, word, onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState('pass') // 'pass' | 'reveal' | 'hidden'

  const player = players[currentIndex]
  const isImposter = currentIndex === imposterIndex
  const isLast = currentIndex === players.length - 1

  function handleReady() {
    setPhase('reveal')
  }

  function handleDone() {
    setPhase('hidden')
  }

  function handleNext() {
    if (isLast) {
      onDone()
    } else {
      setCurrentIndex(i => i + 1)
      setPhase('pass')
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        {/* PASS PHASE */}
        {phase === 'pass' && (
          <div className={styles.passBox}>
            <div className={styles.passEmoji}>📱</div>
            <div className={styles.passLabel}>Pass the phone to</div>
            <div className={styles.passName}>{player}</div>
            <p className={styles.passSub}>Don't let anyone else see the screen!</p>
            <button className={styles.readyBtn} onClick={handleReady}>
              I'm ready 👀
            </button>
          </div>
        )}

        {/* REVEAL PHASE */}
        {phase === 'reveal' && (
          <div className={styles.revealBox}>
            {isImposter ? (
              <>
                <div className={styles.imposterBadge}>🕵️</div>
                <div className={styles.imposterTitle}>You are the<br />IMPOSTER!</div>
                <div className={styles.hintBox}>
                  <div className={styles.hintLabel}>Your hint</div>
                  <div className={styles.hintWord}>{word.hint}</div>
                </div>
                <p className={styles.revealSub}>Blend in — don't get caught!</p>
              </>
            ) : (
              <>
                <div className={styles.wordBadge}>💬</div>
                <div className={styles.wordLabel}>Your word is</div>
                <div className={styles.wordValue}>{word.word}</div>
                <p className={styles.revealSub}>Remember it — then hide the screen!</p>
              </>
            )}
            <button className={styles.doneBtn} onClick={handleDone}>
              Got it, hide it! 🙈
            </button>
          </div>
        )}

        {/* HIDDEN PHASE */}
        {phase === 'hidden' && (
          <div className={styles.hiddenBox}>
            <div className={styles.hiddenEmoji}>🙈</div>
            <div className={styles.hiddenText}>Screen hidden</div>
            <p className={styles.hiddenSub}>
              {isLast
                ? 'Everyone has their word. Time to play!'
                : `Pass to ${players[currentIndex + 1]}`}
            </p>
            <button className={styles.nextBtn} onClick={handleNext}>
              {isLast ? 'Start game! 🎉' : `Next player →`}
            </button>
          </div>
        )}

        {/* Progress dots */}
        <div className={styles.dots}>
          {players.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i < currentIndex ? styles.dotDone : ''} ${i === currentIndex ? styles.dotActive : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
