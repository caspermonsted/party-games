import { useEffect, useRef, useState } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import styles from './QrScanner.module.css'

export default function QrScanner({ onScan, onClose }) {
  const { t } = useLang()
  const scannerRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let scanner = null
    async function start() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        scanner = new Html5Qrcode('qr-scanner-container')
        scannerRef.current = scanner
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            try {
              const url = new URL(decodedText)
              const code = url.searchParams.get('join')
              if (code) { onScan(code.toUpperCase()); return }
            } catch {}
            const clean = decodedText.trim().toUpperCase()
            if (/^[A-Z0-9]{4}$/.test(clean)) onScan(clean)
          },
          () => {}
        )
        setLoading(false)
      } catch {
        setError(t.cameraError)
        setLoading(false)
      }
    }
    start()
    return () => { if (scannerRef.current) scannerRef.current.stop().catch(() => {}) }
  }, [])

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <div className={styles.title}>{t.scanTitle}</div>
        <div className={styles.sub}>{t.scanSub}</div>
        <div className={styles.scannerWrap}>
          <div id="qr-scanner-container" className={styles.scannerContainer} />
          {loading && !error && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner} />
              <span>{t.startingCamera}</span>
            </div>
          )}
          {!loading && !error && (
            <div className={styles.corners}>
              <span className={styles.cornerTL} />
              <span className={styles.cornerTR} />
              <span className={styles.cornerBL} />
              <span className={styles.cornerBR} />
            </div>
          )}
        </div>
        {error && (
          <div className={styles.error}>
            <div className={styles.errorIcon}>📷</div>
            <div>{error}</div>
          </div>
        )}
      </div>
    </div>
  )
}
