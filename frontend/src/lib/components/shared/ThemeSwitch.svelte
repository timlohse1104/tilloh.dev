<script lang="ts">
  import { themeStore, toggleTheme } from '$lib/util/stores/store-theme';
  import { initialized } from '$lib/util/translations';
  import Switch from '@smui/switch';
  import { onMount } from 'svelte';

  export let customStyle = '';
  let themeSwitch = false;

  onMount(() => {
    themeSwitch = $themeStore === 'light';
  });
</script>

{#if initialized}
  <section style={customStyle}>
    <span>🌙</span>
    <Switch
      bind:checked={themeSwitch}
      on:SMUISwitch:change={toggleTheme}
      color="secondary"
      icons={false}
    />
    <span>☀️</span>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  section {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--lightgrey80);
  }
</style>
