import express from 'express'
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 3000

const __dirname = dirname(fileURLToPath(import.meta.url))
const clientDist = join(__dirname, '../../dist')

app.use(express.json())
app.get('/health', (_req, res) => res.json({ ok: true }))

// ─── AI kategori-generator ────────────────────────────────────
app.post('/api/generate-category', async (req, res) => {
  const { category, lang } = req.body
  if (!category) return res.status(400).json({ error: 'category required' })
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'AI not configured' })

  const isDA = lang === 'da'

  const prompt = isDA
    ? `Du er hjælper til et partyspil kaldet Imposter Game. Spillerne får et ord fra en kategori. Én spiller er imposteren og får i stedet et enkelt hint-ord der er INDIREKTE relateret til det rigtige ord — svært nok til at det ikke er åbenlyst, men nok til at imposteren kan blende ind.

Generer 10 ord til kategorien: "${category}"

Regler for hints:
- Hintet skal være ét enkelt ord
- Hintet må IKKE være selve ordet eller et direkte synonym
- Hintet skal være noget man associerer med ordet, men som er én grad fjernet
- Eks: ord="Pizza" hint="Skærer" (ikke "Tomat" eller "Ost")

Svar KUN med et JSON-array, ingen forklaring:
[{"word":"...","hint":"..."},...]`
    : `You are a helper for a party game called Imposter Game. Players get a word from a category. One player is the imposter and gets a single hint word that is INDIRECTLY related to the real word — tricky enough not to be obvious, but enough to blend in.

Generate 10 words for the category: "${category}"

Rules for hints:
- The hint must be a single word
- The hint must NOT be the word itself or a direct synonym
- The hint should be something associated with the word, but one step removed
- E.g.: word="Pizza" hint="Cutter" (not "Tomato" or "Cheese")

Reply ONLY with a JSON array, no explanation:
[{"word":"...","hint":"..."},...]`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text.trim()
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('No JSON array in response')

    const words = JSON.parse(jsonMatch[0])
    if (!Array.isArray(words) || words.length === 0) throw new Error('Invalid word list')

    res.json({ words, category })
  } catch (e) {
    console.error('[AI] generate-category error:', e)
    res.status(500).json({ error: 'Failed to generate words. Try again.' })
  }
})

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
