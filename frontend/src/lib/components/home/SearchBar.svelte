<script lang="ts">
  import { initialized, t } from '$lib/util/translations';
  import { Form, Search } from 'carbon-components-svelte';

  let value = '';
</script>

{#if $initialized}
  <div class="search_container">
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
  </div>
{:else}
  <div class="search_container">Locale initializing...</div>
{/if}

<style lang="scss">
  .search_container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 36px 18px;
    margin-top: 1em;
    width: 80vw;
  }
  :global(.global_search_form) {
    width: 100%;
  }
</style>
