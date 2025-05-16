<script lang="ts">
  import { languageStore } from '$lib/util/stores/store-language';
  import { initialized } from '$lib/util/translations';
  import Toggle from 'carbon-components-svelte/src/Toggle/Toggle.svelte';
  import { onMount } from 'svelte';

  export let customStyle = '';
  let languageSwitch = false;

  const changeLanguage = () => {
    languageStore.set(languageSwitch ? 'en' : 'de');
  };

  onMount(() => {
    languageSwitch = $languageStore === 'en' ? true : false;
  });
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
    margin-bottom: 1rem;
    font-size: 0.9rem;

    span {
      margin-left: 1rem;
      margin-right: 1rem;
    }
  }
</style>
