import { useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './CategorySelect.module.css'

const CATEGORY_KEYS = [
  { id: 'famous',  labelKey: 'catFamous',  emoji: '⭐' },
  { id: 'food',    labelKey: 'catFood',    emoji: '🍕' },
  { id: 'animals', labelKey: 'catAnimals', emoji: '🐾' },
  { id: 'places',  labelKey: 'catPlaces',  emoji: '🌍' },
  { id: 'music',   labelKey: 'catMusic',   emoji: '🎵' },
  { id: 'brands',  labelKey: 'catBrands',  emoji: '👟' },
  { id: 'movies',  labelKey: 'catMovies',  emoji: '🎬' },
  { id: 'sports',  labelKey: 'catSports',  emoji: '⚽' },
  { id: 'nature',  labelKey: 'catNature',  emoji: '🌿' },
  { id: 'jobs',    labelKey: 'catJobs',    emoji: '💼' },
]

export default function CategorySelect({ onBack, onDone }) {
  const { t } = useLang()
  const [selected, setSelected] = useState(new Set())

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelected(new Set(CATEGORY_KEYS.map(c => c.id)))
  }

  function removeAll() {
    setSelected(new Set())
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <h1 className={styles.title}>{t.pickCategories}</h1>
        <p className={styles.sub}>{t.chooseSub}</p>
        <div className={styles.grid}>
          {CATEGORY_KEYS.map(cat => (
            <button
              key={cat.id}
              className={`${styles.chip} ${selected.has(cat.id) ? styles.chipOn : ''}`}
              onClick={() => toggle(cat.id)}
            >
              <span className={styles.chipEmoji}>{cat.emoji}</span>
              <span className={styles.chipLabel}>{t[cat.labelKey]}</span>
              {selected.has(cat.id) && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>
        <div className={styles.allBtnRow}>
          <button className={styles.allBtn} onClick={selectAll}>{t.selectAll}</button>
          <button className={styles.removeAllBtn} onClick={removeAll}>{t.removeAll}</button>
        </div>
        <button
          className={styles.startBtn}
          disabled={selected.size === 0}
          onClick={() => onDone([...selected])}
        >
          {t.startGame}
        </button>
      </div>
    </div>
  )
}
