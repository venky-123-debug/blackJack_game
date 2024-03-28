<script>
  import { onMount, afterUpdate, onDestroy } from "svelte"
  import gameStore from "./stores/gameStore"
  import axios from "axios"
  import Card from "./components/card.svelte"
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
  // const createDeck = () => {
  //   deck = []
  //   for (let suit of suits) {
  //     for (let value of values) {
  //       deck.push({ suit, value })
  //     }
  //   }
  //   shuffleDeck()
  // }

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
        // console.log()
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
      // updateScores();
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

  const hit = () => {
    playerHand.push(drawCard())
    updateScores()
    checkGameOver()
  }
  onDestroy(() => {
    localStorage.clear()
  })
</script>
<svelte:head>
  <title>BlackJack</title>
</svelte:head>
<div class="bg-white py-12">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl lg:mx-0">
      <h2 class="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">BlackJack game</h2>
      <button
        type="button" 
        on:click={() => {
          deal()
        }}
      >
        Start Game
      </button>
    </div>
    <div class="mx-auto mt-3 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-blue-400 pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      <div class="flex max-w-xl flex-col items-start justify-between rounded-md bg-gray-300 p-3">
        <div class="flex w-full items-center text-center">
          <div class="text-2xl font-semibold text-gray-500">Player</div>
        </div>

        <div class="flex w-full items-center justify-center gap-3 pt-6">
          {#each playerHand as card}
            <Card {card} />
          {/each}
        </div>
      </div>
      <div class="flex max-w-xl flex-col items-start justify-between rounded-md bg-gray-300 p-3">
        <div class="flex w-full items-center text-center">
          <div class="text-2xl font-semibold text-gray-500">Dealer</div>
        </div>

        <div class="flex w-full items-center justify-center gap-3 pt-6">
          {#each dealerHand as card}
            <Card {card} />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
