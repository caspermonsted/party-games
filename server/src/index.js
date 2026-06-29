import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import { createParty, joinParty, removePlayer, getParty, broadcast, playerList } from './parties.js'

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

const PORT = process.env.PORT || 3000
const __dirname = dirname(fileURLToPath(import.meta.url))
const clientDist = join(__dirname, '../../dist')

app.use(express.json())
app.get('/health', (_req, res) => res.json({ ok: true }))

if (existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')))
}

// WebSocket message handler
wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    let msg
    try { msg = JSON.parse(raw) } catch { return }

    switch (msg.type) {

      case 'create_party': {
        const party = createParty(msg.name, ws)
        ws.send(JSON.stringify({
          type: 'party_created',
          code: party.code,
          players: playerList(party),
        }))
        break
      }

      case 'join_party': {
        const result = joinParty(msg.code, msg.name, ws)
        if (result.error) {
          ws.send(JSON.stringify({ type: 'join_error', message: result.error }))
          return
        }
        const party = result.party
        // Tell the joiner they're in
        ws.send(JSON.stringify({
          type: 'party_joined',
          code: party.code,
          players: playerList(party),
        }))
        // Tell everyone else someone joined
        broadcast(party, { type: 'player_joined', players: playerList(party) })
        break
      }

      case 'start_game': {
        const party = getParty(msg.code)
        if (!party) return
        party.status = 'playing'
        broadcast(party, {
          type: 'game_started',
          players: playerList(party),
          categories: msg.categories,
          imposterIndex: msg.imposterIndex,
          word: msg.word,
        })
        break
      }

      case 'kick_player': {
        const party = getParty(msg.code)
        if (!party) return
        const idx = party.players.findIndex(p => p.name === msg.name && !p.isHost)
        if (idx === -1) return
        const kicked = party.players[idx]
        kicked.ws.send(JSON.stringify({ type: 'kicked' }))
        party.players.splice(idx, 1)
        broadcast(party, { type: 'player_left', players: playerList(party) })
        break
      }
    }
  })

  ws.on('close', () => removePlayer(ws))
})

server.listen(PORT, () => console.log(`Server kører på http://localhost:${PORT}`))
