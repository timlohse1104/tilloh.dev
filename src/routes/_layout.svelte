<script>
  import Nav from '../components/Nav.svelte';
  import { localPreset, lightTheme } from './memorandum/util/stores.js';

  export let segment;

  if (process.browser) {
    localPreset.useLocalStorage();
    lightTheme.useLocalStorage();
  }
</script>

<Nav {segment} />

<main>
  <slot />
</main>

<style lang="scss" global>
  @import "./style/global.scss";
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
