<script lang="ts">
  import type { KeystoreKeyDto } from '$lib/types/keystore.dto';
  import IconButton from '@smui/icon-button';
  import List, { Item, PrimaryText, SecondaryText, Text } from '@smui/list';
  import Graphic from '@smui/list/src/Graphic.svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let linkPresets: KeystoreKeyDto[] = [];
  let selectionIndex = 3;
</script>

<section class="admin-sections">
  <div class="admin-sections-headline">
    <h2>Link Presets</h2>
  </div>
  <List threeLine avatarList singleSelection selectedIndex={selectionIndex}>
    {#each linkPresets as linkPreset, i}
      <Item
        on:SMUI:action={() => (selectionIndex = i)}
        selected={selectionIndex === i}
        class="admin-list-items"
      >
        <Graphic class="material-icons admin-list-items-icon">link</Graphic>
        <Text class="admin-list-items-text">
          <PrimaryText>{linkPreset.identifier}</PrimaryText>
          <SecondaryText>{linkPreset._id}</SecondaryText>
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

<style lang="scss">
</style>
