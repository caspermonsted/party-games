import { useState, useEffect, useRef } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import { getParty, submitVote } from '../api/party.js'
import GameOn from './GameOn.jsx'
import { CastVoteMulti } from './CastVote.jsx'
import VoteReveal from './VoteReveal.jsx'
import ImposterGuess from './ImposterGuess.jsx'
import RoundResults from './RoundResults.jsx'
import Leaderboard from './Leaderboard.jsx'
import styles from './MultiGameController.module.css'

export default function MultiGameController({
  playerName, partyCode, isHost,
  initialParty,   // { players, word, imposterIndex, starterIndex }
  onPlayAgain,
  onEndGame,
}) {
  const { t } = useLang()
  const [party, setParty] = useState(initialParty)
  const [voted, setVoted] = useState(false)
  const pollRef = useRef(null)

  const players = party.players?.map(p => p.name) || []
  const myIndex = players.indexOf(playerName)
  const isImposter = myIndex === party.imposterIndex

  useEffect(() => {
    pollRef.current = setInterval(async () => {
      const fresh = await getParty(partyCode)
      if (fresh) setParty(fresh)
    }, 2000)
    return () => clearInterval(pollRef.current)
  }, [partyCode])

  async function handleVote(voter, votedFor) {
    await submitVote(partyCode, voter, votedFor)
    setVoted(true)
  }

  async function handlePhase(phase) {
    await fetch(`/api/party/${partyCode}/phase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase }),
    })
    const fresh = await getParty(partyCode)
    if (fresh) setParty(fresh)
  }

  async function handleGuess(guess) {
    const res = await fetch(`/api/party/${partyCode}/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess }),
    })
    const data = await res.json()
    setParty(prev => ({
      ...prev,
      imposterGuess: data.guess,
      imposterGuessCorrect: data.correct,
      roundPoints: data.roundPoints,
      scores: data.scores,
      phase: 'round_over',
    }))
  }

  async function handleFinish() {
    const res = await fetch(`/api/party/${partyCode}/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setParty(prev => ({ ...prev, roundPoints: data.roundPoints, scores: data.scores, phase: 'round_over' }))
  }

  const phase = party.phase || 'gameon'
  const word = party.word
  const votes = party.votes || {}
  const scores = party.scores || {}
  const roundPoints = party.roundPoints || {}
  const imposterCaught = party.imposterCaught || false

  // ── GAME ON ──
  if (phase === 'gameon') {
    return (
      <GameOn
        players={players}
        starterIndex={party.starterIndex ?? 0}
        onStartVoting={isHost ? () => handlePhase('voting') : null}
      />
    )
  }

  // ── VOTING ──
  if (phase === 'voting') {
    if (voted) {
      return <WaitingScreen text={t.waitingVotes} count={Object.keys(votes).length} total={players.length} />
    }
    return (
      <CastVoteMulti
        playerName={playerName}
        players={players}
        onVote={handleVote}
      />
    )
  }

  // ── VOTE REVEAL ──
  if (phase === 'vote_reveal') {
    return (
      <VoteReveal
        players={players}
        votes={votes}
        imposterIndex={party.imposterIndex}
        word={word}
        onContinue={(caught) => {
          if (caught) {
            handlePhase('imposter_guessing')
          } else {
            handleFinish()
          }
        }}
        showContinue={isHost}
      />
    )
  }

  // ── IMPOSTER GUESSING ──
  if (phase === 'imposter_guessing') {
    if (isImposter) {
      return (
        <ImposterGuess
          imposterName={playerName}
          word={word}
          onResult={(correct) => handleGuess(party.word?.word || '')}
          onGuessSubmit={handleGuess}
        />
      )
    }
    return <WaitingScreen text={t.waitingImposterGuess} />
  }

  // ── ROUND OVER ──
  if (phase === 'round_over') {
    const imposterName = players[party.imposterIndex]
    return (
      <RoundResultsThenLeaderboard
        roundPoints={roundPoints}
        totalScores={scores}
        imposterName={imposterName}
        imposterCaught={imposterCaught}
        imposterGuess={party.imposterGuess}
        imposterGuessCorrect={party.imposterGuessCorrect}
        word={word}
        onPlayAgain={onPlayAgain}
        onEndGame={onEndGame}
      />
    )
  }

  return <WaitingScreen text="Loading..." />
}

function WaitingScreen({ text, count, total }) {
  return (
    <div className={styles.waiting}>
      <div className={styles.waitingDots}>
        <span /><span /><span />
      </div>
      <div className={styles.waitingText}>{text}</div>
      {count !== undefined && (
        <div className={styles.waitingCount}>{count} / {total}</div>
      )}
    </div>
  )
}

function RoundResultsThenLeaderboard({ roundPoints, totalScores, imposterName, imposterCaught, imposterGuess, imposterGuessCorrect, word, onPlayAgain, onEndGame }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  if (showLeaderboard) {
    return (
      <Leaderboard
        scores={totalScores}
        onPlayAgain={onPlayAgain}
        onEndGame={onEndGame}
      />
    )
  }

  return (
    <RoundResults
      roundPoints={roundPoints}
      totalScores={totalScores}
      imposterName={imposterName}
      imposterCaught={imposterCaught}
      onContinue={() => setShowLeaderboard(true)}
    />
  )
}
