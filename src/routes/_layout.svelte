<script>
  import Nav from '../components/Nav.svelte';
  import { localPreset, lightTheme } from './memorandum/util/stores.js';

  export let segment;

  if (process.browser) {
    localPreset.useLocalStorage();
    lightTheme.useLocalStorage();
  }
</script>

<main>
  <Nav {segment} />
  <slot />
</main>

<style lang="scss" global>
  @import "./style/global.scss";

  main {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: white;
    padding: 0;
    margin: 0 auto;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 5% 95%;
  }
</style>
