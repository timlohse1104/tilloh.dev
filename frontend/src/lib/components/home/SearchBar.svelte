<script lang="ts">
  import { initialized, t } from '$lib/util/translations';
  import { Icon } from '@smui/common';
  import Paper from '@smui/paper';
  import { Input } from '@smui/textfield';

  let value = '';
</script>

{#if $initialized}
  <div class="search_container">
    <form action="https://duckduckgo.com/">
      <Paper class="solo_paper" elevation={6}>
        <Icon class="material-icons">search</Icon>
        <Input
          style="width: 250em;"
          bind:value
          placeholder={$t('page.home.searchPlaceholder')}
          class="solo_input"
          type="text"
          name="q"
          autofocus
        />
      </Paper>
    </form>
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
  }

  * :global(.solo_paper) {
    display: flex;
    align-items: center;
    flex-grow: 1;
    width: 80vw;
    margin: 0 12px;
    padding: 0 12px;
    height: 48px;
  }
  * :global(.solo_paper > *) {
    display: inline-block;
    margin: 0 12px;
  }
  * :global(.solo_input) {
    flex-grow: 1;
    color: var(--mdc-theme-on-surface, #fff);
  }
  * :global(.solo_input::placeholder) {
    color: var(--mdc-theme-on-surface, #fff);
    opacity: 0.6;
  }
</style>
