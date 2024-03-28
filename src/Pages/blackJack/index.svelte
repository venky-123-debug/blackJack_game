<script>
  import { onMount, afterUpdate, onDestroy } from "svelte"
  import gameStore from "./stores/gameStore"
  import axios from "axios"
  import MainCard from "./components/mainCard.svelte"
  let deck = []
  let playerHand = []
  let dealerHand = []
  let playerScore = 0
  let dealerScore = 0
  let userWins = 0
  let userLosses = 0
  let dealerWins = 0
  let dealerLosses = 0
  let userBlackjacks = 0
  let dealerBlackjacks = 0
  let gameOver = false
  let randomNumber = 0

  let suits = ["Hearts", "Diamonds", "Clubs", "Spades"]
  let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

  onMount(() => {
    createDeck()
    handleStartGame()
  })
  const createDeck = () => {
    deck = []
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < values.length; j++) {
        let suit = suits[i]
        let value = values[j]
        let entityCode, color

        if (suit == "Hearts" || suit == "Diamonds") {
          color = "red"
        } else {
          color = "black"
        }

        if (suit == "Hearts") entityCode = "&#9829;"
        else if (suit == "Diamonds") entityCode = "&#9830;"
        else if (suit == "Clubs") entityCode = "&#9827;"
        else if (suit == "Spades") entityCode = "&#9824;"
        deck.push({ suit, value, entityCode, color })
      }
    }
    shuffleDeck()
  }
  const shuffleDeck = () => {
    for (let i = deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))

      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
  }

  const drawCard = async () => {
    try {
      await drawMatch()
      if (randomNumber >= deck.length) {
        return deck.pop()
      } else {
        let drawnCard = deck[randomNumber]
        console.log({ drawnCard })
        deck.splice(randomNumber, 1)
        return drawnCard
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deal = async () => {
    try {
      playerHand = [await drawCard(), await drawCard()]
      dealerHand = [await drawCard(), await drawCard()]

      console.log({ playerHand, dealerHand })
      updateScores()
    } catch (error) {
      console.error(error)
    }
  }
  const handleStartGame = async () => {
    try {
      let id = await handleStart()
      $gameStore.matchId = id
    } catch (error) {
      console.error(error)
      // notify.danger(error)
    }
  }
  const handleStart = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get("/api/v4/platform/generate-match-id")
        resolve(data.matchId)
      } catch (error) {
        console.error(error)
        reject(error)
      }
    })
  }
  const drawMatch = async () => {
    try {
      let apiData = await handleDraw()
      console.log({ apiData })
      randomNumber = apiData.random
    } catch (error) {
      console.error(error)
    }
  }
  const handleDraw = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`/api/v4/platform/random?max=52&matchid=${$gameStore.matchId}`)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  }

  const hit = async () => {
    let card = await drawCard()
    playerHand = [...playerHand, card]
    console.log({ playerHand })
    updateScores()
    checkGameOver()
  }

  const stand = async () => {
    while (dealerScore < 17) {
      let card = await drawCard()
      dealerHand = [...dealerHand, card]
      updateScores()
    }
    checkGameOver()
  }

  const updateScores = () => {
    playerScore = calculateScore(playerHand)
    dealerScore = calculateScore(dealerHand)
  }

  const calculateScore = (hand) => {
    let score = 0
    let hasAce = false
    for (let card of hand) {
      if (card.value === "A") {
        hasAce = true
      }
      score += getValue(card.value)
    }
    if (hasAce && score + 10 <= 21) {
      score += 10
    }
    return score
  }

  const getValue = (value) => {
    if (["J", "Q", "K"].includes(value)) {
      return 10
    } else if (value === "A") {
      return 1
    } else {
      return parseInt(value, 10)
    }
  }

  const checkGameOver = () => {
    if (playerScore > 21 || dealerScore === 21 || (dealerScore > playerScore && dealerScore <= 21)) {
      gameOver = true
      if (dealerScore === 21 && dealerHand.length === 2) {
        dealerBlackjacks++
      }
      if (playerScore === 21 && playerHand.length === 2) {
        userBlackjacks++
      }
      if (dealerScore > 21 || (playerScore <= 21 && playerScore > dealerScore)) {
        userWins++
      } else {
        userLosses++
      }
    }
    updateScores()
  }
  $:{console.log(userWins,userLosses)}
  onDestroy(() => {
    localStorage.clear()
  })
</script>

<svelte:head>
  <title>BlackJack</title>
</svelte:head>
<div class="bg-white py-12">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto flex w-full flex-col items-center justify-center">
      <h2 class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">BlackJack game</h2>
      <button type="button" disabled={playerHand.length > 0 || gameOver} class="mt-6 rounded bg-blue-600 px-2 py-2 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300" on:click={deal}>DEAL</button>
    </div>
    <div class="mx-auto mt-3 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-blue-400 pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      <MainCard title="Player" array={playerHand} score={playerScore} />
      <MainCard title="Dealer" array={dealerHand} score={dealerScore} />
    </div>

    <div class="flex items-center justify-center gap-6">
      <button disabled={!playerHand.length || gameOver} type="button" class="mt-6 rounded bg-blue-600 px-2 py-2 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300" on:click={hit}>HIT</button>
      <button disabled={!playerHand.length || gameOver} type="button" class="mt-6 rounded bg-blue-600 px-2 py-2 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300" on:click={stand}>STAND</button>
    </div>
  </div>
  <h2>Statistics:</h2>
  <p>User Wins: {userWins}</p>
  <p>User Losses: {userLosses}</p>
  <p>User Blackjacks: {userBlackjacks}</p>
  <p>Dealer Wins: {dealerWins}</p>
  <p>Dealer Losses: {dealerLosses}</p>
  <p>Dealer Blackjacks: {dealerBlackjacks}</p>
</div>
