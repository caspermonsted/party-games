import styles from './MyWord.module.css'

export default function MyWord({ playerName, word, isImposter, onDone }) {
  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        <div className={styles.nameTag}>
          <span className={styles.nameInitial}>{playerName[0].toUpperCase()}</span>
          <span className={styles.nameText}>{playerName}</span>
        </div>

        {isImposter ? (
          <>
            <div className={styles.imposterIcon}>🕵️</div>
            <div className={styles.imposterTitle}>You are the{'\n'}IMPOSTER!</div>
            <div className={styles.hintBox}>
              <div className={styles.hintLabel}>Your hint</div>
              <div className={styles.hintWord}>{word.hint}</div>
            </div>
            <p className={styles.sub}>Blend in — don't get caught!</p>
          </>
        ) : (
          <>
            <div className={styles.wordIcon}>💬</div>
            <div className={styles.wordLabel}>Your word is</div>
            <div className={styles.wordValue}>{word.word}</div>
            <p className={styles.sub}>Remember it and blend in!</p>
          </>
        )}

        <button className={styles.readyBtn} onClick={onDone}>
          I'm ready 👊
        </button>
      </div>
    </div>
  )
}
