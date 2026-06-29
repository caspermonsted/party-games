import { useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './ImposterGuess.module.css'

export default function ImposterGuess({ imposterName, word, onResult }) {
  const { t } = useLang()
  const [guess, setGuess] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(false)

  function handleGuess(e) {
    e.preventDefault()
    const isCorrect = guess.trim().toLowerCase() === word.word.toLowerCase()
    setCorrect(isCorrect)
    setRevealed(true)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={styles.content}>
        <div className={styles.badge}>🕵️</div>
        <h1 className={styles.title}>{t.imposterGuessTitle}</h1>
        <div className={styles.nameTag}>{imposterName}</div>
        <p className={styles.sub}>{t.imposterGuessSub}</p>

        {!revealed ? (
          <form onSubmit={handleGuess} className={styles.form}>
            <input
              className={styles.input}
              type="text"
              placeholder={t.imposterGuessPlaceholder}
              value={guess}
              onChange={e => setGuess(e.target.value)}
              autoFocus
              maxLength={30}
            />
            <button className={styles.guessBtn} type="submit" disabled={!guess.trim()}>
              {t.imposterGuessBtn}
            </button>
          </form>
        ) : (
          <div className={styles.resultBox}>
            <div className={styles.resultIcon}>{correct ? '🎉' : '❌'}</div>
            <div className={styles.resultText}>
              {correct ? t.imposterCorrect : t.imposterWrong}
            </div>
            <div className={styles.wordReveal}>
              {t.theWordWas} <strong>{word.word}</strong>
            </div>
            {correct && <div className={styles.bonusNote}>{t.imposterBonusPoint}</div>}
            <button className={styles.continueBtn} onClick={() => onResult(correct)}>
              {t.seeResults}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
