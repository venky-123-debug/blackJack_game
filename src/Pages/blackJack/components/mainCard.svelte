<script>
  import Card from "./card.svelte";
  export let title=""
  export let array=[]
</script>

<div class="flex max-w-xl flex-col items-start justify-between rounded-md min-h-[350px] bg-gray-300 p-6">
  <div class="flex w-full items-center text-center">
    <div class="text-3xl font-semibold text-gray-900">{title}</div>
  </div>

  <div class="flex w-full items-center justify-center gap-3 pt-6">
    {#each array as card}
      <Card {card} />
    {/each}
  </div>
</div>