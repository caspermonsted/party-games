import { useState, useEffect } from 'react'
import { useProfilePhoto } from './hooks/useProfilePhoto.js'
import NicknameScreen from './screens/NicknameScreen.jsx'
import GameLobby from './screens/GameLobby.jsx'
import ModeSelect from './screens/ModeSelect.jsx'
import JoinOrCreate from './screens/JoinOrCreate.jsx'
import JoinParty from './screens/JoinParty.jsx'
import WaitingRoom from './screens/WaitingRoom.jsx'
import CategorySelect from './screens/CategorySelect.jsx'
import PlayerSetup from './screens/PlayerSetup.jsx'
import WordReveal from './screens/WordReveal.jsx'
import MyWord from './screens/MyWord.jsx'
import GameOn from './screens/GameOn.jsx'
import { CastVoteSamePhone, CastVoteMulti } from './screens/CastVote.jsx'
import VoteReveal from './screens/VoteReveal.jsx'
import ImposterGuess from './screens/ImposterGuess.jsx'
import RoundResults from './screens/RoundResults.jsx'
import Leaderboard from './screens/Leaderboard.jsx'
import { createParty, joinParty, startParty, submitVote, getParty } from './api/party.js'
import { pickWord, pickImposter } from './data/words.js'
import { calculatePoints, getSavedScores, saveScores, clearScores } from './data/scoring.js'
import { useLang } from './lang/LanguageContext.jsx'

