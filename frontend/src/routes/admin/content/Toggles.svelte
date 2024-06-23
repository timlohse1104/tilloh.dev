<script lang="ts">
  import IconButton from '@smui/icon-button';
  import List, {
    Graphic,
    Item,
    PrimaryText,
    SecondaryText,
    Text,
  } from '@smui/list';
  import Switch from '@smui/switch';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let toggles = [
    {
      name: 'test',
      _id: 'sad1sadw12-dasd1321as-defgerfeg12',
      created: 0,
      updated: 0,
      value: true,
    },
  ];

  $: console.log(toggles);
</script>

<section class="admin-sections">
  <div class="admin-sections-headline">
    <h2>Toggles</h2>
  </div>
  <List threeLine avatarList singleSelection>
    {#each toggles as toggle, i}
      <Item class="admin-list-items">
        <Graphic class="material-icons admin-list-items-icon">toggle_on</Graphic
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

        <Switch bind:checked={toggle.value} />
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
