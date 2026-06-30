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

// ─── AI kategori-generator (Pollinations AI — ingen konto nødvendig) ──────────
app.post('/api/generate-category', async (req, res) => {
  const { category, lang } = req.body
  if (!category) return res.status(400).json({ error: 'category required' })

  const isDA = lang === 'da'
  const prompt = isDA
    ? `Du laver ord til et partyspil kaldet Imposter Game. Én spiller er imposteren og får et hint-ord i stedet for det rigtige ord.\n\nLav 10 ord til kategorien: "${category}"\n\nRegler:\n- Hint = ét enkelt ord, indirekte relateret til ordet\n- Hint må ikke være selve ordet\n- Eks: ord="Pikachu" hint="Strøm", ord="Charizard" hint="Flamme"\n\nSvar KUN med JSON array:\n[{"word":"...","hint":"..."}]`
    : `Generate 10 words for the Imposter Game party game. Category: "${category}"\n\nRules:\n- Each entry has a word and a one-word hint\n- Hint must be indirectly related (not the word itself)\n- E.g.: word="Pikachu" hint="Electricity", word="Charizard" hint="Flame"\n\nReply ONLY with a JSON array:\n[{"word":"...","hint":"..."}]`

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai-large&json=true&seed=${Math.floor(Math.random() * 9999)}`
    const response = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(20000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const text = (await response.text()).trim()
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('No JSON in response')
    const words = JSON.parse(jsonMatch[0])
    if (!Array.isArray(words) || words.length === 0) throw new Error('Empty word list')
    const clean = words.filter(w => w.word && w.hint).map(w => ({ word: String(w.word).trim(), hint: String(w.hint).trim() }))
    if (clean.length === 0) throw new Error('No valid words')
    res.json({ words: clean, category })
  } catch (e) {
    console.error('[AI] generate-category error:', e.message)
    res.status(500).json({ error: 'Could not generate words. Try again.' })
  }
})

// ─── Party store ─────────────────────────────────────────────
const parties = new Map()

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code
  do {
    code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  } while (parties.has(code))
  return code
}

setInterval(() => {
  const cutoff = Date.now() - 1000 * 60 * 60
  for (const [code, party] of parties) {
    if (party.createdAt < cutoff) parties.delete(code)
  }
}, 1000 * 60 * 10)

function calcPoints(players, imposterIndex, votes, imposterGuessCorrect) {
  const imposterName = players[imposterIndex]
  const voteCounts = {}
  players.forEach(p => voteCounts[p] = 0)
  Object.values(votes).forEach(v => { if (voteCounts[v] !== undefined) voteCounts[v]++ })
  const maxVotes = Math.max(...Object.values(voteCounts))
  const top = Object.entries(voteCounts).filter(([, v]) => v === maxVotes).map(([n]) => n)
  const caught = top.length === 1 && top[0] === imposterName
  const pts = {}
  players.forEach(p => pts[p] = 0)
  if (caught) {
    Object.entries(votes).forEach(([voter, voted]) => { if (voter !== imposterName && voted === imposterName) pts[voter] += 2 })
    players.forEach(p => { if (p !== imposterName) pts[p] += 1 })
    if (imposterGuessCorrect) pts[imposterName] += 1
  } else {
    pts[imposterName] += 3
  }
  return { pts, caught }
}

// ─── API ─────────────────────────────────────────────────────

app.post('/api/party', (req, res) => {
  const { hostName } = req.body
  if (!hostName) return res.status(400).json({ error: 'hostName required' })
  const code = generateCode()
  parties.set(code, {
    code, hostName,
    players: [{ name: hostName, isHost: true }],
    status: 'waiting',
    phase: 'lobby', // lobby | gameon | voting | vote_reveal | imposter_guessing | round_over
    createdAt: Date.now(),
    word: null, imposterIndex: null, starterIndex: 0,
    categories: [], votes: {}, scores: {},
    imposterGuess: null, imposterGuessCorrect: false,
    roundPoints: {},
  })
  res.json({ code })
})

app.get('/api/party/:code', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  res.json({
    code: party.code,
    players: party.players,
    status: party.status,
    phase: party.phase,
    word: party.word,
    imposterIndex: party.imposterIndex,
    starterIndex: party.starterIndex ?? 0,
    categories: party.categories,
    votes: party.votes || {},
    scores: party.scores || {},
    roundPoints: party.roundPoints || {},
    imposterGuess: party.imposterGuess,
    imposterGuessCorrect: party.imposterGuessCorrect,
  })
})

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

app.post('/api/party/:code/start', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  const { word, imposterIndex, categories, starterIndex } = req.body
  party.status = 'playing'
  party.phase = 'gameon'
  party.word = word
  party.imposterIndex = imposterIndex
  party.categories = categories
  party.starterIndex = starterIndex ?? 0
  party.votes = {}
  party.imposterGuess = null
  party.imposterGuessCorrect = false
  party.roundPoints = {}
  // Initialiser scores for nye spillere
  party.players.forEach(p => { if (party.scores[p.name] === undefined) party.scores[p.name] = 0 })
  res.json({ ok: true })
})

// Sæt fase (host styrer: gameon → voting osv.)
app.post('/api/party/:code/phase', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  const { phase } = req.body
  party.phase = phase
  // Når alle har stemt → beregn om imposter er fanget
  if (phase === 'vote_reveal') {
    const playerNames = party.players.map(p => p.name)
    const { caught } = calcPoints(playerNames, party.imposterIndex, party.votes, false)
    party.imposterCaught = caught
  }
  res.json({ ok: true, phase })
})

// Submit stemme
app.post('/api/party/:code/vote', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  const { voterName, votedFor } = req.body
  if (!party.votes) party.votes = {}
  party.votes[voterName] = votedFor
  const allVoted = party.players.length === Object.keys(party.votes).length
  // Automatisk fase-skift når alle har stemt
  if (allVoted) {
    party.phase = 'vote_reveal'
    const playerNames = party.players.map(p => p.name)
    const { caught } = calcPoints(playerNames, party.imposterIndex, party.votes, false)
    party.imposterCaught = caught
  }
  res.json({ votes: party.votes, allVoted, phase: party.phase })
})

// Imposter gætter ordet
app.post('/api/party/:code/guess', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  const { guess } = req.body
  const correct = guess.trim().toLowerCase() === (party.word?.word || '').toLowerCase()
  party.imposterGuess = guess
  party.imposterGuessCorrect = correct
  // Beregn point
  const playerNames = party.players.map(p => p.name)
  const { pts } = calcPoints(playerNames, party.imposterIndex, party.votes, correct)
  party.roundPoints = pts
  playerNames.forEach(p => { party.scores[p] = (party.scores[p] || 0) + (pts[p] || 0) })
  party.phase = 'round_over'
  res.json({ correct, guess, roundPoints: pts, scores: party.scores })
})

// Ingen gæt (imposter ikke fanget) → beregn point og afslut runde
app.post('/api/party/:code/finish', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  const playerNames = party.players.map(p => p.name)
  const { pts } = calcPoints(playerNames, party.imposterIndex, party.votes, false)
  party.roundPoints = pts
  playerNames.forEach(p => { party.scores[p] = (party.scores[p] || 0) + (pts[p] || 0) })
  party.phase = 'round_over'
  res.json({ roundPoints: pts, scores: party.scores })
})

// Reset til ny runde
app.post('/api/party/:code/reset', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  party.votes = {}
  party.status = 'waiting'
  party.phase = 'lobby'
  party.word = null
  party.imposterIndex = null
  party.imposterGuess = null
  party.imposterGuessCorrect = false
  party.roundPoints = {}
  res.json({ ok: true })
})

app.post('/api/party/:code/kick', (req, res) => {
  const party = parties.get(req.params.code.toUpperCase())
  if (!party) return res.status(404).json({ error: 'Party not found' })
  const { playerName } = req.body
  party.players = party.players.filter(p => p.name !== playerName || p.isHost)
  res.json({ players: party.players })
})

if (existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')))
}

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
