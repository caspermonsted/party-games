export const translations = {
  en: {
    // Nickname
    nicknameTitle: "What's your nickname?",
    nicknameSub: 'Your name will be shown to other players',
    nicknamePlaceholder: 'Enter your nickname...',
    nicknameBtn: "Let's go!",

    // Lobby
    greeting: 'Hey',
    headline: "Let's play!",
    partyGames: 'Party games',
    ready: 'ready',
    moreSoon: 'More soon',
    moreSoonSub: 'New games on the way',
    voteNext: 'Vote next',
    voteNextSub: 'Pick what we build',
    playNow: 'Play now',
    changeNickname: 'Change nickname',
    takePhoto: 'Take a photo',
    choosePhoto: 'Choose from gallery',
    removePhoto: 'Remove photo',
    save: 'Save',
    cancel: 'Cancel',

    // Mode select
    howPlaying: 'How are you playing?',
    samePhone: 'Same phone',
    samePhoneDesc: 'Everyone passes one phone around',
    oneEach: 'One phone each',
    oneEachDesc: 'Each player joins on their own phone',

    // Join or create
    joinOrCreateTitle: 'One phone each',
    joinOrCreateSub: 'Create a party or join one with a code',
    createParty: 'Create a party',
    createPartyDesc: "You're the host — others join with your code",
    joinParty: 'Join a party',
    joinPartyDesc: 'Enter the code from your host',

    // Join party
    joinTitle: 'Join a party',
    scanQr: 'Scan QR code',
    orEnterCode: 'or enter code',
    joining: 'Joining...',
    joinBtn: 'Join party 🎉',
    joinHint: 'Ask your host for the QR code or party code',
    errNotFound: 'No party found with that code 🤔',
    errStarted: 'That game has already started!',
    errNameTaken: 'That name is already taken in this party!',
    errGeneric: 'Something went wrong. Try again.',

    // QR Scanner
    scanTitle: 'Scan QR code',
    scanSub: "Point your camera at the host's QR code",
    startingCamera: 'Starting camera...',
    cameraError: 'Could not access camera. Please allow camera access and try again.',

    // Waiting room
    partyCode: 'Party code',
    shareCode: 'Share this with your friends',
    pinCode: '📋 PIN code',
    qrCode: '📷 QR code',
    scanToJoin: 'Scan to join instantly',
    goToApp: 'Go to the app and enter this code',
    playersJoined: (n) => `${n} player${n !== 1 ? 's' : ''} joined`,
    needMore: (n) => `Need ${n} more player${n !== 1 ? 's' : ''} to start`,
    startGame: 'Start game 🎉',
    waitingForHost: 'Waiting for host to start...',
    leaveParty: 'Leave party',

    // Category select
    pickCategories: 'Pick your categories',
    chooseSub: 'Choose at least one category',
    selectAll: 'Select all',
    removeAll: 'Remove all',
    startGameBtn: 'Start game 🎉',
    customCategoryTitle: 'Create your own category',
    customCategorySub: 'Type a category and AI generates the words',
    customCategoryPlaceholder: 'e.g. Superheroes, Cars, 90s things...',
    generatingWords: 'AI is generating words...',
    genError: 'Could not generate words. Try again.',

    // Categories
    catFamous: 'Famous people',
    catFood: 'Food & drinks',
    catAnimals: 'Animals',
    catPlaces: 'Countries & cities',
    catMusic: 'Music',
    catBrands: 'Brands',
    catMovies: 'Movies & TV',
    catSports: 'Sports',
    catNature: 'Nature',
    catJobs: 'Jobs',

    // Player setup
    whosPlaying: "Who's playing?",
    addAtLeast: 'Add at least 3 players',
    youHost: 'You (host)',
    player: 'Player',
    addPlayer: '+ Add player',
    moreNeeded: (n) => `${n} more player${n !== 1 ? 's' : ''} needed`,
    letsGo: "Let's go! 🎉",

    // Word reveal (same phone)
    passPhone: 'Pass the phone to',
    dontLook: "Don't let anyone else see the screen!",
    imReady: "I'm ready 👀",
    yourWord: 'Your word is',
    rememberHide: 'Remember it — then hide the screen!',
    youAreImposter: 'You are the\nIMPOSTER!',
    yourHint: 'Your hint',
    blendIn: "Blend in — don't get caught!",
    gotIt: 'Got it, hide it! 🙈',
    screenHidden: 'Screen hidden',
    passTo: 'Pass to',
    everyoneReady: 'Everyone has their word. Time to play!',
    nextPlayer: 'Next player →',

    // My word (multi phone)
    myWordLabel: 'Your word is',
    myWordSub: 'Remember it and blend in!',
    myImposterTitle: 'You are the\nIMPOSTER!',
    myBlendIn: "Blend in — don't get caught!",
    myReady: "I'm ready 👊",

    // Voting
    voteTitle: 'Who is the imposter?',
    voteSub: 'Choose who you think is the imposter',
    confirmVote: 'Lock in vote ✓',
    votingProgress: (current, total) => `Player ${current} of ${total} voting`,
    waitingVotes: 'Waiting for all votes...',

    // Vote reveal
    imposterCaught: 'Imposter caught! 🎯',
    imposterEscaped: 'Imposter escaped! 🕵️',
    theImposterWas: 'The imposter was',
    votes: 'votes',
    letImposterGuess: 'Let the imposter guess →',
    seeResults: 'See results →',

    // Imposter guess
    imposterGuessTitle: 'Last chance!',
    imposterGuessSub: 'What do you think the word was?',
    imposterGuessPlaceholder: 'Type your guess...',
    imposterGuessBtn: 'That\'s my guess!',
    imposterCorrect: 'Correct! +1 bonus point',
    imposterWrong: 'Wrong!',
    theWordWas: 'The word was',
    imposterBonusPoint: '+1 bonus point earned!',

    // Round results
    roundResults: 'Round results',
    pts: 'pts',
    ptsTotal: 'total',
    seeLeaderboard: 'See leaderboard →',

    // Leaderboard
    leaderboard: 'Leaderboard',
    leadingSub: (name) => `${name} is in the lead!`,
    playAgain: 'Play again',
    endGame: 'End game & go to lobby',

    // Game on
    gameOn: 'GAME IS ON',
    findImposter: 'Find the imposter',
    startingPlayer: 'Starting player',
    gameOnSub: "Talk about the word — without saying it!",
    letsGoBtn: 'Let\'s go →',
    startVoting: 'Start voting 🗳️',
    waitingVotes: 'Waiting for all votes...',
    waitingImposterGuess: 'Waiting for the imposter to guess...',
    waitingHost: 'Waiting for host to start voting...',
  },

  da: {
    // Nickname
    nicknameTitle: 'Hvad er dit kaldenavn?',
    nicknameSub: 'Dit navn vises til de andre spillere',
    nicknamePlaceholder: 'Skriv dit kaldenavn...',
    nicknameBtn: 'Lad os spille!',

    // Lobby
    greeting: 'Hej',
    headline: 'Lad os spille!',
    partyGames: 'Partyspil',
    ready: 'klar',
    moreSoon: 'Mere snart',
    moreSoonSub: 'Nye spil er på vej',
    voteNext: 'Stem næste',
    voteNextSub: 'Vælg hvad vi bygger',
    playNow: 'Spil nu',
    changeNickname: 'Skift kaldenavn',
    takePhoto: 'Tag et billede',
    choosePhoto: 'Vælg fra galleri',
    removePhoto: 'Fjern billede',
    save: 'Gem',
    cancel: 'Annuller',

    // Mode select
    howPlaying: 'Hvordan spiller I?',
    samePhone: 'Samme telefon',
    samePhoneDesc: 'Alle sender én telefon rundt',
    oneEach: 'Én telefon hver',
    oneEachDesc: 'Hver spiller joiner på sin egen telefon',

    // Join or create
    joinOrCreateTitle: 'Én telefon hver',
    joinOrCreateSub: 'Opret et party eller join et med en kode',
    createParty: 'Opret et party',
    createPartyDesc: 'Du er host — andre joiner med din kode',
    joinParty: 'Join et party',
    joinPartyDesc: 'Indtast koden fra din host',

    // Join party
    joinTitle: 'Join et party',
    scanQr: 'Scan QR-kode',
    orEnterCode: 'eller indtast kode',
    joining: 'Joiner...',
    joinBtn: 'Join party 🎉',
    joinHint: 'Bed din host om QR-koden eller partykoden',
    errNotFound: 'Intet party fundet med den kode 🤔',
    errStarted: 'Det spil er allerede startet!',
    errNameTaken: 'Det navn er allerede taget i dette party!',
    errGeneric: 'Noget gik galt. Prøv igen.',

    // QR Scanner
    scanTitle: 'Scan QR-kode',
    scanSub: 'Peg kameraet mod hostens QR-kode',
    startingCamera: 'Starter kamera...',
    cameraError: 'Kunne ikke tilgå kameraet. Tillad kameraadgang og prøv igen.',

    // Waiting room
    partyCode: 'Partykode',
    shareCode: 'Del dette med dine venner',
    pinCode: '📋 PIN-kode',
    qrCode: '📷 QR-kode',
    scanToJoin: 'Scan for at joine med det samme',
    goToApp: 'Gå til appen og indtast denne kode',
    playersJoined: (n) => `${n} spiller${n !== 1 ? 'e' : ''} joined`,
    needMore: (n) => `Mangler ${n} spiller${n !== 1 ? 'e' : ''} for at starte`,
    startGame: 'Start spillet 🎉',
    waitingForHost: 'Venter på at hosten starter...',
    leaveParty: 'Forlad party',

    // Category select
    pickCategories: 'Vælg dine kategorier',
    chooseSub: 'Vælg mindst én kategori',
    selectAll: 'Vælg alle',
    removeAll: 'Fjern alle',
    startGameBtn: 'Start spillet 🎉',
    customCategoryTitle: 'Lav din egen kategori',
    customCategorySub: 'Skriv en kategori, og AI finder på ordene',
    customCategoryPlaceholder: 'f.eks. Superhelte, Biler, 90\'er ting...',
    generatingWords: 'AI genererer ord...',
    genError: 'Kunne ikke generere ord. Prøv igen.',

    // Categories
    catFamous: 'Berømte personer',
    catFood: 'Mad & drikke',
    catAnimals: 'Dyr',
    catPlaces: 'Lande & byer',
    catMusic: 'Musik',
    catBrands: 'Brands',
    catMovies: 'Film & serier',
    catSports: 'Sport',
    catNature: 'Natur',
    catJobs: 'Jobs',

    // Player setup
    whosPlaying: 'Hvem spiller med?',
    addAtLeast: 'Tilføj mindst 3 spillere',
    youHost: 'Dig (vært)',
    player: 'Spiller',
    addPlayer: '+ Tilføj spiller',
    moreNeeded: (n) => `${n} spiller${n !== 1 ? 'e' : ''} mangler`,
    letsGo: 'Lad os spille! 🎉',

    // Word reveal (same phone)
    passPhone: 'Giv telefonen til',
    dontLook: 'Lad ingen andre se skærmen!',
    imReady: 'Jeg er klar 👀',
    yourWord: 'Dit ord er',
    rememberHide: 'Husk det — skjul så skærmen!',
    youAreImposter: 'Du er\nIMPOSTEREN!',
    yourHint: 'Dit hint',
    blendIn: 'Blend ind — bliv ikke afsløret!',
    gotIt: 'Forstået, skjul det! 🙈',
    screenHidden: 'Skærm skjult',
    passTo: 'Giv til',
    everyoneReady: 'Alle har fået deres ord. Tid til at spille!',
    nextPlayer: 'Næste spiller →',

    // My word (multi phone)
    myWordLabel: 'Dit ord er',
    myWordSub: 'Husk det og blend ind!',
    myImposterTitle: 'Du er\nIMPOSTEREN!',
    myBlendIn: 'Blend ind — bliv ikke afsløret!',
    myReady: 'Jeg er klar 👊',

    // Voting
    voteTitle: 'Hvem er imposteren?',
    voteSub: 'Vælg hvem du tror er imposteren',
    confirmVote: 'Aflever stemme ✓',
    votingProgress: (current, total) => `Spiller ${current} af ${total} stemmer`,
    waitingVotes: 'Venter på alle stemmer...',

    // Vote reveal
    imposterCaught: 'Imposteren er fanget! 🎯',
    imposterEscaped: 'Imposteren slap væk! 🕵️',
    theImposterWas: 'Imposteren var',
    votes: 'stemmer',
    letImposterGuess: 'Lad imposteren gætte →',
    seeResults: 'Se resultater →',

    // Imposter guess
    imposterGuessTitle: 'Sidste chance!',
    imposterGuessSub: 'Hvad tror du ordet var?',
    imposterGuessPlaceholder: 'Skriv dit gæt...',
    imposterGuessBtn: 'Det er mit gæt!',
    imposterCorrect: 'Rigtigt! +1 bonuspoint',
    imposterWrong: 'Forkert!',
    theWordWas: 'Ordet var',
    imposterBonusPoint: '+1 bonuspoint optjent!',

    // Round results
    roundResults: 'Runderesultater',
    pts: 'pt',
    ptsTotal: 'i alt',
    seeLeaderboard: 'Se leaderboard →',

    // Leaderboard
    leaderboard: 'Leaderboard',
    leadingSub: (name) => `${name} er i front!`,
    playAgain: 'Spil igen',
    endGame: 'Afslut spil & gå til lobby',

    // Game on
    gameOn: 'SPILLET ER I GANG',
    findImposter: 'Find imposteren',
    startingPlayer: 'Starter spiller',
    gameOnSub: 'Tal om ordet — uden at sige det!',
    letsGoBtn: 'Afsted →',
    startVoting: 'Start afstemning 🗳️',
    waitingVotes: 'Venter på alle stemmer...',
    waitingImposterGuess: 'Venter på at imposteren gætter...',
    waitingHost: 'Venter på at hosten starter afstemning...',
  },
}
