<script lang="ts">
  import { themeStore } from '$lib/util/stores/store-theme';
  import { initialized } from '$lib/util/translations';
  import { Theme } from 'carbon-components-svelte';
  import { onMount } from 'svelte';

  export let customStyle = '';
  let themeSwitch = false;

  onMount(() => {
    themeSwitch = $themeStore === 'light';
  });
</script>

{#if initialized}
  <section style={customStyle}>
    <span>☀️</span>
    <Theme
      render="toggle"
      toggle={{
        themes: ['g10', 'g80'],
        labelA: '',
        labelB: '',
        hideLabel: true,
        size: 'sm',
      }}
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
    margin-bottom: 1rem;
    font-size: 0.9rem;

    span {
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }
</style>
