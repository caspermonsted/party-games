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
import MyWord from './screens/MyWord.jsx'
import GameOn from './screens/GameOn.jsx'
import { createParty, joinParty, startParty } from './api/party.js'
import { pickWord, pickImposter } from './data/words.js'
import { useLang } from './lang/LanguageContext.jsx'

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
  const [players, setPlayers] = useState([])
  const [gameWord, setGameWord] = useState(null)
  const [imposterIndex, setImposterIndex] = useState(null)

  // Party state
  const { lang } = useLang()
  const [partyCode, setPartyCode] = useState(null)
  const [isHost, setIsHost] = useState(false)
  const [joinError, setJoinError] = useState(null)
  const [joinLoading, setJoinLoading] = useState(false)
  const [prefilledCode] = useState(getJoinCodeFromUrl)
  const [myImposterIndex, setMyImposterIndex] = useState(null)

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
        onDone={async (categories) => {
          setSelectedCategories(categories)
          if (selectedMode === 'multi') {
            const word = pickWord(categories, lang)
            const party = await import('./api/party.js').then(m => m.getParty(partyCode))
            const playerNames = party.players.map(p => p.name)
            const imposter = pickImposter(playerNames)
            await startParty(partyCode, word, imposter, categories)
            const myIndex = playerNames.findIndex(n => n === nickname)
            setPlayers(playerNames)
            setGameWord(word)
            setImposterIndex(imposter)
            setMyImposterIndex(myIndex === imposter)
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
          const word = pickWord(selectedCategories, lang)
          const imposter = pickImposter(playerList)
          setPlayers(playerList)
          setGameWord(word)
          setImposterIndex(imposter)
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
        onDone={() => setScreen('lobby')}
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
