<script lang="ts">
  import {
    darkThemeValue,
    lightThemeValue,
    themeStore,
  } from '$lib/util/stores/store-theme';
  import { initialized } from '$lib/util/translations';
  import Theme from 'carbon-components-svelte/src/Theme/Theme.svelte';

  export let customStyle = '';
</script>

{#if initialized}
  <section style={customStyle}>
    <span>☀️</span>
    <Theme
      bind:theme={$themeStore}
      render="toggle"
      toggle={{
        themes: [lightThemeValue, darkThemeValue],
        labelA: '',
        labelB: '',
        hideLabel: true,
        size: 'sm',
      }}
      persist
      persistKey="__carbon-theme"
    />
    <span>🌙</span>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  section {
    display: flex;
    align-items: center;
    font-size: 0.9rem;

    span {
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }
</style>
