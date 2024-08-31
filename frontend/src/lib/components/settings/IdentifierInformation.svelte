<script lang="ts">
  import { sharedIdentifierStore } from '$lib/util/stores';
  import { initialized, t } from '$lib/util/translations';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon';
</script>

{#if $initialized}
  <section>
    <h2>
      {$t('page.settings.identifiers.title')}
    </h2>
    <p>
      {$t('page.settings.identifiers.description1')}
    </p>

    <p>
      {$t('page.settings.identifiers.description2')}
    </p>

    <div class="infoBox">
      <Textfield
        label={$t('page.settings.identifiers.personalId')}
        value={$sharedIdentifierStore.id}
        style="width: 100%;"
        helperLine$style="width: 100%;"
        disabled
      ></Textfield>

      <IconButton
        on:click={() =>
          navigator.clipboard.writeText($sharedIdentifierStore.id)}
        ><Icon class="material-icons">content_copy</Icon></IconButton
      >
    </div>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  .infoBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
</style>
