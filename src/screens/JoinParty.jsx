import { useState } from 'react'
import styles from './JoinParty.module.css'

export default function JoinParty({ onBack, onSubmit, error, loading, initialCode = '' }) {
  const [code, setCode] = useState(initialCode)

  function handleInput(e) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
    setCode(val)
  }

  function handleJoin(e) {
    e.preventDefault()
    if (code.length < 4 || loading) return
    onSubmit(code)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>

        <div className={styles.emoji}>🔑</div>
        <h1 className={styles.title}>Join a party</h1>
        <p className={styles.sub}>Enter the 4-letter code from your host</p>

        <form onSubmit={handleJoin} className={styles.form}>
          <input
            className={`${styles.codeInput} ${error ? styles.codeInputError : ''}`}
            type="text"
            value={code}
            onChange={handleInput}
            placeholder="ABCD"
            maxLength={4}
            autoFocus
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

        <p className={styles.hint}>Ask your host for the party code</p>
      </div>
    </div>
  )
}
