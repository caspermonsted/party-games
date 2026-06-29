import { useState } from 'react'
import styles from './GameLobby.module.css'

export default function GameLobby({ user, games, onPlay }) {
  const [activeTab, setActiveTab] = useState('home')
  const availableGames = games.filter(g => g.status === 'available')
  const readyCount = availableGames.length

  return (
    <div className={styles.screen}>
      {/* Decorative blobs */}
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.greeting}>Hey {user.name}</div>
            <div className={styles.headline}>Let's play!</div>
          </div>
          <div className={styles.avatar}>{user.initial}</div>
        </div>

        {/* Section label */}
        <div className={styles.sectionRow}>
          <span className={styles.sectionLabel}>Party games</span>
          <span className={styles.countPill}>{readyCount} ready</span>
        </div>

        {/* Available game cards */}
        {availableGames.map(game => (
          <GameCard key={game.id} game={game} onPlay={() => onPlay(game)} />
        ))}

        {/* Coming soon */}
        <div className={styles.comingSoonRow}>
          <div className={styles.comingSoonCard}>
            <div className={styles.comingSoonIcon}>+</div>
            <div className={styles.comingSoonTitle}>More soon</div>
            <div className={styles.comingSoonSub}>New games on the way</div>
          </div>
          <div className={styles.comingSoonCard}>
            <div className={styles.comingSoonIcon}>★</div>
            <div className={styles.comingSoonTitle}>Vote next</div>
            <div className={styles.comingSoonSub}>Pick what we build</div>
          </div>
        </div>

        {/* Bottom nav */}
        <nav className={styles.bottomNav}>
          <button
            className={`${styles.navItem} ${activeTab === 'home' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('home')}
            aria-label="Home"
          >
            ◉
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'leaderboard' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('leaderboard')}
            aria-label="Leaderboard"
          >
            ★
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'play' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('play')}
            aria-label="Play"
          >
            ▲
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('profile')}
            aria-label="Profile"
          >
            ◐
          </button>
        </nav>
      </div>
    </div>
  )
}

function GameCard({ game, onPlay }) {
  const [pressed, setPressed] = useState(false)

  return (
    <div className={styles.gameCard}>
      <div className={styles.cardTop}>
        <div className={styles.logoBadge}>{game.icon}</div>
        <div>
          <div className={styles.gameTitle}>{game.title}</div>
          <div className={styles.gameDesc}>{game.description}</div>
        </div>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.pillPlayers}>{game.minPlayers}–{game.maxPlayers} players</span>
        <span className={styles.pillTime}>{game.durationMin} min</span>
      </div>
      <button
        className={styles.playBtn}
        style={{ transform: pressed ? 'scale(0.97)' : 'scale(1)' }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => { setPressed(false); onPlay() }}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => { setPressed(false); onPlay() }}
      >
        Play now
      </button>
    </div>
  )
}
