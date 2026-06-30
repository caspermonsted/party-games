import styles from './Avatar.module.css'

// photo: base64 string eller null
// name: spillerens navn (bruges til forbogstav og alt-tekst)
// size: 'sm' | 'md' | 'lg' (default md)
// onClick: valgfri klik-handler
export default function Avatar({ photo, name, size = 'md', onClick }) {
  const initial = name ? name[0].toUpperCase() : '?'

  return (
    <div
      className={`${styles.avatar} ${styles[size]} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {photo ? (
        <img src={photo} alt={name} className={styles.photo} />
      ) : (
        <span className={styles.initial}>{initial}</span>
      )}
    </div>
  )
}
