<script>
  import CoinIcon from "../shared/coinIcon.svelte"
</script>

<div class="h-screen min-h-screen overflow-hidden bg-white">
  <div class="relative isolate h-full w-full overflow-hidden bg-gradient-to-b from-indigo-100/20">
    <!-- <i class="fa-solid fa-coin absolute right-36 top-10 text-blue-500 text-2xl"></i>
    <i class="fa-solid fa-coin absolute left-36 top-24 text-green-500 text-3xl"></i>
    <i class="fa-solid fa-coin absolute bottom-36 left-60 text-violet-500 text-6xl"></i> -->
    <CoinIcon color="blue-500" size="2xl" position="right-36" />
    <CoinIcon color="green-500" size="3xl" position="left-36 top-24" />
    <CoinIcon color="violet-500" size="6xl" position="bottom-36 left-60" />

    <div class="mx-auto max-w-7xl pt-24 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8">
      <div class="px-6 lg:px-0 lg:pt-4">
        <div class="mx-auto max-w-2xl">
          <div class="max-w-lg">
            <div class="mt-40 sm:mt-32 lg:mt-16" />
            <h1 class="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">BlackJack Game</h1>
            <!-- <p class="mt-6 text-lg leading-8 text-gray-600">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p> -->
            <div class="mt-10 flex items-center gap-x-6">
              <button on:click type="button" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Start Game</button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
        <div class="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36" aria-hidden="true" />
        <div class="shadow-lg md:rounded-3xl">
          <div class="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
            <div class="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" aria-hidden="true" />
            <div class="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
              <div class="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                <div class="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                  <div class="flex bg-gray-800/40 ring-1 ring-white/5">
                    <div class="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                      <div class="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">Play game</div>
                      <div class="border-r border-gray-600/10 px-4 py-2">Instructions</div>
                    </div>
                  </div>
                  <div class="px-28 pb-14 pt-6">
                    <div class="text-9xl text-white">
                      <i class="fa-solid fa-cards" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
  </div>
</div>
