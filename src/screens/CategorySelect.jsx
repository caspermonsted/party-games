import { useState } from 'react'
import styles from './CategorySelect.module.css'

const CATEGORIES = [
  { id: 'famous',    label: 'Famous people',     emoji: '⭐' },
  { id: 'food',      label: 'Food & drinks',     emoji: '🍕' },
  { id: 'animals',   label: 'Animals',           emoji: '🐾' },
  { id: 'places',    label: 'Countries & cities',emoji: '🌍' },
  { id: 'music',     label: 'Music',             emoji: '🎵' },
  { id: 'brands',    label: 'Brands',            emoji: '👟' },
  { id: 'movies',    label: 'Movies & TV',       emoji: '🎬' },
  { id: 'sports',    label: 'Sports',            emoji: '⚽' },
  { id: 'nature',    label: 'Nature',            emoji: '🌿' },
  { id: 'jobs',      label: 'Jobs',              emoji: '💼' },
]

export default function CategorySelect({ onBack, onDone }) {
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
    setSelected(new Set(CATEGORIES.map(c => c.id)))
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>

        <h1 className={styles.title}>Pick your categories</h1>
        <p className={styles.sub}>Choose at least one category</p>

        <div className={styles.grid}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.chip} ${selected.has(cat.id) ? styles.chipOn : ''}`}
              onClick={() => toggle(cat.id)}
            >
              <span className={styles.chipEmoji}>{cat.emoji}</span>
              <span className={styles.chipLabel}>{cat.label}</span>
              {selected.has(cat.id) && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>

        <button className={styles.allBtn} onClick={selectAll}>
          Select all
        </button>

        <button
          className={styles.startBtn}
          disabled={selected.size === 0}
          onClick={() => onDone([...selected])}
        >
          Start game 🎉
        </button>
      </div>
    </div>
  )
}
