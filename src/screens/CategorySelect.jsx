import { useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import { generateCategory } from '../api/generateCategory.js'
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
  const { t, lang } = useLang()
  const [selected, setSelected] = useState(new Set())
  const [customInput, setCustomInput] = useState('')
  const [customCategories, setCustomCategories] = useState([]) // [{id, label, words}]
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    const all = new Set([
      ...CATEGORY_KEYS.map(c => c.id),
      ...customCategories.map(c => c.id),
    ])
    setSelected(all)
  }

  function removeAll() { setSelected(new Set()) }

  async function handleGenerate(e) {
    e.preventDefault()
    const name = customInput.trim()
    if (!name) return
    setGenerating(true)
    setGenError(null)
    try {
      const words = await generateCategory(name, lang)
      if (!words || words.length === 0) throw new Error('no words')
      const id = `custom_${Date.now()}`
      const newCat = { id, label: name, words }
      setCustomCategories(prev => [...prev, newCat])
      setSelected(prev => new Set([...prev, id]))
      setCustomInput('')
    } catch (e) {
      setGenError(t.genError)
    } finally {
      setGenerating(false)
    }
  }

  function removeCustom(id) {
    setCustomCategories(prev => prev.filter(c => c.id !== id))
    setSelected(prev => { const next = new Set(prev); next.delete(id); return next })
  }

  const hasSelection = selected.size > 0
  const totalSelected = selected.size

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>{t.back}</button>
        <h1 className={styles.title}>{t.pickCategories}</h1>
        <p className={styles.sub}>{t.chooseSub}</p>

        {/* Standard kategorier */}
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

          {/* Custom kategorier */}
          {customCategories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.chip} ${styles.chipCustom} ${selected.has(cat.id) ? styles.chipOn : ''}`}
              onClick={() => toggle(cat.id)}
            >
              <span className={styles.chipEmoji}>✨</span>
              <span className={styles.chipLabel}>{cat.label}</span>
              {selected.has(cat.id) && <span className={styles.check}>✓</span>}
              <button
                className={styles.removeCustomBtn}
                onClick={e => { e.stopPropagation(); removeCustom(cat.id) }}
              >✕</button>
            </button>
          ))}
        </div>

        {/* Select/Remove all */}
        <div className={styles.allBtnRow}>
          <button className={styles.allBtn} onClick={selectAll}>{t.selectAll}</button>
          <button className={styles.removeAllBtn} onClick={removeAll}>{t.removeAll}</button>
        </div>

        {/* Custom kategori input */}
        <div className={styles.customBox}>
          <div className={styles.customTitle}>✨ {t.customCategoryTitle}</div>
          <div className={styles.customSub}>{t.customCategorySub}</div>
          <form onSubmit={handleGenerate} className={styles.customForm}>
            <input
              className={styles.customInput}
              type="text"
              placeholder={t.customCategoryPlaceholder}
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              maxLength={40}
              disabled={generating}
            />
            <button
              className={styles.customBtn}
              type="submit"
              disabled={!customInput.trim() || generating}
            >
              {generating ? (
                <span className={styles.genSpinner} />
              ) : '✨'}
            </button>
          </form>
          {generating && (
            <div className={styles.genLoading}>{t.generatingWords}</div>
          )}
          {genError && (
            <div className={styles.genError}>{genError}</div>
          )}
        </div>

        <button
          className={styles.startBtn}
          disabled={!hasSelection}
          onClick={() => onDone(
            [...selected],
            Object.fromEntries(customCategories.map(c => [c.id, c.words]))
          )}
        >
          {t.startGame}
        </button>
      </div>
    </div>
  )
}
