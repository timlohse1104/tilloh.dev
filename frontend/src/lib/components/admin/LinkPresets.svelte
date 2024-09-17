<script lang="ts">
  import type { KeystoreKeyDto } from '$lib/types/keystore.dto';
  import { initialized, t } from '$lib/util/translations';
  import IconButton from '@smui/icon-button';
  import List, {
    Graphic,
    Item,
    PrimaryText,
    SecondaryText,
    Text,
  } from '@smui/list';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let linkPresets: KeystoreKeyDto[] = [];
</script>

{#if $initialized}
  <section class="admin-sections">
    <div class="admin-sections-headline">
      <h2>{$t('page.admin.linkPresets.title')}</h2>
    </div>
    <List threeLine avatarList singleSelection>
      {#each linkPresets as linkPreset}
        <Item class="admin-list-items">
          <Graphic class="material-icons admin-list-items-icon">link</Graphic>
          <Text class="admin-list-items-text">
            <PrimaryText>👤🆔{linkPreset.identifier}</PrimaryText>
            <SecondaryText>🆔{linkPreset._id}</SecondaryText>
            <SecondaryText
              >✨{new Date(linkPreset.created).toLocaleString('de-DE')} 🔧{new Date(
                linkPreset.updated,
              ).toLocaleString('de-DE')}</SecondaryText
            >
          </Text>
          <IconButton
            class="material-icons admin-list-items-button"
            on:click={() =>
              dispatch('removeLinkPresets', {
                identifier: linkPreset.identifier,
                key: linkPreset.key,
              })}>delete</IconButton
          >
        </Item>
      {/each}
    </List>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}
