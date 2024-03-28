<script>
  export let gameOver = false
  export let user
  export let matchTied = false
  $:console.log({user})
</script>
{#if gameOver}
<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>
  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
        <div>
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <i class="{matchTied?"fa-sharp fa-solid fa-circle-stop text-red-500":"fa-light fa-face-smile text-green-500"} text-5xl"></i>
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{matchTied?"Match Tied":`${user} wins!`}</h3>
           
          </div>
        </div>
        <div class="mt-5 sm:mt-6">
          <button on:click type="button" class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Play Again</button>
        </div>
      </div>
    </div>
  </div>
</div>
{/if}
