// In-memory party rooms
const parties = new Map()

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code
  do {
    code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  } while (parties.has(code))
  return code
}

export function createParty(hostName, hostWs) {
  const code = generateCode()
  const party = {
    code,
    host: hostWs,
    players: [{ name: hostName, ws: hostWs, isHost: true }],
    status: 'waiting', // 'waiting' | 'playing'
  }
  parties.set(code, party)
  return party
}

export function joinParty(code, playerName, playerWs) {
  const party = parties.get(code.toUpperCase())
  if (!party) return { error: 'Party not found' }
  if (party.status !== 'waiting') return { error: 'Game already started' }
  const namesTaken = party.players.map(p => p.name.toLowerCase())
  if (namesTaken.includes(playerName.toLowerCase())) return { error: 'Name already taken' }
  party.players.push({ name: playerName, ws: playerWs, isHost: false })
  return { party }
}

export function removePlayer(ws) {
  for (const [code, party] of parties.entries()) {
    const idx = party.players.findIndex(p => p.ws === ws)
    if (idx === -1) continue
    const wasHost = party.players[idx].isHost
    party.players.splice(idx, 1)
    if (wasHost || party.players.length === 0) {
      // Notify remaining players that party was disbanded
      broadcast(party, { type: 'party_disbanded' })
      parties.delete(code)
    } else {
      broadcast(party, { type: 'player_left', players: playerList(party) })
    }
    return
  }
}

export function getParty(code) {
  return parties.get(code?.toUpperCase())
}

export function broadcast(party, msg) {
  const data = JSON.stringify(msg)
  for (const p of party.players) {
    if (p.ws.readyState === 1) p.ws.send(data)
  }
}

export function playerList(party) {
  return party.players.map(p => ({ name: p.name, isHost: p.isHost }))
}
