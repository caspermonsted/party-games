import { useState } from 'react'
import NicknameScreen from './screens/NicknameScreen.jsx'
import GameLobby from './screens/GameLobby.jsx'
import ModeSelect from './screens/ModeSelect.jsx'

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
  const [screen, setScreen] = useState('lobby') // 'lobby' | 'modeselect'
  const [selectedGame, setSelectedGame] = useState(null)

  if (!nickname) {
    return <NicknameScreen onDone={setNickname} />
  }

  const user = {
    name: nickname,
    initial: nickname[0].toUpperCase(),
  }

  if (screen === 'modeselect' && selectedGame) {
    return (
      <ModeSelect
        game={selectedGame}
        onBack={() => setScreen('lobby')}
        onSelect={(mode) => {
          // TODO: navigate til selve spillet med valgt mode
          alert(`Spilmode: ${mode} — kommer snart!`)
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
