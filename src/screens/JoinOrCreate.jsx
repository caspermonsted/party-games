import { useState } from 'react'
import styles from './JoinOrCreate.module.css'

export default function JoinOrCreate({ onBack, onCreate, onJoin }) {
  const [pressed, setPressed] = useState(null)

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>

        <div className={styles.emoji}>📲</div>
        <h1 className={styles.title}>One phone each</h1>
        <p className={styles.sub}>Create a party or join one with a code</p>

        <div className={styles.cards}>
          <button
            className={`${styles.card} ${pressed === 'create' ? styles.cardPressed : ''}`}
            onMouseDown={() => setPressed('create')}
            onMouseUp={() => { setPressed(null); onCreate() }}
            onMouseLeave={() => setPressed(null)}
            onTouchStart={() => setPressed('create')}
            onTouchEnd={() => { setPressed(null); onCreate() }}
          >
            <div className={styles.cardIcon}>🎉</div>
            <div className={styles.cardTitle}>Create a party</div>
            <div className={styles.cardDesc}>You're the host — others join with your code</div>
          </button>

          <button
            className={`${styles.card} ${pressed === 'join' ? styles.cardPressed : ''}`}
            onMouseDown={() => setPressed('join')}
            onMouseUp={() => { setPressed(null); onJoin() }}
            onMouseLeave={() => setPressed(null)}
            onTouchStart={() => setPressed('join')}
            onTouchEnd={() => { setPressed(null); onJoin() }}
          >
            <div className={styles.cardIcon}>🔑</div>
            <div className={styles.cardTitle}>Join a party</div>
            <div className={styles.cardDesc}>Enter the code from your host</div>
          </button>
        </div>
      </div>
    </div>
  )
}
