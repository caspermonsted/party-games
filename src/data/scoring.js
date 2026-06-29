export function calculatePoints(players, imposterIndex, votes, imposterGuessedCorrectly) {
  const imposterName = players[imposterIndex]

  // Tæl stemmer
  const voteCounts = {}
  players.forEach(p => voteCounts[p] = 0)
  Object.values(votes).forEach(voted => {
    if (voteCounts[voted] !== undefined) voteCounts[voted]++
  })

  const maxVotes = Math.max(...Object.values(voteCounts))
  const topVoted = Object.entries(voteCounts)
    .filter(([, v]) => v === maxVotes)
    .map(([name]) => name)

  // Imposter er afsløret kun hvis de ene og alene har flest stemmer
  const imposterCaught = topVoted.length === 1 && topVoted[0] === imposterName

  const points = {}
  players.forEach(p => points[p] = 0)

  if (imposterCaught) {
    // Spillere der stemte rigtigt → +2
    Object.entries(votes).forEach(([voter, voted]) => {
      if (voter !== imposterName && voted === imposterName) {
        points[voter] += 2
      }
    })
    // Alle normale spillere → +1 bonus
    players.forEach(p => {
      if (p !== imposterName) points[p] += 1
    })
    // Imposter gættede ordet → +1
    if (imposterGuessedCorrectly) {
      points[imposterName] += 1
    }
  } else {
    // Imposter ikke afsløret → +3
    points[imposterName] += 3
  }

  return { points, imposterCaught, imposterName }
}

export function getSavedScores(players) {
  try {
    const saved = JSON.parse(localStorage.getItem('pg_scores') || '{}')
    // Sæt 0 for nye spillere
    const scores = {}
    players.forEach(p => scores[p] = saved[p] || 0)
    return scores
  } catch { return Object.fromEntries(players.map(p => [p, 0])) }
}

export function saveScores(scores) {
  try { localStorage.setItem('pg_scores', JSON.stringify(scores)) } catch {}
}

export function clearScores() {
  try { localStorage.removeItem('pg_scores') } catch {}
}
