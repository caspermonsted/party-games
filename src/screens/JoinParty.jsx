import { useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import QrScanner from './QrScanner.jsx'
import styles from './JoinParty.module.css'

export default function JoinParty({ onBack, onSubmit, error, loading, initialCode = '' }) {
  const { t } = useLang()
  const [code, setCode] = useState(initialCode)
  const [showScanner, setShowScanner] = useState(false)

  function handleInput(e) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
    setCode(val)
  }

  function handleJoin(e) {
    e.preventDefault()
    if (code.length < 4 || loading) return
    onSubmit(code)
  }

  function handleScan(scannedCode) {
    setShowScanner(false)
    setCode(scannedCode)
    setTimeout(() => onSubmit(scannedCode), 200)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>{t.back}</button>
        <div className={styles.emoji}>🔑</div>
        <h1 className={styles.title}>{t.joinTitle}</h1>
        <button className={styles.scanBtn} onClick={() => setShowScanner(true)}>
          <span className={styles.scanIcon}>📷</span>
          {t.scanQr}
        </button>
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>{t.orEnterCode}</span>
          <span className={styles.dividerLine} />
        </div>
        <form onSubmit={handleJoin} className={styles.form}>
          <input
            className={`${styles.codeInput} ${error ? styles.codeInputError : ''}`}
            type="text"
            value={code}
            onChange={handleInput}
            placeholder="ABCD"
            maxLength={4}
            autoCapitalize="characters"
          />
          {error && (
          <div className={styles.error}>
            {error === 'Party not found' ? t.errNotFound
            : error === 'Game already started' ? t.errStarted
            : error === 'Name already taken' ? t.errNameTaken
            : t.errGeneric}
          </div>
        )}
          <button className={styles.joinBtn} type="submit" disabled={code.length < 4 || loading}>
            {loading ? t.joining : t.joinBtn}
          </button>
        </form>
        <p className={styles.hint}>{t.joinHint}</p>
      </div>
      {showScanner && (
        <QrScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
      )}
    </div>
  )
}
