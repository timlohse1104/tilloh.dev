<script lang="ts">
  import { sharedIdentifierStore } from '$lib/util/stores/store-other';
  import { initialized, t } from '$lib/util/translations';
  import CopyButton from 'carbon-components-svelte/src/CopyButton/CopyButton.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
</script>

{#if $initialized}
  <section>
    <p>
      {$t('page.settings.identifiers.description1')}
    </p>

    <p>
      {$t('page.settings.identifiers.description2')}
    </p>

    <div class="info_box">
      <TextInput
        disabled
        labelText={$t('page.settings.identifiers.personalId')}
        value={$sharedIdentifierStore.id}
      />

      <CopyButton
        text={$sharedIdentifierStore.id}
        feedback="✅"
        feedbackTimeout={0}
        iconDescription="TODO"
      />
    </div>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  .info_box {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin-top: 1rem;
  }
</style>
