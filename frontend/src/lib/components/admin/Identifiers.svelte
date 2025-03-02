<script lang="ts">
  import { createIdentifier } from '$lib/api/identifiers.api';
  import { isEnter } from '$lib/util/helper';
  import {
    adminIdentifiersStore,
    adminTokenStore,
  } from '$lib/util/stores/stores-admin';
  import { initialized, t } from '$lib/util/translations';
  import IconButton from '@smui/icon-button';
  import List, {
    Graphic,
    Item,
    PrimaryText,
    SecondaryText,
    Text,
  } from '@smui/list';
  import Textfield from '@smui/textfield';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let newIdentifierName = '';

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
</script>

{#if $initialized}
  <section class="admin_sections">
    <div class="admin_sections_headline">
      <h2>
        {$t('page.admin.identifiers.title')}
        <span>({$adminIdentifiersStore.length})</span>
      </h2>
      <Textfield
        style="margin-left:2rem;width: 75%;"
        bind:value={newIdentifierName}
        label={$t('page.admin.toggles.newIdentifier')}
        on:keyup={(event) => {
          if (isEnter(event)) addIdentifier();
        }}
      >
        <IconButton
          class="material-icons"
          style="position:absolute;right:0;"
          on:click={() => addIdentifier()}
        >
          add
        </IconButton>
      </Textfield>
    </div>
    <List threeLine avatarList singleSelection class="admin_sections_list">
      {#each $adminIdentifiersStore as identifier, i}
        <Item class="admin_list_items">
          <Graphic class="material-icons admin_list_items_icon"
            >fingerprint</Graphic
          >
          <Text class="admin_list_items_text">
            <PrimaryText>{identifier.name}</PrimaryText>
            <SecondaryText>🆔{identifier._id}</SecondaryText>
            <SecondaryText
              >✨{new Date(identifier.created).toLocaleString('de-DE')} 🔧{new Date(
                identifier.updated,
              ).toLocaleString('de-DE')}</SecondaryText
            >
          </Text>
          <IconButton
            class="material-icons admin_list_items_button"
            on:click={() =>
              dispatch('removeIdentifier', { identifierId: identifier._id })}
            >delete</IconButton
          >
        </Item>
      {/each}
    </List>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}
