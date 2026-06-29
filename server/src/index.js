import express from 'express'
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 3000

const __dirname = dirname(fileURLToPath(import.meta.url))
const clientDist = join(__dirname, '../../dist')

app.use(express.json())
app.get('/health', (_req, res) => res.json({ ok: true }))

// ─── Party store ─────────────────────────────────────────────
const parties = new Map()

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code
  do {
    code = Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  } while (parties.has(code))
  return code
}

// Clean up old parties every 10 min
setInterval(() => {
  const cutoff = Date.now() - 1000 * 60 * 60 // 1 hour
  for (const [code, party] of parties) {
    if (party.createdAt < cutoff) parties.delete(code)
  }
}, 1000 * 60 * 10)

// ─── API ─────────────────────────────────────────────────────

// Create party
app.post('/api/party', (req, res) => {
  const { hostName } = req.body
  if (!hostName) return res.status(400).json({ error: 'hostName required' })
  const code = generateCode()
  parties.set(code, {
    code,
    hostName,
    players: [{ name: hostName, isHost: true }],
    status: 'waiting',
    createdAt: Date.now(),
    word: null,
    imposterIndex: null,
    categories: [],
  })
  res.json({ code })
})

// Get party info
app.get('/api/party/:code', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  res.json({
    code: party.code,
    players: party.players,
    status: party.status,
    word: party.word,
    imposterIndex: party.imposterIndex,
    categories: party.categories,
    votes: party.votes || {},
  })
})

// Submit vote
app.post('/api/party/:code/vote', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  const { voterName, votedFor } = req.body
  if (!party.votes) party.votes = {}
  party.votes[voterName] = votedFor
  res.json({ votes: party.votes, totalPlayers: party.players.length })
})

// Reset votes for new round
app.post('/api/party/:code/reset', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  party.votes = {}
  party.status = 'waiting'
  party.word = null
  party.imposterIndex = null
  res.json({ ok: true })
})

// Join party
app.post('/api/party/:code/join', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  if (party.status !== 'waiting') return res.status(400).json({ error: 'Game already started' })
  const { playerName } = req.body
  if (!playerName) return res.status(400).json({ error: 'playerName required' })
  const taken = party.players.some(p => p.name.toLowerCase() === playerName.toLowerCase())
  if (taken) return res.status(400).json({ error: 'Name already taken' })
  party.players.push({ name: playerName, isHost: false })
  res.json({ code: party.code, players: party.players })
})

// Start game (host sends word + imposter)
app.post('/api/party/:code/start', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  const { word, imposterIndex, categories } = req.body
  party.status = 'playing'
  party.word = word
  party.imposterIndex = imposterIndex
  party.categories = categories
  res.json({ ok: true })
})

// Kick player
app.post('/api/party/:code/kick', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  const { playerName } = req.body
  party.players = party.players.filter(p => p.name !== playerName || p.isHost)
  res.json({ players: party.players })
})

// ─── Serve React app ─────────────────────────────────────────
if (existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')))
}

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
