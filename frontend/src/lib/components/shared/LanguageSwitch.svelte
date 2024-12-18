<script lang="ts">
  import { languageStore } from '$lib/util/language';
  import { initialized } from '$lib/util/translations';
  import Switch from '@smui/switch';
  import { onMount } from 'svelte';

  let languageSwitch = false;

  const changeLanguage = () => {
    languageStore.set(languageSwitch ? 'en' : 'de');
  };

  onMount(() => {
    languageSwitch = $languageStore === 'en' ? true : false;
  });
</script>

{#if initialized}
  <div class="language_switcher">
    <span>🇩🇪</span>
    <Switch
      bind:checked={languageSwitch}
      on:SMUISwitch:change={changeLanguage}
      color="secondary"
      icons={false}
    />
    <span>🇬🇧</span>
  </div>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  .language_switcher {
    display: flex;
    align-items: center;
    margin-right: 1rem;
    font-size: 0.9rem;
    color: var(--lightgrey80);
  }
</style>
