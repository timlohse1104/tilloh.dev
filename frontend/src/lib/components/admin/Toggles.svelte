<script lang="ts">
  import { createKey, updateKey } from '$lib/api/keystore.api';
  import {
    TOGGLE_KEY_IDENTIFIER,
    type KeystoreKeyDto,
  } from '$lib/types/keystore.dto';
  import { isEnter } from '$lib/util/helper';
  import { adminTogglesStore } from '$lib/util/stores/stores-admin';
  import { initialized, t } from '$lib/util/translations';
  import IconButton from '@smui/icon-button';
  import List, {
    Graphic,
    Item,
    PrimaryText,
    SecondaryText,
    Text,
  } from '@smui/list';
  import Switch from '@smui/switch';
  import { Button, TextInput } from 'carbon-components-svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let newToogleName = '';

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
</script>

{#if $initialized}
  <section class="admin_sections">
    <div class="admin_sections_headline">
      <h2>
        {$t('page.admin.toggles.title')}
        <span>({$adminTogglesStore.length})</span>
      </h2>
      <div style="display: flex;">
        <TextInput
          placeholder={$t('page.admin.toggles.newToggle')}
          bind:value={newToogleName}
          on:keyup={(event) => {
            if (isEnter(event)) addToggle();
          }}
        />
        <Button
          kind="tertiary"
          size="field"
          on:click={() => addToggle()}
          icon={Add}
        />
      </div>
    </div>
    <List threeLine avatarList singleSelection class="admin_sections_list">
      {#each $adminTogglesStore as toggle, i}
        <Item class="admin_list_items">
          <Graphic class="material-icons admin_list_items_icon"
            >toggle_on</Graphic
          >
          <Text class="admin_list_items_text">
            <PrimaryText>{toggle.key}</PrimaryText>
            <SecondaryText>🆔{toggle._id}</SecondaryText>
            <SecondaryText
              >🔧{new Date(toggle.updated).toLocaleString(
                'de-DE',
              )}</SecondaryText
            >
          </Text>

          <Switch
            on:click={() => switchToggle(toggle._id)}
            checked={isToggleActive(toggle)}
          />
          <IconButton
            class="material-icons admin_list_items_button"
            on:click={() => dispatch('removeToggle', { id: toggle._id })}
            >delete</IconButton
          >
        </Item>
      {/each}
    </List>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}
