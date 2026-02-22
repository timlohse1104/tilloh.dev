<script lang="ts">
  // 1. IMPORTS
  import { backgroundStore } from '$lib/util/stores/store-background';
  import { initialized } from '$lib/util/translations';
  import Toggle from 'carbon-components-svelte/src/Toggle/Toggle.svelte';
  import { onMount } from 'svelte';

  // 2. PROPS
  let { customStyle = '' } = $props();

  // 4. STATE
  let backgroundSwitch = $state(false);

  // 7. LIFECYCLE
  onMount(() => {
    backgroundSwitch = $backgroundStore === 'gradient' ? true : false;
  });

  // 8. FUNCTIONS
  const changeBackground = () => {
    backgroundStore.set(backgroundSwitch ? 'gradient' : 'default');
  };
</script>

{#if initialized}
  <section style={customStyle}>
    <span>🎨</span>
    <Toggle
      size="sm"
      bind:toggled={backgroundSwitch}
      on:change={changeBackground}
      labelA=""
      labelB=""
      hideLabel
    />
    <span>🌈</span>
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
