<script lang="ts">
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

  export let toggles = [];
</script>

<section class="admin-sections">
  <div class="admin-sections-headline">
    <h2>Toggles</h2>
  </div>
  <List threeLine avatarList singleSelection>
    {#each toggles as toggle, i}
      <Item class="admin-list-items">
        <Graphic class="material-icons admin-list-items-icon"
          >fingerprint</Graphic
        >
        <Text class="admin-list-items-text">
          <PrimaryText>{toggle.name}</PrimaryText>
          <SecondaryText>{toggle._id}</SecondaryText>
          <SecondaryText
            >✨{new Date(toggle.created).toLocaleString('de-DE')} 🔧{new Date(
              toggle.updated,
            ).toLocaleString('de-DE')}</SecondaryText
          >
        </Text>
        <IconButton
          class="material-icons admin-list-items-button"
          on:click={() =>
            dispatch('removeIdentifier', { identifierId: toggle._id })}
          >delete</IconButton
        >
      </Item>
    {/each}
  </List>
</section>
