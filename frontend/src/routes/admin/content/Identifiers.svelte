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

<section>
  <div class="identifiers-headline">
    <h2>Identifiers</h2>
    <IconButton
      class="material-icons"
      on:click={() => dispatch('reloadIdentifiers')}>refresh</IconButton
    >
  </div>
  <List
    class="identifiers-list"
    threeLine
    avatarList
    singleSelection
    selectedIndex={selectionIndex}
  >
    {#each identifiers as identifier, i}
      <Item
        on:SMUI:action={() => (selectionIndex = i)}
        selected={selectionIndex === i}
      >
        <Graphic class="material-icons">fingerprint</Graphic>
        <Text style="margin-right:1rem;">
          <PrimaryText style="text-align:start;">{identifier.name}</PrimaryText>
          <SecondaryText style="text-align:start;"
            >{identifier._id}</SecondaryText
          >
          <SecondaryText
            >✨{new Date(identifier.created).toLocaleString('de-DE')} 🔧{new Date(
              identifier.updated,
            ).toLocaleString('de-DE')}</SecondaryText
          >
        </Text>
        <IconButton
          class="material-icons"
          on:click={() => () =>
            dispatch('removeIdentifier', { identifierId: identifier._id })}
          >delete</IconButton
        >
      </Item>
    {/each}
  </List>
</section>

<style lang="scss">
  .identifiers-headline {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  * :global(.identifiers-list) {
    max-width: 600px;
  }
</style>
