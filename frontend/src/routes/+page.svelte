<script lang="ts">
  import { Icon } from '@smui/common';
  import Paper from '@smui/paper';
  import { Input } from '@smui/textfield';
  import Navigation from './Navigation.svelte';

  let value = '';
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="tilloh.dev" />
</svelte:head>

<section>
  <Navigation />

  <div class="search-container">
    <form action="https://duckduckgo.com/">
      <Paper class="solo-paper" elevation={6}>
        <Icon class="material-icons">search</Icon>
        <Input
          style="width: 250em;"
          bind:value
          placeholder="Search"
          class="solo-input"
          type="text"
          name="q"
          autofocus
        />
      </Paper>
    </form>
  </div>
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.8;
  }

  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 36px 18px;
    margin-top: 5em;
    background-color: var(--mdc-theme-background);
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
  }

  * :global(.solo-paper) {
    display: flex;
    align-items: center;
    flex-grow: 1;
    width: 80vw;
    margin: 0 12px;
    padding: 0 12px;
    height: 48px;
  }
  * :global(.solo-paper > *) {
    display: inline-block;
    margin: 0 12px;
  }
  * :global(.solo-input) {
    flex-grow: 1;
    color: var(--mdc-theme-on-surface, #fff);
  }
  * :global(.solo-input::placeholder) {
    color: var(--mdc-theme-on-surface, #fff);
    opacity: 0.6;
  }
</style>
