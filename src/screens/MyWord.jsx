import { useLang } from '../lang/LanguageContext.jsx'
import { useProfilePhoto } from '../hooks/useProfilePhoto.js'
import Avatar from '../components/Avatar.jsx'
import styles from './MyWord.module.css'

export default function MyWord({ playerName, word, isImposter, onDone, onBack }) {
  const { t } = useLang()
  const { photo } = useProfilePhoto()
  return (
    <div className={styles.screen}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      {onBack && <button className={styles.backBtn} onClick={onBack}>{t.back}</button>}
      <div className={styles.content}>
        <div className={styles.nameTag}>
          <Avatar photo={photo} name={playerName} size="sm" />
          <span className={styles.nameText}>{playerName}</span>
        </div>
        {isImposter ? (
          <>
            <div className={styles.imposterIcon}>🕵️</div>
            <div className={styles.imposterTitle}>{t.myImposterTitle}</div>
            <div className={styles.hintBox}>
              <div className={styles.hintLabel}>{t.yourHint}</div>
              <div className={styles.hintWord}>{word.hint}</div>
            </div>
            <p className={styles.sub}>{t.myBlendIn}</p>
          </>
        ) : (
          <>
            <div className={styles.wordIcon}>💬</div>
            <div className={styles.wordLabel}>{t.myWordLabel}</div>
            <div className={styles.wordValue}>{word.word}</div>
            <p className={styles.sub}>{t.myWordSub}</p>
          </>
        )}
        <button className={styles.readyBtn} onClick={onDone}>{t.myReady}</button>
      </div>
    </div>
  )
}
