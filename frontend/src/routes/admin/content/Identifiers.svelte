<script lang="ts">
  import type { IdentifierDto } from '$lib/types/identifiers.dto';
  import IconButton from '@smui/icon-button';
  import List, { Item, PrimaryText, SecondaryText, Text } from '@smui/list';
  import Graphic from '@smui/list/src/Graphic.svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let identifiers: IdentifierDto[] = [];
  let selectionIndex = 3;
</script>

<section class="admin-sections">
  <div class="admin-sections-headline">
    <h2>Identifiers</h2>
    <IconButton
      class="material-icons"
      on:click={() => dispatch('reloadIdentifiers')}>refresh</IconButton
    >
  </div>
  <List threeLine avatarList singleSelection selectedIndex={selectionIndex}>
    {#each identifiers as identifier, i}
      <Item
        on:SMUI:action={() => (selectionIndex = i)}
        selected={selectionIndex === i}
        class="admin-list-items"
      >
        <Graphic class="material-icons admin-list-items-icon"
          >fingerprint</Graphic
        >
        <Text class="admin-list-items-text">
          <PrimaryText>{identifier.name}</PrimaryText>
          <SecondaryText>{identifier._id}</SecondaryText>
          <SecondaryText
            >✨{new Date(identifier.created).toLocaleString('de-DE')} 🔧{new Date(
              identifier.updated,
            ).toLocaleString('de-DE')}</SecondaryText
          >
        </Text>
        <IconButton
          class="material-icons admin-list-items-button"
          on:click={() =>
            dispatch('removeIdentifier', { identifierId: identifier._id })}
          >delete</IconButton
        >
      </Item>
    {/each}
  </List>
</section>

<style lang="scss">
</style>
