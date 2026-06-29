import { useState } from 'react'
import QrScanner from './QrScanner.jsx'
import styles from './JoinParty.module.css'

export default function JoinParty({ onBack, onSubmit, error, loading, initialCode = '' }) {
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
    // Submit automatisk når QR er scannet
    setTimeout(() => onSubmit(scannedCode), 200)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>

        <div className={styles.emoji}>🔑</div>
        <h1 className={styles.title}>Join a party</h1>

        {/* QR scan knap */}
        <button className={styles.scanBtn} onClick={() => setShowScanner(true)}>
          <span className={styles.scanIcon}>📷</span>
          Scan QR code
        </button>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or enter code</span>
          <span className={styles.dividerLine} />
        </div>

        {/* PIN kode input */}
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

          {error && <div className={styles.error}>{error}</div>}

          <button
            className={styles.joinBtn}
            type="submit"
            disabled={code.length < 4 || loading}
          >
            {loading ? 'Joining...' : 'Join party 🎉'}
          </button>
        </form>

        <p className={styles.hint}>Ask your host for the QR code or party code</p>
      </div>

      {showScanner && (
        <QrScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}
