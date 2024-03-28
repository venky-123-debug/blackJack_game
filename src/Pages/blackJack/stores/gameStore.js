import { writable } from "svelte/store"

let storedDetail = localStorage.getItem("BLACKJACK")

if (typeof storedDetail != "object") {
  storedDetail = JSON.parse(storedDetail)
  // storedDetail.matchIds = []
  // console.log(storedDetail)
}

if (storedDetail == null) {
  storedDetail = {}
  // storedDetail.matchIds = []
}

/**
 * @typedef {Object} gameStore - represents the property detail object.
 * @type {Object} represents the property detail object
 * @type {String} matchId- matchId
 */

/**
 *  @typedef {import('svelte/store').Writable<gameStore>}
 */
const gameStore = writable(storedDetail)

gameStore.subscribe((value) => {
  // console.log(value)
  localStorage.setItem("BLACKJACK", JSON.stringify(value))
})

export default gameStore
