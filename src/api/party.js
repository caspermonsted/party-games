const BASE = '/api'

export async function generateCategory(category, lang) {
  const res = await fetch(`${BASE}/generate-category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, lang }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to generate')
  return data // { words: [{word, hint}], category }
}

export async function createParty(hostName) {
  const res = await fetch(`${BASE}/party`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hostName }),
  })
  if (!res.ok) throw new Error('Failed to create party')
  return res.json() // { code }
}

export async function getParty(code) {
  const res = await fetch(`${BASE}/party/${code}`)
  if (!res.ok) return null
  return res.json()
}

export async function joinParty(code, playerName) {
  const res = await fetch(`${BASE}/party/${code}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to join')
  return data // { code, players }
}

export async function startParty(code, word, imposterIndex, categories, starterIndex) {
  await fetch(`${BASE}/party/${code}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, imposterIndex, categories, starterIndex }),
  })
}

export async function submitVote(code, voterName, votedFor) {
  const res = await fetch(`${BASE}/party/${code}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voterName, votedFor }),
  })
  return res.json()
}

export async function resetParty(code) {
  await fetch(`${BASE}/party/${code}/reset`, { method: 'POST' })
}

export async function kickPlayer(code, playerName) {
  const res = await fetch(`${BASE}/party/${code}/kick`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName }),
  })
  return res.json()
}
