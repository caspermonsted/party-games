import { useState } from 'react'
import NicknameScreen from './screens/NicknameScreen.jsx'
import GameLobby from './screens/GameLobby.jsx'

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

  if (!nickname) {
    return <NicknameScreen onDone={setNickname} />
  }

  const user = {
    name: nickname,
    initial: nickname[0].toUpperCase(),
  }

  return <GameLobby user={user} games={games} />
}
