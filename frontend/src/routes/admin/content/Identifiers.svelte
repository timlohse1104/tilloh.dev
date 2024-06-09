<script lang="ts">
  import { getIdentifiers } from '$lib/api/identifiers.api';
  import type { IdentifierDto } from '$lib/types/identifiers.dto';
  import List, {
    Item,
    Meta,
    PrimaryText,
    SecondaryText,
    Text,
  } from '@smui/list';
  import Graphic from '@smui/list/src/Graphic.svelte';
  import { onMount } from 'svelte';

  export let adminId: string;

  let identifiers: IdentifierDto[] = [];
  let selectionIndex = 3;

  onMount(async () => {
    identifiers = await getIdentifiers(adminId);
    console.log(identifiers);
  });
</script>

<section>
  <h2>Identifiers</h2>
  <List
    class="identifiers-list"
    twoLine
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
        <Text style="margin-right:1.5rem;">
          <PrimaryText style="text-align:start;">{identifier.name}</PrimaryText>
          <SecondaryText>{identifier._id}</SecondaryText>
        </Text>
        <Meta class="material-icons">info</Meta>
      </Item>
    {/each}
  </List>
</section>

<style lang="scss">
  * :global(.identifiers-list) {
    max-width: 600px;
  }
</style>
