<script>
  import { onMount,afterUpdate } from "svelte"
  import {gameStore} from "./stores/gameStore"
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
      // console.log({ j })

      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
  }
  const drawCard = () => {
    return deck.pop()
  }

  const deal = () => {
    try {
      playerHand = [drawCard(), drawCard()]
      dealerHand = [drawCard(), drawCard()]
      console.log({ playerHand, dealerHand })
      // updateScores();
    } catch (error) {
      console.error(error)
    }
  }
  const handleStartGame = async () => {
    try {
      let id = await handleStart()
    } catch (error) {
      notify.danger(error)
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
    } catch (error) {
      console.error(error)
    }
  }
  const handleDraw = () => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log($gameStore.matchId)
        const { data } = await axios.get(`/api/v4/platform/random?max=52&matchid=${$gameStore.matchId}`)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  }
  afterUpdate(() => {
    console.log({ deck })
  })
</script>

<button type="button" on:click={deal}>Draw</button>
