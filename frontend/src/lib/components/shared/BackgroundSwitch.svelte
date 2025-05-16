<script lang="ts">
  import { backgroundStore } from '$lib/util/stores/store-background';
  import { initialized } from '$lib/util/translations';
  import Toggle from 'carbon-components-svelte/src/Toggle/Toggle.svelte';
  import { onMount } from 'svelte';

  export let customStyle = '';
  let backgroundSwitch = false;

  const changeBackground = () => {
    backgroundStore.set(backgroundSwitch ? 'gradient' : 'default');
  };

  onMount(() => {
    backgroundSwitch = $backgroundStore === 'gradient' ? true : false;
  });
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
