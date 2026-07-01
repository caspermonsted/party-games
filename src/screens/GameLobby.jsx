import { useState, useRef } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import { useProfilePhoto } from '../hooks/useProfilePhoto.js'
import Avatar from '../components/Avatar.jsx'
import styles from './GameLobby.module.css'

const MEDALS = ['🥇', '🥈', '🥉']

function getLastPartyScores() {
  try {
    const raw = localStorage.getItem('pg_last_party_scores')
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

export default function GameLobby({ user, games, onPlay, onChangeNickname }) {
  const { t, lang, toggleLang } = useLang()
  const { photo, pickPhoto, removePhoto } = useProfilePhoto()
  const [activeTab, setActiveTab] = useState('home')
  const [showRename, setShowRename] = useState(false)
  const [showPhotoMenu, setShowPhotoMenu] = useState(false)
  const fileInputRef = useRef(null)
  const availableGames = games.filter(g => g.status === 'available')
  const readyCount = availableGames.length
  const lastParty = getLastPartyScores()

  function handleAvatarClick() {
    setShowPhotoMenu(true)
  }

  function handleFileChange(e) {
    pickPhoto(e.target.files?.[0])
    setShowPhotoMenu(false)
    e.target.value = ''
  }

  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />

      <div className={styles.content}>
        {/* Language toggle */}
        <button className={styles.langBtn} onClick={toggleLang}>
          {lang === 'en' ? '🇩🇰 DA' : '🇬🇧 EN'}
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.greeting}>{t.greeting} {user.name}</div>
            <div className={styles.headline}>{t.headline}</div>
          </div>

          {/* Avatar med edit-ring */}
          <div className={styles.avatarWrap} onClick={handleAvatarClick}>
            <Avatar photo={photo} name={user.name} size="md" />
            <div className={styles.editBadge}>✏️</div>
          </div>
        </div>

        {/* Section label */}
        <div className={styles.sectionRow}>
          <span className={styles.sectionLabel}>{t.partyGames}</span>
          <span className={styles.countPill}>{readyCount} {t.ready}</span>
        </div>

        {activeTab === 'home' && (
          <>
            {availableGames.map(game => (
              <GameCard key={game.id} game={game} onPlay={() => onPlay(game)} t={t} />
            ))}
            <div className={styles.comingSoonRow}>
              <div className={styles.comingSoonCard}>
                <div className={styles.comingSoonIcon}>+</div>
                <div className={styles.comingSoonTitle}>{t.moreSoon}</div>
                <div className={styles.comingSoonSub}>{t.moreSoonSub}</div>
              </div>
              <div className={styles.comingSoonCard}>
                <div className={styles.comingSoonIcon}>★</div>
                <div className={styles.comingSoonTitle}>{t.voteNext}</div>
                <div className={styles.comingSoonSub}>{t.voteNextSub}</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'leaderboard' && (
          <div className={styles.leaderboardTab}>
            <div className={styles.leaderboardTitle}>{t.partyLeaderboard}</div>
            {lastParty ? (
              <div className={styles.leaderboardList}>
                {Object.entries(lastParty.scores)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, pts], i) => (
                    <div key={name} className={`${styles.leaderboardRow} ${i === 0 ? styles.leaderboardRowFirst : ''}`}>
                      <div className={styles.leaderboardMedal}>{MEDALS[i] || `#${i + 1}`}</div>
                      <div className={styles.leaderboardName}>{name}</div>
                      <div className={styles.leaderboardScore}>{pts} {t.pts}</div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className={styles.noScores}>{t.noPartyScores}</div>
            )}
          </div>
        )}

        <nav className={styles.bottomNav}>
          <button className={`${styles.navItem} ${activeTab === 'home' ? styles.navActive : ''}`} onClick={() => setActiveTab('home')}>◉</button>
          <button className={`${styles.navItem} ${activeTab === 'leaderboard' ? styles.navActive : ''}`} onClick={() => setActiveTab('leaderboard')}>★</button>
          <button className={`${styles.navItem} ${activeTab === 'play' ? styles.navActive : ''}`} onClick={() => setActiveTab('play')}>▲</button>
          <button className={`${styles.navItem} ${activeTab === 'profile' ? styles.navActive : ''}`} onClick={() => setActiveTab('profile')}>◐</button>
        </nav>
      </div>

      {/* Skjult fil-input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Foto menu */}
      {showPhotoMenu && (
        <div className={styles.menuOverlay} onClick={() => setShowPhotoMenu(false)}>
          <div className={styles.menu} onClick={e => e.stopPropagation()}>
            <div className={styles.menuHeader}>
              <Avatar photo={photo} name={user.name} size="lg" />
              <div className={styles.menuName}>{user.name}</div>
            </div>

            <button className={styles.menuBtn} onClick={() => {
              fileInputRef.current.removeAttribute('capture')
              fileInputRef.current.click()
              setShowPhotoMenu(false)
            }}>
              🖼️ {t.choosePhoto}
            </button>

            <button className={styles.menuBtn} onClick={() => {
              fileInputRef.current.setAttribute('capture', 'user')
              fileInputRef.current.click()
              setShowPhotoMenu(false)
            }}>
              📷 {t.takePhoto}
            </button>

            <button className={styles.menuBtn} onClick={() => setShowRename(true)}>
              ✏️ {t.changeNickname}
            </button>

            {photo && (
              <button className={`${styles.menuBtn} ${styles.menuBtnDanger}`} onClick={() => {
                removePhoto()
                setShowPhotoMenu(false)
              }}>
                🗑️ {t.removePhoto}
              </button>
            )}

            <button className={styles.menuCancel} onClick={() => setShowPhotoMenu(false)}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {showRename && (
        <RenameModal
          current={user.name}
          t={t}
          onSave={(name) => { onChangeNickname(name); setShowRename(false); setShowPhotoMenu(false) }}
          onClose={() => setShowRename(false)}
        />
      )}
    </div>
  )
}

function RenameModal({ current, t, onSave, onClose }) {
  const [value, setValue] = useState(current)
  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSave(trimmed)
  }
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalTitle}>{t.changeNickname}</div>
        <form onSubmit={handleSubmit}>
          <input className={styles.modalInput} value={value} onChange={e => setValue(e.target.value)} maxLength={20} autoFocus />
          <button className={styles.modalBtn} type="submit" disabled={!value.trim()}>{t.save}</button>
        </form>
        <button className={styles.modalCancel} onClick={onClose}>{t.cancel}</button>
      </div>
    </div>
  )
}

function GameCard({ game, onPlay, t }) {
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
        {t.playNow}
      </button>
    </div>
  )
}
