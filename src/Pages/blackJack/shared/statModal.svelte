<script>
  export let statModal = false
  export let matchesPlayed
  export let userWins
  export let userLosses
  export let userBlackjacks
  export let dealerBlackjacks
</script>

{#if statModal}
  <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-700 bg-opacity-50 backdrop-blur-md transition-opacity" />

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <div class="flex flex-col items-center justify-center gap-3">
            <div class="w-full text-center text-2xl text-blue-500">Statistics</div>

            <div class="flex w-full items-center">
              <div class="text-base w-1/2 font-semibold text-gray-500">Matches Played&nbsp;</div>
              <div class="text-base w-1/2 font-semibold text-gray-500">:&nbsp;{matchesPlayed||0}</div>
            </div>
            <div class="flex w-full items-center">
              <div class="text-base w-1/2 font-semibold text-gray-500">User Wins&nbsp;</div>
              <div class="text-base w-1/2 font-semibold text-gray-500">:&nbsp;{userWins||0}</div>
            </div>
            <div class="flex w-full items-center">
              <div class="text-base w-1/2 font-semibold text-gray-500">User Losses&nbsp;</div>
              <div class="text-base w-1/2 font-semibold text-gray-500">:&nbsp;{userLosses||0}</div>
            </div>
            <div class="flex w-full items-center">
              <div class="text-base w-1/2 font-semibold text-gray-500">User Blackjacks&nbsp;</div>
              <div class="text-base w-1/2 font-semibold text-gray-500">:&nbsp;{userBlackjacks||0}</div>
            </div>
            <div class="flex w-full items-center">
              <div class="text-base w-1/2 font-semibold text-gray-500">Dealer Blackjacks&nbsp;</div>
              <div class="text-base w-1/2 font-semibold text-gray-500">:&nbsp;{dealerBlackjacks||0}</div>
            </div>

            <div >
             <button on:click type="button" class="mt-6 rounded bg-red-600 px-2 py-2 text-sm font-semibold text-white hover:bg-red-500 active:bg-red-600 " ><i class="fa-solid fa-xmark"></i>&nbsp;Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
