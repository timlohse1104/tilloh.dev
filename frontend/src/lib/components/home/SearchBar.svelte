<script lang="ts">
  import { initialized, t } from '$lib/util/translations';
  import { Icon } from '@smui/common';
  import Paper from '@smui/paper';
  import { Input } from '@smui/textfield';

  let value = '';
</script>

{#if $initialized}
  <div class="search-container">
    <form action="https://duckduckgo.com/">
      <Paper class="solo-paper" elevation={6}>
        <Icon class="material-icons">search</Icon>
        <Input
          style="width: 250em;"
          bind:value
          placeholder={$t('page.home.searchPlaceholder')}
          class="solo-input"
          type="text"
          name="q"
          autofocus
        />
      </Paper>
    </form>
  </div>
{:else}
  <div class="search-container">Locale initializing...</div>
{/if}

<style lang="scss">
  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 36px 18px;
    margin-top: 2em;
    background-color: var(--mdc-theme-background);
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
  }

  * :global(.solo-paper) {
    display: flex;
    align-items: center;
    flex-grow: 1;
    width: 80vw;
    margin: 0 12px;
    padding: 0 12px;
    height: 48px;
  }
  * :global(.solo-paper > *) {
    display: inline-block;
    margin: 0 12px;
  }
  * :global(.solo-input) {
    flex-grow: 1;
    color: var(--mdc-theme-on-surface, #fff);
  }
  * :global(.solo-input::placeholder) {
    color: var(--mdc-theme-on-surface, #fff);
    opacity: 0.6;
  }
</style>
