<script>
  import Router from "svelte-spa-router"
  import routes from "./routes"
</script>

<div class="select-none">
  <Router {routes} />
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  body {
    font-family: "Audiowide", sans-serif;
  }
</style>
