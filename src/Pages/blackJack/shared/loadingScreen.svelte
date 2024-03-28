<script>
  export let loading = false
</script>
{#if loading}
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
  <div class="h-16 w-16 animate-spin rounded-full border-2 border-b-0 border-orange-500" />
</div>
{/if}