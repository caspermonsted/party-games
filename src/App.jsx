import GameLobby from './screens/GameLobby.jsx'

const currentUser = { name: 'Jonas', initial: 'J' }

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
  return <GameLobby user={currentUser} games={games} />
}
