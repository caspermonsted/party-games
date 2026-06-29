import { useState } from 'react'
import NicknameScreen from './screens/NicknameScreen.jsx'
import GameLobby from './screens/GameLobby.jsx'
import ModeSelect from './screens/ModeSelect.jsx'
import JoinOrCreate from './screens/JoinOrCreate.jsx'
import JoinParty from './screens/JoinParty.jsx'
import WaitingRoom from './screens/WaitingRoom.jsx'
import CategorySelect from './screens/CategorySelect.jsx'
import PlayerSetup from './screens/PlayerSetup.jsx'
import WordReveal from './screens/WordReveal.jsx'
import { pickWord, pickImposter } from './data/words.js'
import { usePartySocket } from './hooks/usePartySocket.js'

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

export default function App() {
  const [nickname, setNickname] = useState(getSavedNickname)
  const [screen, setScreen] = useState('lobby')
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [players, setPlayers] = useState([])
  const [gameWord, setGameWord] = useState(null)
  const [imposterIndex, setImposterIndex] = useState(null)

  // Multi-phone party state
  const [partyCode, setPartyCode] = useState(null)
  const [partyPlayers, setPartyPlayers] = useState([])
  const [isHost, setIsHost] = useState(false)
  const [joinError, setJoinError] = useState(null)
  const [joinLoading, setJoinLoading] = useState(false)

  const { send: multiSend } = usePartySocket((msg) => {
    if (msg.type === 'party_created') {
      setPartyCode(msg.code)
      setPartyPlayers(msg.players)
      setIsHost(true)
      setPartySend(() => multiSend)
      setScreen('waitingroom')
    }
    if (msg.type === 'party_joined') {
      setPartyCode(msg.code)
      setPartyPlayers(msg.players)
      setIsHost(false)
      setPartySend(() => multiSend)
      setScreen('waitingroom')
    }
    if (msg.type === 'player_joined' || msg.type === 'player_left') {
      setPartyPlayers(msg.players)
    }
    if (msg.type === 'join_error') {
      setJoinLoading(false)
      setJoinError(
        msg.message === 'Party not found' ? 'No party found with that code 🤔'
        : msg.message === 'Game already started' ? 'That game has already started!'
        : msg.message === 'Name already taken' ? 'That name is already taken in this party!'
        : msg.message
      )
    }
    if (msg.type === 'party_disbanded' || msg.type === 'kicked') {
      setScreen('lobby')
      setPartyCode(null)
      setPartyPlayers([])
    }
  })

  function handleSetNickname(name) {
    saveNickname(name)
    setNickname(name)
  }

  if (!nickname) return <NicknameScreen onDone={handleSetNickname} />

  const user = { name: nickname, initial: nickname[0].toUpperCase() }

  // Same phone flow
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

  // Multi-phone flow
  if (screen === 'joinorcreate') {
    return (
      <JoinOrCreate
        onBack={() => setScreen('modeselect')}
        onCreate={() => {
          multiSend({ type: 'create_party', name: nickname })
        }}
        onJoin={() => setScreen('joinparty')}
      />
    )
  }

  if (screen === 'joinparty') {
    return (
      <JoinParty
        onBack={() => { setJoinError(null); setScreen('joinorcreate') }}
        error={joinError}
        loading={joinLoading}
        onSubmit={(code) => {
          setJoinError(null)
          setJoinLoading(true)
          multiSend({ type: 'join_party', code, name: nickname })
        }}
      />
    )
  }

  if (screen === 'waitingroom') {
    return (
      <WaitingRoom
        playerName={nickname}
        code={partyCode}
        initialPlayers={partyPlayers}
        send={multiSend}
        isHost={isHost}
        onGameStart={(msg) => {
          if (msg.fromHost) {
            // Host picks categories then starts
            setScreen('categoryselect')
          } else {
            // Players receive game_started from server
            const word = msg.word
            const imposter = msg.imposterIndex
            const playerNames = msg.players.map(p => p.name)
            setPlayers(playerNames)
            setGameWord(word)
            setImposterIndex(imposter)
            setScreen('wordreveal')
          }
        }}
        onDisbanded={() => {
          setScreen('lobby')
          setPartyCode(null)
          setPartyPlayers([])
        }}
      />
    )
  }

  if (screen === 'categoryselect') {
    return (
      <CategorySelect
        onBack={() => selectedMode === 'multi' ? setScreen('waitingroom') : setScreen('modeselect')}
        onDone={(categories) => {
          setSelectedCategories(categories)
          if (selectedMode === 'multi') {
            // Host picks word & imposter, broadcasts to all
            const word = pickWord(categories)
            const playerNames = partyPlayers.map(p => p.name)
            const imposter = pickImposter(playerNames)
            multiSend({
              type: 'start_game',
              code: partyCode,
              categories,
              word,
              imposterIndex: imposter,
            })
            setPlayers(playerNames)
            setGameWord(word)
            setImposterIndex(imposter)
            setScreen('wordreveal')
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
          const word = pickWord(selectedCategories)
          const imposter = pickImposter(playerList)
          setPlayers(playerList)
          setGameWord(word)
          setImposterIndex(imposter)
          setScreen('wordreveal')
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
        onDone={() => setScreen('lobby')}
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
