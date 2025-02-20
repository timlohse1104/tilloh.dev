<script lang="ts">
  import { languageStore } from '$lib/util/stores/store-language';
  import { initialized } from '$lib/util/translations';
  import Switch from '@smui/switch';
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
    <Switch
      bind:checked={languageSwitch}
      on:SMUISwitch:change={changeLanguage}
      color="secondary"
      icons={false}
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
    margin: 0 1rem 0 0 !important;
    font-size: 0.9rem;
    color: var(--lightgrey80);
  }
</style>
