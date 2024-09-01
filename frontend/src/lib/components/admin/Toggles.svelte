<script lang="ts">
  import { createKey, updateKey } from '$lib/api/keystore.api';
  import {
    TOGGLE_KEY_IDENTIFIER,
    type KeystoreKeyDto,
  } from '$lib/types/keystore.dto';
  import { isEnter } from '$lib/util/helper';
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
  import Textfield from '@smui/textfield';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let toggles: KeystoreKeyDto[] = [];

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
    const toggle = toggles.find((t) => t._id === id);
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
  <section class="admin-sections">
    <div class="admin-sections-headline">
      <h2>{$t('page.admin.toggles.title')}</h2>
      <Textfield
        style="margin-left:2rem;width: 100%;"
        bind:value={newToogleName}
        label={$t('page.admin.toggles.newToggle')}
        on:keyup={(event) => {
          if (isEnter(event)) addToggle();
        }}
      >
        <IconButton
          class="material-icons"
          style="position:absolute;right:0;"
          on:click={() => addToggle()}
        >
          add
        </IconButton>
      </Textfield>
    </div>
    <List threeLine avatarList singleSelection>
      {#each toggles as toggle, i}
        <Item class="admin-list-items">
          <Graphic class="material-icons admin-list-items-icon"
            >toggle_on</Graphic
          >
          <Text class="admin-list-items-text">
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
            class="material-icons admin-list-items-button"
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
