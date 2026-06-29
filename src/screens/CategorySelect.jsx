import { useState } from 'react'
import styles from './CategorySelect.module.css'

const CATEGORIES = [
  { id: 'famous',    label: 'Berømte personer', emoji: '⭐' },
  { id: 'food',      label: 'Mad & drikke',      emoji: '🍕' },
  { id: 'animals',   label: 'Dyr',               emoji: '🐾' },
  { id: 'places',    label: 'Lande & byer',      emoji: '🌍' },
  { id: 'music',     label: 'Musik',             emoji: '🎵' },
  { id: 'brands',    label: 'Brands',            emoji: '👟' },
  { id: 'movies',    label: 'Film & serier',     emoji: '🎬' },
  { id: 'sports',    label: 'Sport',             emoji: '⚽' },
  { id: 'nature',    label: 'Natur',             emoji: '🌿' },
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
        <p className={styles.sub}>Vælg mindst én kategori</p>

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
          Vælg alle
        </button>

        <button
          className={styles.startBtn}
          disabled={selected.size === 0}
          onClick={() => onDone([...selected])}
        >
          Start spillet 🎉
        </button>
      </div>
    </div>
  )
}
