import { useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './NicknameScreen.module.css'

export default function NicknameScreen({ onDone }) {
  const { t } = useLang()
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onDone(trimmed)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={styles.content}>
        <div className={styles.emoji}>🎉</div>
        <h1 className={styles.title}>{t.nicknameTitle}</h1>
        <p className={styles.sub}>{t.nicknameSub}</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder={t.nicknamePlaceholder}
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <button className={styles.btn} type="submit" disabled={!name.trim()}>
            {t.nicknameBtn}
          </button>
        </form>
      </div>
    </div>
  )
}
