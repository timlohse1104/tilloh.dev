<script lang="ts">
  import { createIdentifier } from '$lib/api/identifiers.api';
  import {
    adminIdentifiersStore,
    adminTokenStore,
  } from '$lib/util/stores/stores-admin';
  import { initialized, t } from '$lib/util/translations';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import CopyButton from 'carbon-components-svelte/src/CopyButton/CopyButton.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import FingerprintRecognition from 'carbon-icons-svelte/lib/FingerprintRecognition.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import InputWithButton from '../shared/custom-carbon-components/InputWithButton.svelte';
  const dispatch = createEventDispatcher();

  let newIdentifierName = '';
  let notificationInfoText = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;

  const addIdentifier = async () => {
    if (!newIdentifierName) {
      return;
    }
    console.log({ newIdentifierName }, 'Creating new identifier...');

    const newIdentifier = await createIdentifier(
      newIdentifierName,
      $adminTokenStore,
    );
    console.log({ newIdentifier }, 'New identifier created.');

    newIdentifierName = '';
    dispatch('updateDashboard');
  };

  const triggerNotification = (id: string) => {
    notificationInfoText = $t('page.admin.copiedToClipboard', {
      id,
    });
    timeout = 3_000;
  };
</script>

{#if $initialized}
  <section class="admin_sections">
    <div class="admin_sections_headline">
      <h2>
        {$t('page.admin.identifiers.title')}
        <span>({$adminIdentifiersStore.length})</span>
      </h2>
      <InputWithButton
        bind:value={newIdentifierName}
        placeholder={$t('page.admin.toggles.newIdentifier')}
        iconDescription={$t('page.admin.toggles.addIdentifier')}
        tooltipAlignment="end"
        icon={Add}
        action={addIdentifier}
      />
    </div>
    <Accordion class="mt1">
      {#each $adminIdentifiersStore as identifier}
        <AccordionItem>
          <svelte:fragment slot="title">
            <div class="admin_list_item_headline">
              <svelte:component this={FingerprintRecognition} />
              {identifier.name}
            </div>
          </svelte:fragment>
          <div class="admin_list_item_content">
            <div>
              <p>
                ✨{new Date(identifier.created).toLocaleString('de-DE')}
                📅{new Date(identifier.updated).toLocaleString('de-DE')}
              </p>
              <p>
                🆔{identifier._id}
              </p>
            </div>
            <div class="admin_list_button_group">
              <CopyButton
                text={identifier._id}
                feedback="✅"
                feedbackTimeout={0}
                iconDescription={$t('page.admin.identifiers.idCopy')}
                on:click={() => triggerNotification(identifier._id)}
              />
              <Button
                kind="danger"
                size="field"
                iconDescription={$t('page.admin.identifiers.deleteTitle')}
                tooltipAlignment="end"
                icon={TrashCan}
                on:click={() => {
                  dispatch('removeIdentifier', {
                    identifierId: identifier._id,
                  });
                }}
              />
            </div>
          </div>
        </AccordionItem>
      {/each}
    </Accordion>

    {#if showNotification}
      <div transition:fade>
        <InlineNotification
          {timeout}
          kind="info-square"
          subtitle={notificationInfoText}
          class="inline_notification"
          on:close={(e) => {
            timeout = undefined;
            notificationInfoText = undefined;
          }}
        />
      </div>
    {/if}
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}