// Multi-phone voting wrapper — poller serveren til alle har stemt
function CastVoteMultiWrapper({ playerName, players, partyCode, onAllVoted }) {
  const [voted, setVoted] = useState(false)
  const [waitingCount, setWaitingCount] = useState(0)

  useEffect(() => {
    if (!voted) return
    const interval = setInterval(async () => {
      const party = await getParty(partyCode)
      if (!party) return
      const voteCount = Object.keys(party.votes || {}).length
      setWaitingCount(voteCount)
      if (voteCount >= players.length) {
        clearInterval(interval)
        onAllVoted(party.votes)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [voted])

  if (voted) {
    return (
      <div style={{ position:'relative', width:'390px', minHeight:'100vh', background:'linear-gradient(165deg,#7c3aed,#6d28d9 40%,#4338ca)', fontFamily:"'Fredoka',sans-serif", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', color:'#fff', textAlign:'center', padding:'40px' }}>
        <div style={{ fontSize:'64px' }}>✅</div>
        <div style={{ fontSize:'26px', fontWeight:700 }}>Vote submitted!</div>
        <div style={{ fontSize:'16px', color:'#e9d5ff' }}>Waiting for others... ({waitingCount}/{players.length})</div>
        <div style={{ display:'flex', gap:'6px', marginTop:'8px' }}>
          {[0,1,2].map(i => <span key={i} style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#22d3ee', display:'inline-block', animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
        </div>
      </div>
    )
  }

  return (
    <CastVoteMulti
      playerName={playerName}
      players={players}
      onVote={async (voter, voted) => {
        await submitVote(partyCode, voter, voted)
        setVoted(true)
      }}
    />
  )
}

const games = [
  {
    id: 'imposter',
    title: 'Imposter Game',
    description: 'Guess the imposter',
    icon: '?',
    minPlayers: 3,
    maxPlayers: 12,
    durationMin: 5,
    status: 'available',
  },
]

function getSavedNickname() {
  try { return localStorage.getItem('pg_nickname') || null } catch { return null }
}
function saveNickname(name) {
  try { localStorage.setItem('pg_nickname', name) } catch {}
}

function getJoinCodeFromUrl() {
  try {
    const code = new URLSearchParams(window.location.search).get('join')
    return code ? code.toUpperCase() : null
  } catch { return null }
}

export default function App() {
  const [nickname, setNickname] = useState(getSavedNickname)
  const [screen, setScreen] = useState('lobby')
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [customWords, setCustomWords] = useState({})
  const [players, setPlayers] = useState([])
  const [gameWord, setGameWord] = useState(null)
  const [imposterIndex, setImposterIndex] = useState(null)

  // Party state
  const { lang } = useLang()
  const { photo } = useProfilePhoto()
  // Scoring state
  const [votes, setVotes] = useState({})
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0)
  const [roundPoints, setRoundPoints] = useState({})
  const [totalScores, setTotalScores] = useState({})
  const [imposterCaughtState, setImposterCaughtState] = useState(false)
  const [starterIndex, setStarterIndex] = useState(0)

  const [partyCode, setPartyCode] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [joinError, setJoinError] = useState(null)
  const [joinLoading, setJoinLoading] = useState(false)
  const [prefilledCode] = useState(getJoinCodeFromUrl)
  const [myImposterIndex, setMyImposterIndex] = useState(null)

  function finishRound(imposterGuessedCorrectly) {
    const { points, imposterCaught } = calculatePoints(players, imposterIndex, votes, imposterGuessedCorrectly)
    const saved = getSavedScores(players)
    const newTotals = {}
    players.forEach(p => { newTotals[p] = (saved[p] || 0) + (points[p] || 0) })
    saveScores(newTotals)
    setRoundPoints(points)
    setTotalScores(newTotals)
    setImposterCaughtState(imposterCaught)
    setScreen('roundresults')
  }

  function handleSetNickname(name) {
    saveNickname(name)
    setNickname(name)
  }

  if (!nickname) return <NicknameScreen onDone={(name) => {
    handleSetNickname(name)
    // Hvis de kom via QR-kode, send dem direkte til join
    if (prefilledCode) setScreen('joinparty')
  }} />

  // Hvis de kom via QR-kode og ikke har valgt join endnu
  if (prefilledCode && screen === 'lobby') {
    setScreen('joinparty')
  }

  const user = { name: nickname, initial: nickname[0].toUpperCase() }

  if (screen === 'modeselect') {
    return (
      <ModeSelect
        game={selectedGame}
        onBack={() => setScreen('lobby')}
        onSelect={(mode) => {
          setSelectedMode(mode)
          if (mode === 'multi') setScreen('joinorcreate')
          else setScreen('categoryselect')
        }}
      />
    )
  }

  if (screen === 'joinorcreate') {
    return (
      <JoinOrCreate
        onBack={() => setScreen('modeselect')}
        onCreate={async () => {
          try {
            const { code } = await createParty(nickname)
            setPartyCode(code)
            setIsHost(true)
            setScreen('waitingroom')
          } catch (e) {
            alert('Could not create party. Try again.')
          }
        }}
        onJoin={() => { setJoinError(null); setScreen('joinparty') }}
      />
    )
  }

  if (screen === 'joinparty') {
    return (
      <JoinParty
        onBack={() => prefilledCode ? setScreen('lobby') : setScreen('joinorcreate')}
        error={joinError}
        loading={joinLoading}
        initialCode={prefilledCode || ''}
        onSubmit={async (code) => {
          setJoinError(null)
          setJoinLoading(true)
          try {
            await joinParty(code, nickname)
            setPartyCode(code)
            setIsHost(false)
            setScreen('waitingroom')
          } catch (e) {
            setJoinError(e.message)
          } finally {
            setJoinLoading(false)
          }
        }}
      />
    )
  }

  if (screen === 'waitingroom') {
    return (
      <WaitingRoom
        playerName={nickname}
        code={partyCode}
        isHost={isHost}
        onBack={() => setScreen('joinorcreate')}
        onGameStart={(msg) => {
          if (msg.fromHost) {
            setScreen('categoryselect')
          } else {
            const playerNames = msg.players.map(p => p.name)
            const myIndex = playerNames.findIndex(n => n === nickname)
            setPlayers(playerNames)
            setGameWord(msg.word)
            setImposterIndex(msg.imposterIndex)
            setMyImposterIndex(myIndex === msg.imposterIndex)
            setStarterIndex(msg.starterIndex ?? 0)
            setScreen('myword')
          }
        }}
      />
    )
  }

  if (screen === 'categoryselect') {
    return (
      <CategorySelect
        onBack={() => selectedMode === 'multi' ? setScreen('waitingroom') : setScreen('modeselect')}
        onDone={async (categories, newCustomWords = {}) => {
          setSelectedCategories(categories)
          setCustomWords(newCustomWords)
          if (selectedMode === 'multi') {
            const word = pickWord(categories, lang, newCustomWords)
            const party = await import('./api/party.js').then(m => m.getParty(partyCode))
            const playerNames = party.players.map(p => p.name)
            const imposter = pickImposter(playerNames)
            const starter = Math.floor(Math.random() * playerNames.length)
            await startParty(partyCode, word, imposter, categories, starter)
            const myIndex = playerNames.findIndex(n => n === nickname)
            setPlayers(playerNames)
            setGameWord(word)
            setImposterIndex(imposter)
            setMyImposterIndex(myIndex === imposter)
            setStarterIndex(starter)
            setScreen('myword')
          } else {
            setScreen('playersetup')
          }
        }}
      />
    )
  }

  if (screen === 'playersetup') {
    return (
      <PlayerSetup
        hostName={nickname}
        onBack={() => setScreen('categoryselect')}
        onDone={(playerList) => {
          const word = pickWord(selectedCategories, lang, customWords)
          const imposter = pickImposter(playerList)
          const starter = Math.floor(Math.random() * playerList.length)
          setPlayers(playerList)
          setGameWord(word)
          setImposterIndex(imposter)
          setStarterIndex(starter)
          setScreen('wordreveal')
        }}
      />
    )
  }

  if (screen === 'myword') {
    return (
      <MyWord
        playerName={nickname}
        word={gameWord}
        isImposter={myImposterIndex}
        onDone={() => setScreen('gameon')}
      />
    )
  }

  if (screen === 'gameon') {
    return (
      <GameOn
        players={players}
        starterIndex={starterIndex}
        onStartVoting={() => {
          setVotes({})
          setCurrentVoterIndex(0)
          setScreen(selectedMode === 'multi' ? 'vote-multi' : 'vote-same')
        }}
      />
    )
  }

  // Same phone voting — én ad gangen
  if (screen === 'vote-same') {
    return (
      <CastVoteSamePhone
        players={players}
        currentVoterIndex={currentVoterIndex}
        onVote={(voter, voted) => {
          const newVotes = { ...votes, [voter]: voted }
          setVotes(newVotes)
          if (currentVoterIndex + 1 >= players.length) {
            setScreen('votereveal')
          } else {
            setCurrentVoterIndex(i => i + 1)
          }
        }}
      />
    )
  }

  // Multi phone voting — polling indtil alle har stemt
  if (screen === 'vote-multi') {
    return (
      <CastVoteMultiWrapper
        playerName={nickname}
        players={players}
        partyCode={partyCode}
        onAllVoted={(allVotes) => {
          setVotes(allVotes)
          setScreen('votereveal')
        }}
      />
    )
  }

  if (screen === 'votereveal') {
    return (
      <VoteReveal
        players={players}
        votes={votes}
        imposterIndex={imposterIndex}
        word={gameWord}
        onContinue={(caught) => {
          setImposterCaughtState(caught)
          if (caught) {
            setScreen('imposterguess')
          } else {
            finishRound(false)
          }
        }}
      />
    )
  }

  if (screen === 'imposterguess') {
    return (
      <ImposterGuess
        imposterName={players[imposterIndex]}
        word={gameWord}
        onResult={(guessedCorrectly) => finishRound(guessedCorrectly)}
      />
    )
  }

  if (screen === 'roundresults') {
    return (
      <RoundResults
        roundPoints={roundPoints}
        totalScores={totalScores}
        imposterName={players[imposterIndex]}
        imposterCaught={imposterCaughtState}
        onContinue={() => setScreen('leaderboard')}
      />
    )
  }

  if (screen === 'leaderboard') {
    return (
      <Leaderboard
        scores={totalScores}
        onPlayAgain={() => {
          // Ny runde med samme spillere
          setScreen(selectedMode === 'multi' ? 'categoryselect' : 'categoryselect')
        }}
        onEndGame={() => {
          clearScores()
          setTotalScores({})
          setScreen('lobby')
        }}
      />
    )
  }

  if (screen === 'wordreveal') {
    return (
      <WordReveal
        players={players}
        imposterIndex={imposterIndex}
        word={gameWord}
        onDone={() => setScreen('gameon')}
      />
    )
  }

  return (
    <GameLobby
      user={user}
      games={games}
      onPlay={(game) => {
        setSelectedGame(game)
        setScreen('modeselect')
      }}
      onChangeNickname={handleSetNickname}
    />
  )
}
