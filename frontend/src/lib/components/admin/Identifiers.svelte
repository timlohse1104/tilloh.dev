<script lang="ts">
  import { createIdentifier } from '$lib/api/identifiers.api';
  import { isEnter } from '$lib/util/helper';
  import {
    adminIdentifiersStore,
    adminTokenStore,
  } from '$lib/util/stores/stores-admin';
  import { initialized, t } from '$lib/util/translations';
  import {
    Accordion,
    AccordionItem,
    Button,
    CopyButton,
    InlineNotification,
    TextInput,
  } from 'carbon-components-svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import FingerprintRecognition from 'carbon-icons-svelte/lib/FingerprintRecognition.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
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
      <div style="display: flex;">
        <TextInput
          placeholder={$t('page.admin.toggles.newIdentifier')}
          bind:value={newIdentifierName}
          on:keyup={(event) => {
            if (isEnter(event)) addIdentifier();
          }}
        />
        <Button
          kind="tertiary"
          size="field"
          on:click={() => addIdentifier()}
          icon={Add}
        />
      </div>
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
                iconDescription="TODO"
                on:click={() => triggerNotification(identifier._id)}
              />
              <Button
                kind="danger"
                size="field"
                iconDescription="TODO"
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
            console.log(e.detail.timeout);
          }}
        />
      </div>
    {/if}
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  .list_button_group {
    display: flex;
    gap: 0.25rem;
  }
</style>
