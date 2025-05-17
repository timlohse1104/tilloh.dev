<script lang="ts">
  import { createKey, updateKey } from '$lib/api/keystore.api';
  import {
    TOGGLE_KEY_IDENTIFIER,
    type KeystoreKeyDto,
  } from '$lib/types/keystore.dto';
  import { adminTogglesStore } from '$lib/util/stores/stores-admin';
  import { initialized, t } from '$lib/util/translations';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import CopyButton from 'carbon-components-svelte/src/CopyButton/CopyButton.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Toggle from 'carbon-components-svelte/src/Toggle/Toggle.svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import RadioButtonChecked from 'carbon-icons-svelte/lib/RadioButtonChecked.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import InputWithButton from '../shared/custom-carbon-components/InputWithButton.svelte';
  const dispatch = createEventDispatcher();

  let newToogleName = '';
  let notificationInfoText = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;

  const addToggle = async () => {
    if (!newToogleName) {
      return;
    }
    console.log({ newToogleName }, 'Adding new toggle...');

    const toggleName = newToogleName.startsWith('TOGGLE_')
      ? newToogleName
      : `TOGGLE_${newToogleName.toUpperCase()}`;

    const newToggle = await createKey({
      identifier: TOGGLE_KEY_IDENTIFIER,
      key: toggleName,
      value: 'false',
    });
    console.log({ newToggle }, 'New toggle added.');

    newToogleName = '';
    dispatch('updateDashboard');
  };

  const switchToggle = async (id: string) => {
    const toggle = $adminTogglesStore.find((t) => t._id === id);
    console.log({ toggle }, 'Updating toggle...');
    const { identifier, key, value: oldValue } = toggle;

    if (oldValue === 'true') {
      console.log('Switching toggle to "false"...');
      await updateKey({
        identifier,
        key,
        value: 'false',
      });
      dispatch('updateDashboard');
    } else {
      console.log('Switching toggle to "true"...');
      await updateKey({
        identifier,
        key,
        value: 'true',
      });
      dispatch('updateDashboard');
    }
  };

  const isToggleActive = (toggle: KeystoreKeyDto) => toggle.value === 'true';

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
        {$t('page.admin.toggles.title')}
        <span>({$adminTogglesStore.length})</span>
      </h2>
      <InputWithButton
        bind:value={newToogleName}
        placeholder={$t('page.admin.toggles.newToggle')}
        iconDescription={$t('page.admin.toggles.addToggle')}
        tooltipAlignment="end"
        icon={Add}
        action={addToggle}
      />
    </div>
    <Accordion class="mt1">
      {#each $adminTogglesStore as toggle}
        <AccordionItem>
          <svelte:fragment slot="title">
            <div class="admin_list_item_headline">
              <svelte:component this={RadioButtonChecked} />
              {toggle.key}
            </div>
          </svelte:fragment>
          <div class="admin_list_item_content">
            <div>
              <p>
                ✨{new Date(toggle.created).toLocaleString('de-DE')}
                📅{new Date(toggle.updated).toLocaleString('de-DE')}
              </p>
              <p>
                🆔{toggle._id}
              </p>
            </div>
            <div class="admin_list_button_group">
              <Toggle
                toggled={isToggleActive(toggle)}
                on:click={() => switchToggle(toggle._id)}
              />
              <CopyButton
                text={toggle._id}
                feedback="✅"
                feedbackTimeout={0}
                iconDescription={$t('page.admin.toggles.idCopy')}
                on:click={() => triggerNotification(toggle._id)}
              />
              <Button
                kind="danger"
                size="field"
                iconDescription={$t('page.admin.toggles.deleteTitle')}
                tooltipAlignment="end"
                icon={TrashCan}
                on:click={() => dispatch('removeToggle', { id: toggle._id })}
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
