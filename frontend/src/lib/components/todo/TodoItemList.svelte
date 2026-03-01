<script lang="ts">
  // 1. IMPORTS
  import { initialized, t } from '$lib/util/translations';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';

  // 2. PROPS
  let {
    title,
    items,
    emptyMessage,
    clearTooltip,
    itemClickTooltip,
    onItemClick,
    onRemoveItem,
    onClearAll,
    preventFocusSteal = false,
  }: {
    title: string;
    items: string[];
    emptyMessage: string;
    clearTooltip: string;
    itemClickTooltip?: string;
    onItemClick: (item: string) => void;
    onRemoveItem: (item: string) => void;
    onClearAll: () => void;
    preventFocusSteal?: boolean;
  } = $props();

  // 8. FUNCTIONS
  const handleItemMouseDown = (e: MouseEvent) => {
    if (preventFocusSteal) {
      // Prevent the button from stealing focus from the input
      e.preventDefault();
    }
  };
</script>

{#if $initialized}
  <Accordion>
    <AccordionItem class="custom_accordion_content">
      <div slot="title" class="accordion_title_wrapper">
        <span>{title}</span>
        {#if items?.length > 0}
          <button
            onclick={(e) => {
              e.stopPropagation();
              onClearAll();
            }}
            class="clear_button"
            title={clearTooltip}
          >
            ✕
          </button>
        {/if}
      </div>
      {#if items?.length > 0}
        <div class="item_entry_list">
          {#each items as item (item)}
            <div class="item_tag_wrapper">
              <button
                class="item_tag"
                onmousedown={handleItemMouseDown}
                onclick={() => onItemClick(item)}
                title={itemClickTooltip}
              >
                {item}
              </button>
              <button
                onclick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item);
                }}
                class="item_delete_btn"
                title="Remove from {title.toLowerCase()}"
              >
                ✕
              </button>
            </div>
          {/each}
        </div>
      {:else}
        <pre class="status">{emptyMessage}</pre>
      {/if}
    </AccordionItem>
  </Accordion>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  .item_entry_list {
    display: flex;
    flex-wrap: wrap;

    @media #{$phone} {
      width: 100%;
    }
  }

  .accordion_title_wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .clear_button {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    padding: 0;
    font-size: 1.25rem;
    line-height: 1;
    transition: color 0.2s ease;
    margin-left: auto;
    margin-right: var(--default_padding);

    &:hover {
      color: #da1e28;
    }
  }

  .item_tag_wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin: 0.25rem;
    background: #393939;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    transition: background-color 0.2s ease;

    &:hover {
      background: #525252;
    }
  }

  .item_tag {
    background: transparent;
    border: none;
    color: white;
    padding: 0;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .item_delete_btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
    line-height: 1;
    transition: color 0.2s ease;

    &:hover {
      color: #da1e28;
    }
  }
</style>
