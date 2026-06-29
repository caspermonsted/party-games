import { useState } from 'react'
import styles from './ModeSelect.module.css'

export default function ModeSelect({ game, onBack, onSelect }) {
  const [pressed, setPressed] = useState(null)

  function choose(mode) {
    onSelect(mode)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>

        <div className={styles.logoBadge}>{game.icon}</div>
        <h1 className={styles.title}>{game.title}</h1>
        <p className={styles.sub}>How are you playing?</p>

        <div className={styles.cards}>
          <button
            className={`${styles.card} ${pressed === 'same' ? styles.cardPressed : ''}`}
            onMouseDown={() => setPressed('same')}
            onMouseUp={() => { setPressed(null); choose('same') }}
            onMouseLeave={() => setPressed(null)}
            onTouchStart={() => setPressed('same')}
            onTouchEnd={() => { setPressed(null); choose('same') }}
          >
            <div className={styles.cardIcon}>📱</div>
            <div className={styles.cardTitle}>Same phone</div>
            <div className={styles.cardDesc}>Everyone passes one phone around</div>
          </button>

          <button
            className={`${styles.card} ${pressed === 'multi' ? styles.cardPressed : ''}`}
            onMouseDown={() => setPressed('multi')}
            onMouseUp={() => { setPressed(null); choose('multi') }}
            onMouseLeave={() => setPressed(null)}
            onTouchStart={() => setPressed('multi')}
            onTouchEnd={() => { setPressed(null); choose('multi') }}
          >
            <div className={styles.cardIcon}>📲</div>
            <div className={styles.cardTitle}>One phone each</div>
            <div className={styles.cardDesc}>Each player joins on their own phone</div>
          </button>
        </div>
      </div>
    </div>
  )
}
