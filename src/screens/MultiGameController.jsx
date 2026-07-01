import { useState, useEffect, useRef } from 'react'
import { useLang } from '../lang/LanguageContext.jsx'
import { getParty, submitVote, resetParty } from '../api/party.js'
import GameOn from './GameOn.jsx'
import MyWord from './MyWord.jsx'
import { CastVoteMulti } from './CastVote.jsx'
import VoteReveal from './VoteReveal.jsx'
import ImposterGuess from './ImposterGuess.jsx'
import RoundResults from './RoundResults.jsx'
import Leaderboard from './Leaderboard.jsx'
import styles from './MultiGameController.module.css'

export default function MultiGameController({
  playerName, partyCode, isHost,
  word, imposterIndex, starterIndex,
  onPlayAgain, onEndGame,
}) {
  const { t } = useLang()
  const [party, setParty] = useState(null)
  const [voted, setVoted] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  // Track the word the player has already acknowledged so we can show MyWord
  // when a new round starts. Initialize to the word they saw before entering.
  const acknowledgedWordRef = useRef(word?.word ?? null)
  const [showInlineMyWord, setShowInlineMyWord] = useState(false)
  const pollRef = useRef(null)

  useEffect(() => {
    async function poll() {
      const fresh = await getParty(partyCode)
      if (!fresh) return
      setParty(fresh)
      // Detect new round: gameon with a word we haven't seen yet
      if (
        fresh.phase === 'gameon' &&
        fresh.word?.word &&
        fresh.word.word !== acknowledgedWordRef.current
      ) {
        setShowInlineMyWord(true)
        setVoted(false)
        setShowLeaderboard(false)
      }
    }
    poll()
    pollRef.current = setInterval(poll, 2000)
    return () => clearInterval(pollRef.current)
  }, [partyCode])

  async function setPhase(phase) {
    await fetch(`/api/party/${partyCode}/phase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase }),
    })
    const fresh = await getParty(partyCode)
    if (fresh) setParty(fresh)
  }

  async function handleVote(voter, votedFor) {
    await submitVote(partyCode, voter, votedFor)
    setVoted(true)
  }

  async function handleGuess(guess) {
    const res = await fetch(`/api/party/${partyCode}/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess }),
    })
    const data = await res.json()
    setParty(prev => ({ ...prev, ...data, phase: 'round_over' }))
  }

  async function handleFinish() {
    const res = await fetch(`/api/party/${partyCode}/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setParty(prev => ({ ...prev, ...data, phase: 'round_over' }))
  }

  async function handleHostPlayAgain() {
    await resetParty(partyCode)
    onPlayAgain()
  }

  function handleEndGame(scores) {
    try {
      localStorage.setItem('pg_last_party_scores', JSON.stringify({ scores, savedAt: Date.now() }))
    } catch {}
    onEndGame()
  }

  if (!party) return <WaitingScreen text="Loading..." />

  const players = party.players?.map(p => p.name) || []
  const photoMap = Object.fromEntries((party.players || []).map(p => [p.name, p.photo || null]))
  const myIndex = players.indexOf(playerName)
  const isImposter = myIndex === (party.imposterIndex ?? imposterIndex)
  const gameWord = party.word || word
  const votes = party.votes || {}
  const scores = party.scores || {}
  const roundPoints = party.roundPoints || {}
  const phase = party.phase || 'gameon'

  // Lobby phase = host has reset, next round is being set up
  if (phase === 'lobby') {
    return <WaitingScreen text={isHost ? t.hostSettingUp : t.waitingNextRound} />
  }

  // Show MyWord inline when a new round starts (non-host path)
  if (showInlineMyWord && gameWord) {
    return (
      <MyWord
        playerName={playerName}
        word={gameWord}
        isImposter={isImposter}
        onDone={() => {
          acknowledgedWordRef.current = gameWord.word
          setShowInlineMyWord(false)
        }}
      />
    )
  }

  // GAME ON
  if (phase === 'gameon') {
    return (
      <GameOn
        players={players}
        starterIndex={party.starterIndex ?? starterIndex ?? 0}
        onStartVoting={isHost ? () => setPhase('voting') : null}
        onBack={onEndGame}
      />
    )
  }

  // VOTING
  if (phase === 'voting') {
    if (voted) {
      const voteCount = Object.keys(votes).length
      return <WaitingScreen text={t.waitingVotes} count={voteCount} total={players.length} />
    }
    return (
      <CastVoteMulti
        playerName={playerName}
        players={players}
        onVote={handleVote}
        photoMap={photoMap}
      />
    )
  }

  // VOTE REVEAL
  if (phase === 'vote_reveal') {
    return (
      <VoteReveal
        players={players}
        votes={votes}
        imposterIndex={party.imposterIndex ?? imposterIndex}
        word={gameWord}
        showContinue={isHost}
        photoMap={photoMap}
        onBack={onEndGame}
        onContinue={(caught) => {
          if (caught) setPhase('imposter_guessing')
          else handleFinish()
        }}
      />
    )
  }

  // IMPOSTER GUESSING
  if (phase === 'imposter_guessing') {
    if (isImposter) {
      return (
        <ImposterGuess
          imposterName={playerName}
          word={gameWord}
          onResult={() => {}}
          onGuessSubmit={handleGuess}
          onBack={onEndGame}
        />
      )
    }
    return <WaitingScreen text={t.waitingImposterGuess} />
  }

  // ROUND OVER
  if (phase === 'round_over') {
    const imposterName = players[party.imposterIndex ?? imposterIndex]
    if (showLeaderboard) {
      return (
        <Leaderboard
          scores={scores}
          onPlayAgain={isHost ? handleHostPlayAgain : null}
          onEndGame={() => handleEndGame(scores)}
        />
      )
    }
    return (
      <RoundResults
        roundPoints={roundPoints}
        totalScores={scores}
        imposterName={imposterName}
        imposterCaught={party.imposterCaught || false}
        onContinue={() => setShowLeaderboard(true)}
        onBack={() => handleEndGame(scores)}
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
