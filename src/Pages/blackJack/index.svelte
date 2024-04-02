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
  import GameTitle from "./shared/gameTitle.svelte"
  let deck = []
  let playerHand = []
  let dealerHand = []
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
  let blackJackFound = false

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

  const revealDealerScore = () => {
    dealerHand[0].hidden = false
  }

  const checkGameOver = () => {
    if (playerScore <= 21) {
      console.log("hit")
      if (dealerScore <= 21) {
        // if (playerScore > dealerScore && playerScore >= 19) {
        //   console.log("player yet to win")
        //   user = "Player"
        //   userWins++
        // } else

        if (dealerScore > playerScore) {
          revealDealerScore()
          user = "Dealer"
          userLosses++
        } else if (playerScore === dealerScore) {
          revealDealerScore()
          matchTied = true
        }
      } else {
        revealDealerScore()
        user = "Player"
        userWins++
      }
    } else if (dealerScore <= 21 && playerScore <= 21 && playerScore > dealerScore) {
      revealDealerScore()
      user = "Player"
      userWins++
    } else {
      revealDealerScore()
      user = "Dealer"
      userLosses++
    }

    // dealerHand[0].hidden = false
    updateScores()

    checkWin()

    // checkMatchTied()
    setTimeout(() => {
      // gameOver = true
      gameOver = playerScore === dealerScore || playerScore === 21 || playerScore >= 21 || dealerScore === 21 || (dealerScore > playerScore && dealerScore <= 21) || (dealerScore > playerScore && dealerScore >= 21) || (dealerScore < playerScore && dealerScore >= 21)
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
        blackJackFound = true
        user = "Dealer"
        dealerBlackjacks++
        setTimeout(() => {
          gameOver = true
          revealDealerScore()

        }, 100)
      }
      if (playerScore === 21 && playerHand.length === 2) {
        blackJackFound = true
        user = "Player"
        userBlackjacks++
        setTimeout(() => {
          gameOver = true
          revealDealerScore()
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
    if (playerScore > dealerScore && dealerScore <= 21) {
      // if (dealerScore < 17 && playerScore > dealerScore) {
      revealDealerScore()
      let card = { ...(await drawCard()), hidden: false }
      dealerHand = [...dealerHand, card]
      updateScores()
      checkMatchTied()
      checkGameOver()
      await stand()
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
      blackJackFound = false
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
<WinnerModal bind:gameOver bind:user bind:matchTied on:click={restartGame} bind:blackJackFound />
<LoadingScreen bind:loading />
{#if !loadStartPage}
  <StartPage
    on:click={() => {
      deal()
      loadStartPage = !loadStartPage
    }}
  />
{:else}
  <div class="relative h-screen w-screen bg-gradient-to-r from-rose-100 to-teal-100 py-6 px-6 lg:px-8">
    <div class="flex max-w-2xl items-center justify-between lg:max-w-none">
      <GameTitle />
      <StatButton on:click={toggleStatModal} />
    </div>
    <div class="mx-auto max-w-7xl">
      <div class="mx-auto mt-3 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-blue-400 pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <MainCard title="Dealer" array={dealerHand} score={dealerScore} />
        <MainCard title="Player" array={playerHand} score={playerScore} />
      </div>

      <div class="mt-6 flex items-center justify-center gap-6">
        <button disabled={!playerHand.length || gameOver} type="button" class=" w-32 rounded bg-green-600 px-2 py-2 text-sm font-semibold text-white hover:bg-green-500 active:bg-green-600 disabled:cursor-not-allowed disabled:bg-blue-300" on:click={hit}>HIT</button>
        <button disabled={!playerHand.length || gameOver} type="button" class="w-32 rounded bg-blue-600 px-2 py-2 text-sm font-semibold text-white hover:bg-blue-500 active:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300" on:click={stand}>STAND</button>
      </div>
    </div>
  </div>
{/if}
