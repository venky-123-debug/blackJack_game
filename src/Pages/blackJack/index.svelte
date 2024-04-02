<script>
  import { onMount, onDestroy } from "svelte"
  import gameStore from "./stores/gameStore"
  import axios from "axios"
  import MainCard from "./components/mainCard.svelte"
  import StartPage from "./components/startPage.svelte"
  import LoadingScreen from "./shared/loadingScreen.svelte"
  import WinnerModal from "./shared/winnerModal.svelte"
  import StatButton from "./shared/statButton.svelte"
  import StatModal from "./shared/statModal.svelte"
  let deck = []
  let playerHand = []
  let dealerHand = []
  let splitHand = []
  let playerScore = 0
  let dealerScore = 0
  let userWins = 0
  let userLosses = 0
  let userBlackjacks = 0
  let dealerBlackjacks = 0
  let gameOver = false
  let randomNumber = 0
  let loadStartPage = false
  let loading = false
  let matchesPlayed = 0
  let matchTied = false
  let user
  let statModal = false

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
    loading = true
    try {
      await drawMatch()
      if (randomNumber >= deck.length) {
        return deck.pop()
      } else {
        let drawnCard = deck[randomNumber]
        // console.log({ drawnCard })
        deck.splice(randomNumber, 1)
        return drawnCard
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading = false
    }
  }

  const deal = async () => {
    try {
      playerHand = [await drawCard(), await drawCard()]
      dealerHand = await Promise.all([
        { ...(await drawCard()), hidden: true },
        { ...(await drawCard()), hidden: false },
      ])
      matchesPlayed++
      updateScores()
      let value = getValue(dealerHand[0].value)
      dealerScore -= value
      checkWin()

      checkSplit()
      console.log({ dealerScore, playerScore, value })
      console.log({ playerHand, dealerHand })
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
      // console.log({ apiData })
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
    if (playerScore <= 21) {
      console.log("hit")
      if (dealerScore <= 21) {
        if (playerScore > dealerScore) {
          user = "Player"
          userWins++
        } else if (dealerScore > playerScore) {
          user = "Dealer"
          userLosses++
        } else {
          matchTied = true
        }
      } else {
        user = "Player"
        userWins++
      }
    } else if (dealerScore <= 21 && playerScore <= 21 && playerScore > dealerScore) {
      user = "Player"
      userWins++
    } else {
      user = "Dealer"
      userLosses++
    }

    updateScores()

    checkWin()
    // checkMatchTied()
    setTimeout(() => {
      // gameOver = true
      gameOver = playerScore === dealerScore || playerScore === 21 || playerScore >= 21 || dealerScore === 21 || (dealerScore > playerScore && dealerScore <= 21) || (dealerScore > playerScore && dealerScore >= 21)
    }, 100)
  }

  const checkMatchTied = () => {
    try {
      if (dealerScore === playerScore && dealerScore <= 21 && playerScore <= 21) {
        // if (matchesPlayed === 1 && dealerScore === playerScore && dealerScore <= 21 && playerScore <= 21) {
        matchTied = true
        setTimeout(() => {
          gameOver = true
        }, 100)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const checkBlackJack = () => {
    try {
      if (dealerScore === 21 && dealerHand.length === 2) {
        user = "Dealer"
        dealerBlackjacks++
        setTimeout(() => {
          gameOver = true
        }, 100)
      }
      if (playerScore === 21 && playerHand.length === 2) {
        user = "Player"
        userBlackjacks++
        setTimeout(() => {
          gameOver = true
        }, 100)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const checkWin = () => {
    try {
      checkBlackJack()
    } catch (error) {
      console.error(error)
      gameOver = false
    }
  }

  const hit = async () => {
    try {
      let card = await drawCard()
      playerHand = [...playerHand, card]
      // console.log({ playerHand })
      console.log({ playerScore, dealerScore })
      if (playerScore > 17 && playerScore > dealerScore) {
        await stand()
      }
      updateScores()
      checkGameOver()
    } catch (error) {
      console.error(error)
    }
  }

  const stand = async () => {
    if (dealerScore < 17 && playerScore > dealerScore) {
      dealerHand[0].hidden = false
      let card = { ...(await drawCard()), hidden: false }
      dealerHand = [...dealerHand, card]
      console.log({ dealerHand })
      updateScores()
      checkMatchTied()
      checkGameOver()
      await stand()
    }
  }

  const checkSplit = () => {
    return playerHand.length === 2 && playerHand[0].value === playerHand[1].value
  }
  const split = async () => {
    try {
      if (checkSplit()) {
        let firstHand = [playerHand[0], await drawCard()]
        let secondHand = [playerHand[1], await drawCard()]

        playerHand = []

        playerHand = [...firstHand]
        splitHand = [...secondHand]

        playerScore = calculateScore(playerHand)
        splitScore = calculateScore(splitHand)
      }
    } catch (error) {
      console.error(error)
    }
  }

  onDestroy(() => {
    localStorage.clear()
  })

  const restartGame = () => {
    try {
      playerScore = 0
      dealerScore = 0
      deal()
      gameOver = !gameOver
      matchTied = false
    } catch (error) {
      console.error(error)
    }
  }
  const toggleStatModal = () => {
    statModal = !statModal
  }
</script>

<svelte:head>
  <title>BlackJack</title>
</svelte:head>
<StatModal bind:matchesPlayed bind:userWins bind:userLosses bind:userBlackjacks bind:dealerBlackjacks on:click={toggleStatModal} bind:statModal />
<WinnerModal bind:gameOver bind:user bind:matchTied on:click={restartGame} />
<LoadingScreen bind:loading />
{#if !loadStartPage}
  <StartPage
    on:click={() => {
      deal()
      loadStartPage = !loadStartPage
    }}
  />
{:else}
  <div class="relative bg-gradient-to-r from-rose-100 to-teal-100 py-12">
    <StatButton on:click={toggleStatModal} />
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto mt-3 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-blue-400 pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <MainCard title="Dealer" array={dealerHand} score={dealerScore} />
        <MainCard title="Player" array={playerHand} score={playerScore} />
      </div>

      <div class="flex items-center justify-center gap-6">
        <button disabled={!playerHand.length || gameOver} type="button" class="mt-6 rounded bg-blue-600 px-2 py-2 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300" on:click={hit}>HIT</button>
        <button disabled={!playerHand.length || gameOver} type="button" class="mt-6 rounded bg-blue-600 px-2 py-2 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300" on:click={stand}>STAND</button>
      </div>
    </div>
    <h2>Statistics:</h2>
    <p>Matches Played: {matchesPlayed}</p>
    <p>User Wins: {userWins}</p>
    <p>Dealer Wins: {userLosses}</p>
    <p>User Blackjacks: {userBlackjacks}</p>
    <p>Dealer Blackjacks: {dealerBlackjacks}</p>
  </div>
{/if}
