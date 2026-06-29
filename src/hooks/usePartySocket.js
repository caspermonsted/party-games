import { useEffect, useRef, useCallback } from 'react'

function getWsUrl() {
  // I production bruger vi samme host som siden
  // I development proxy vi via Vite til Express på port 3000
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}`
}

export function usePartySocket(onMessage) {
  const wsRef = useRef(null)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    const ws = new WebSocket(getWsUrl())
    wsRef.current = ws

    ws.onopen = () => console.log('[WS] Connected')
    ws.onclose = () => console.log('[WS] Disconnected')
    ws.onerror = (e) => console.error('[WS] Error', e)

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        onMessageRef.current(msg)
      } catch {}
    }

    return () => ws.close()
  }, [])

  const send = useCallback((msg) => {
    const ws = wsRef.current
    if (!ws) return
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg))
    } else {
      // Vent til forbindelsen er klar
      ws.addEventListener('open', () => ws.send(JSON.stringify(msg)), { once: true })
    }
  }, [])

  return { send }
}
