<script lang="ts">
  import { sharedIdentifierStore } from '$lib/util/stores/store-other';
  import { initialized, t } from '$lib/util/translations';
  import Textfield from '@smui/textfield';
  import { CopyButton } from 'carbon-components-svelte';
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

    <div class="info_box">
      <Textfield
        label={$t('page.settings.identifiers.personalId')}
        value={$sharedIdentifierStore.id}
        style="width: 100%;"
        helperLine$style="width: 100%;"
        disabled
      ></Textfield>

      <CopyButton text={$sharedIdentifierStore.id} />
    </div>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  .info_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
</style>
