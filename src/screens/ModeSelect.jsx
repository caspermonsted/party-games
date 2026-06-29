import { useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './ModeSelect.module.css'

export default function ModeSelect({ game, onBack, onSelect }) {
  const { t } = useLang()
  const [pressed, setPressed] = useState(null)

  function choose(mode) { onSelect(mode) }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <div className={styles.logoBadge}>{game.icon}</div>
        <h1 className={styles.title}>{game.title}</h1>
        <p className={styles.sub}>{t.howPlaying}</p>
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
            <div className={styles.cardTitle}>{t.samePhone}</div>
            <div className={styles.cardDesc}>{t.samePhoneDesc}</div>
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
            <div className={styles.cardTitle}>{t.oneEach}</div>
            <div className={styles.cardDesc}>{t.oneEachDesc}</div>
          </button>
        </div>
      </div>
    </div>
  )
}
