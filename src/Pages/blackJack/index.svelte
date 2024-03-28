<script>
  import { onMount, afterUpdate, onDestroy } from "svelte"
  import gameStore from "./stores/gameStore"
  import axios from "axios"
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
  let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

  onMount(() => {
    createDeck()
    handleStartGame()
  })
  const createDeck = () => {
    deck = []
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit, value })
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
        console.log({drawnCard})
        deck.splice(randomNumber, 1)
        return drawnCard
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deal = async() => {
    try {
      playerHand = [await drawCard(),await drawCard()]
      dealerHand = [await drawCard(),await drawCard()]

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
  onDestroy(() => {
    localStorage.clear()
  })
</script>

<button
  type="button"
  on:click={() => {
    deal()
  }}
>
  Draw
</button>
