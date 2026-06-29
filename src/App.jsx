import { useState } from 'react'
import NicknameScreen from './screens/NicknameScreen.jsx'
import GameLobby from './screens/GameLobby.jsx'
import ModeSelect from './screens/ModeSelect.jsx'
import CategorySelect from './screens/CategorySelect.jsx'
import PlayerSetup from './screens/PlayerSetup.jsx'

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

  function handleSetNickname(name) {
    saveNickname(name)
    setNickname(name)
  }

  if (!nickname) {
    return <NicknameScreen onDone={handleSetNickname} />
  }

  const user = {
    name: nickname,
    initial: nickname[0].toUpperCase(),
  }

  if (screen === 'modeselect') {
    return (
      <ModeSelect
        game={selectedGame}
        onBack={() => setScreen('lobby')}
        onSelect={(mode) => {
          setSelectedMode(mode)
          setScreen('categoryselect')
        }}
      />
    )
  }

  if (screen === 'categoryselect') {
    return (
      <CategorySelect
        onBack={() => setScreen('modeselect')}
        onDone={(categories) => {
          setSelectedCategories(categories)
          setScreen('playersetup')
        }}
      />
    )
  }

  if (screen === 'playersetup') {
    return (
      <PlayerSetup
        hostName={nickname}
        onBack={() => setScreen('categoryselect')}
        onDone={(players) => {
          // TODO: start selve spillet
          alert(`Starting game!\nPlayers: ${players.join(', ')}\nCategories: ${selectedCategories.join(', ')}`)
        }}
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
