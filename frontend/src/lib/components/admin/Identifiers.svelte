<script lang="ts">
  import type { IdentifierDto } from '$lib/types/identifiers.dto';
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

  export let identifiers: IdentifierDto[] = [];
</script>

{#if $initialized}
  <section class="admin-sections">
    <div class="admin-sections-headline">
      <h2>
        {$t('page.admin.identifiers.title')} <span>({identifiers.length})</span>
      </h2>
    </div>
    <List threeLine avatarList singleSelection class="admin-sections-list">
      {#each identifiers as identifier, i}
        <Item class="admin-list-items">
          <Graphic class="material-icons admin-list-items-icon"
            >fingerprint</Graphic
          >
          <Text class="admin-list-items-text">
            <PrimaryText>{identifier.name}</PrimaryText>
            <SecondaryText>🆔{identifier._id}</SecondaryText>
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
{:else}
  <section>Locale initializing...</section>
{/if}
