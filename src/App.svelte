<script>
  import Router from "svelte-spa-router"
  import routes from "./routes"
</script>

<Router {routes} />

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  body {
    font-family: "Audiowide", sans-serif;
  }
</style>
