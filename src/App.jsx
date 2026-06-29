import { useState } from 'react'
import NicknameScreen from './screens/NicknameScreen.jsx'
import GameLobby from './screens/GameLobby.jsx'
import ModeSelect from './screens/ModeSelect.jsx'
import CategorySelect from './screens/CategorySelect.jsx'

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

export default function App() {
  const [nickname, setNickname] = useState(null)
  const [screen, setScreen] = useState('lobby')
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedMode, setSelectedMode] = useState(null)

  if (!nickname) {
    return <NicknameScreen onDone={setNickname} />
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
          // TODO: start selve spillet med mode + categories
          alert(`Klar! Mode: ${selectedMode} — Kategorier: ${categories.join(', ')}`)
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
    />
  )
}
