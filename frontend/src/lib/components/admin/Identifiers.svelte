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
  <section class="admin_sections">
    <div class="admin_sections_headline">
      <h2>
        {$t('page.admin.identifiers.title')} <span>({identifiers.length})</span>
      </h2>
    </div>
    <List threeLine avatarList singleSelection class="admin_sections_list">
      {#each identifiers as identifier, i}
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
