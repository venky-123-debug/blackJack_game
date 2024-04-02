<script>
  import Card from "./card.svelte"
  export let title = ""
  export let array = []
  export let score = 0

</script>

<div class="flex min-h-[350px] max-w-xl flex-col items-start justify-between rounded-md bg-gray-300 p-6">
  <div class="flex w-full items-center justify-between">
    <div class="flex w-full items-center text-center">
      <div class="text-3xl font-semibold text-gray-900">{title}</div>
    </div>
    <div class="text-center text-lg text-blue-500">
      Score:&nbsp
      <span class="text-2xl text-blue-900">{score}</span>
    </div>
  </div>
  <div class="flex w-full items-center justify-center gap-3 pt-6">
    {#each array as card}
      <Card {card} />
    {/each}
  </div>
</div>
