import { useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './WordReveal.module.css'

export default function WordReveal({ players, imposterIndex, word, onDone, onBack }) {
  const { t } = useLang()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState('pass')

  const player = players[currentIndex]
  const isImposter = currentIndex === imposterIndex
  const isLast = currentIndex === players.length - 1

  function handleNext() {
    if (isLast) { onDone() }
    else { setCurrentIndex(i => i + 1); setPhase('pass') }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      {onBack && <button className={styles.backBtn} onClick={onBack}>{t.back}</button>}
      <div className={styles.content}>

        {phase === 'pass' && (
          <div className={styles.passBox}>
            <div className={styles.passEmoji}>📱</div>
            <div className={styles.passLabel}>{t.passPhone}</div>
            <div className={styles.passName}>{player}</div>
            <p className={styles.passSub}>{t.dontLook}</p>
            <button className={styles.readyBtn} onClick={() => setPhase('reveal')}>
              {t.imReady}
            </button>
          </div>
        )}

        {phase === 'reveal' && (
          <div className={styles.revealBox}>
            {isImposter ? (
              <>
                <div className={styles.imposterBadge}>🕵️</div>
                <div className={styles.imposterTitle}>{t.youAreImposter}</div>
                <div className={styles.hintBox}>
                  <div className={styles.hintLabel}>{t.yourHint}</div>
                  <div className={styles.hintWord}>{word.hint}</div>
                </div>
                <p className={styles.revealSub}>{t.blendIn}</p>
              </>
            ) : (
              <>
                <div className={styles.wordBadge}>💬</div>
                <div className={styles.wordLabel}>{t.yourWord}</div>
                <div className={styles.wordValue}>{word.word}</div>
                <p className={styles.revealSub}>{t.rememberHide}</p>
              </>
            )}
            <button className={styles.doneBtn} onClick={() => setPhase('hidden')}>
              {t.gotIt}
            </button>
          </div>
        )}

        {phase === 'hidden' && (
          <div className={styles.hiddenBox}>
            <div className={styles.hiddenEmoji}>🙈</div>
            <div className={styles.hiddenText}>{t.screenHidden}</div>
            <p className={styles.hiddenSub}>
              {isLast ? t.everyoneReady : `${t.passTo} ${players[currentIndex + 1]}`}
            </p>
            <button className={styles.nextBtn} onClick={handleNext}>
              {isLast ? t.startGameBtn : t.nextPlayer}
            </button>
          </div>
        )}

        <div className={styles.dots}>
          {players.map((_, i) => (
            <div key={i} className={`${styles.dot} ${i < currentIndex ? styles.dotDone : ''} ${i === currentIndex ? styles.dotActive : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
