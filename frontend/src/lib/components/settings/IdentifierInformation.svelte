<script lang="ts">
  import { sharedIdentifierStore } from '$lib/util/stores';
  import { initialized, t } from '$lib/util/translations';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon';
</script>

<section>
  <h2>
    {#if $initialized}
      {$t('page.settings.identifiers.title')}
    {:else}
      Locale initializing...
    {/if}
  </h2>
  <p>
    {#if $initialized}
      {$t('page.settings.identifiers.description1')}
    {:else}
      Locale initializing...
    {/if}
  </p>

  <p>
    {#if $initialized}
      {$t('page.settings.identifiers.description2')}
    {:else}
      Locale initializing...
    {/if}
  </p>

  <div class="infoBox">
    {#if $initialized}
      <Textfield
        label={$t('page.settings.identifiers.personalId')}
        value={$sharedIdentifierStore.id}
        style="width: 100%;"
        helperLine$style="width: 100%;"
        disabled
      ></Textfield>
    {:else}
      Locale initializing...
    {/if}

    <IconButton
      on:click={() => navigator.clipboard.writeText($sharedIdentifierStore.id)}
      ><Icon class="material-icons">content_copy</Icon></IconButton
    >
  </div>
</section>

<style lang="scss">
  .infoBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
</style>
