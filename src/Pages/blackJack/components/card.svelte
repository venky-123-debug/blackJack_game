<script>
  import BgPattern1 from "../shared/bgPattern1.svelte";
  export let card
</script>

{#if card.hidden}
  <div class="h-full w-[30%] rounded-md bg-gradient-to-r from-teal-400 to-gray-800 ">
    <!-- <BgPattern1 /> -->
  </div>
{:else}
  <div class="flex w-[30%] flex-col justify-between gap-3 rounded-md bg-white">
    <div class="flex w-full flex-col items-start justify-center pl-2">
      <p class="text-3xl" style="color: {card.color};">
        {card.value}
      </p>
      <div class="text-4xl" style="color: {card.color};">
        {@html card.entityCode}
      </div>
    </div>
    <div class="flex justify-center text-6xl" style="color: {card.color};">
      {@html card.entityCode}
    </div>

    <div class="flex w-full rotate-180 flex-col items-start justify-center pl-2">
      <div class="text-4xl" style="color: {card.color};">
        {@html card.entityCode}
      </div>
      <p class="text-3xl" style="color: {card.color};">
        {card.value}
      </p>
    </div>
  </div>
{/if}
