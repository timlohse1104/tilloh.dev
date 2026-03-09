<script lang="ts">
  // 1. IMPORTS
  import type { HistoryEntry } from '$lib/types/todo';
  import { initialized } from '$lib/util/translations';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

  // 2. PROPS
  type ListItem = string | HistoryEntry;

  interface Props {
    open: boolean;
    title: string;
    items: ListItem[];
    emptyMessage: string;
    clearTooltip: string;
    itemClickTooltip?: string;
    displayText: (item: ListItem) => string;
    itemKey: (item: ListItem) => string;
    onItemClick: (item: ListItem) => void;
    onRemoveItem: (item: ListItem) => void;
    onClearAll: () => void;
    onClose: () => void;
    preventFocusSteal?: boolean;
  }

  let {
    open = $bindable(),
    title,
    items,
    emptyMessage,
    clearTooltip,
    itemClickTooltip,
    displayText,
    itemKey,
    onItemClick,
    onRemoveItem,
    onClearAll,
    onClose,
    preventFocusSteal = false,
  }: Props = $props();

  // 8. FUNCTIONS
  const handleItemMouseDown = (e: MouseEvent) => {
    if (preventFocusSteal) {
      // Prevent the button from stealing focus from the input
      e.preventDefault();
    }
  };
</script>

{#if $initialized}
  <Modal
    bind:open
    modalHeading={title}
    danger
    primaryButtonText={clearTooltip}
    primaryButtonIcon={TrashCan}
    primaryButtonDisabled={!items?.length}
    on:click:button--primary={onClearAll}
    on:close={onClose}
  >
    <div class="modal_content">
      {#if items?.length > 0}
        <div class="item_entry_list">
          {#each items as item (itemKey(item))}
            <div class="item_tag_wrapper">
              <button
                class="item_tag"
                onmousedown={handleItemMouseDown}
                onclick={() => onItemClick(item)}
                title={itemClickTooltip}
              >
                {displayText(item)}
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
        <p class="empty_message">{emptyMessage}</p>
      {/if}
    </div>
  </Modal>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  .modal_content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .empty_message {
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
  }

  .item_entry_list {
    display: flex;
    flex-wrap: wrap;

    @media #{$phone} {
      width: 100%;
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
    min-width: 32px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    @media only screen and (max-width: 767px) {
      min-height: 44px;
      min-width: 44px;
    }

    &:hover {
      color: #da1e28;
    }
  }
</style>
