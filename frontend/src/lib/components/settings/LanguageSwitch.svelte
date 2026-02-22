<script lang="ts">
  // 1. IMPORTS
  import { languageStore } from '$lib/util/stores/store-language';
  import { initialized } from '$lib/util/translations';
  import Toggle from 'carbon-components-svelte/src/Toggle/Toggle.svelte';
  import { onMount } from 'svelte';

  // 2. PROPS
  let { customStyle = '' } = $props();

  // 4. STATE
  let languageSwitch = $state(false);

  // 7. LIFECYCLE
  onMount(() => {
    languageSwitch = $languageStore === 'en' ? true : false;
  });

  // 8. FUNCTIONS
  const changeLanguage = () => {
    languageStore.set(languageSwitch ? 'en' : 'de');
  };
</script>

{#if initialized}
  <section style={customStyle}>
    <span>🇩🇪</span>
    <Toggle
      size="sm"
      bind:toggled={languageSwitch}
      on:change={changeLanguage}
      labelA=""
      labelB=""
      hideLabel
    />
    <span>🇬🇧</span>
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
