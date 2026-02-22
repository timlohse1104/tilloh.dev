<script lang="ts">
  // 1. IMPORTS
  import { initialized, t } from '$lib/util/translations';
  import Form from 'carbon-components-svelte/src/Form/Form.svelte';
  import Search from 'carbon-components-svelte/src/Search/Search.svelte';

  // 2. PROPS
  let { customClass = '' } = $props();

  // 4. STATE
  let value = $state('');
</script>

{#if $initialized}
  <section class={customClass}>
    <Form
      on:submit={(e) => {
        e.preventDefault();
        window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(value)}`;
      }}
      class="global_search_form"
    >
      <Search
        placeholder={$t('page.home.searchPlaceholder')}
        autofocus
        bind:value
      />
    </Form>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    display: flex;
    justify-content: center;
    align-items: center;
    // padding: 36px 18px;
    width: 80vw;
    margin-top: 5rem;

    @media #{$tablet} {
      margin-top: 2rem;
    }

    @media #{$tablet} {
      margin-top: 8rem;
    }
  }
  :global(.global_search_form) {
    width: 100%;
  }
</style>
