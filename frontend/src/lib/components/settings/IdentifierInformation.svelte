<script lang="ts">
  import { sharedIdentifierStore } from '$lib/util/stores/store-other';
  import { initialized, t } from '$lib/util/translations';
  import CopyButton from 'carbon-components-svelte/src/CopyButton/CopyButton.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import { fade } from 'svelte/transition';

  let snackbarMessage = $state('');
  let timeout = $state(undefined);

  const showNotification = $derived(timeout !== undefined);

  const triggerNotification = (message: string) => {
    snackbarMessage = message;
    timeout = 3_000;
  };

  const handleCopySuccess = () => {
    triggerNotification(
      $t('page.settings.identifiers.idCopied', {
        id: $sharedIdentifierStore.id,
      })
    );
  };
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
        iconDescription={$t('page.shared.button.idCopy')}
        on:click={handleCopySuccess}
      />
    </div>
  </section>

  {#if showNotification}
    <div class="notification_container" transition:fade>
      <InlineNotification
        {timeout}
        kind="info-square"
        lowContrast
        subtitle={snackbarMessage}
        class="inline_notification"
        on:close={(e) => {
          timeout = undefined;
        }}
      />
    </div>
  {/if}
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

  .notification_container {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    width: fit-content;
  }
</style>
