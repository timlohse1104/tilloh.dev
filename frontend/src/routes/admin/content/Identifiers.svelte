<script lang="ts">
  import { deleteIdentifier, getIdentifiers } from '$lib/api/identifiers.api';
  import type { IdentifierDto } from '$lib/types/identifiers.dto';
  import IconButton from '@smui/icon-button';
  import List, { Item, PrimaryText, SecondaryText, Text } from '@smui/list';
  import Graphic from '@smui/list/src/Graphic.svelte';
  import { onMount } from 'svelte';

  export let adminToken: string;

  let identifiers: IdentifierDto[] = [];
  let selectionIndex = 3;

  const removeIdentifier = async (identifierId: string) => {
    try {
      await deleteIdentifier(adminToken, identifierId);
    } catch (error) {
      console.error('Error deleting identifier', error);
      return;
    }

    const deletedIdentifier = identifiers.find(
      (identifier) => identifier._id === identifierId,
    );
    console.log({ deletedIdentifier }, 'Identifier deleted.');
    identifiers = identifiers.filter(
      (identifier) => identifier._id !== identifierId,
    );
  };

  onMount(async () => {
    identifiers = await getIdentifiers(adminToken);
    console.log({ identifiers }, 'Identifiers loaded.');
  });
</script>

<section>
  <h2>Identifiers</h2>
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
          on:click={() => removeIdentifier(identifier._id)}>delete</IconButton
        >
      </Item>
    {/each}
  </List>
</section>

<style lang="scss">
  * :global(.identifiers-list) {
    max-width: 600px;
  }
</style>
