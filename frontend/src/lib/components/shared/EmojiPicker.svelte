<script lang="ts">
  // 1. IMPORTS
  import { initialized, t } from '$lib/util/translations';
  import { emojiKeywords, emojiCategories } from '$lib/util/emoji-data';
  import Search from 'carbon-components-svelte/src/Search/Search.svelte';
  import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
  import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte';

  // 2. PROPS
  let {
    selectedEmoji = $bindable(''),
    placeholder = '😀',
  }: {
    selectedEmoji?: string;
    placeholder?: string;
  } = $props();

  // 4. STATE
  let isOpen = $state(false);
  let searchQuery = $state('');

  // 5. DERIVED
  const filteredEmojis = $derived.by(() => {
    if (!searchQuery.trim()) {
      return emojiCategories;
    }

    const query = searchQuery.toLowerCase().trim();
    return emojiCategories
      .map((category) => ({
        name: category.name,
        emojis: category.emojis.filter((emoji) => {
          const keywords = emojiKeywords[emoji];
          if (!keywords) return false; // Only show emojis with keywords in search results

          // Check if any keyword contains the query
          return keywords.some(keyword => keyword.toLowerCase().includes(query));
        }),
      }))
      .filter((category) => category.emojis.length > 0);
  });

  // 8. FUNCTIONS
  const selectEmoji = (emoji: string) => {
    selectedEmoji = emoji;
    isOpen = false;
    searchQuery = '';
  };

  const togglePicker = () => {
    isOpen = !isOpen;
    if (!isOpen) {
      searchQuery = '';
    }
  };
</script>

{#if $initialized}
  <div class="emoji-picker-container">
    <button type="button" class="emoji-trigger" onclick={togglePicker}>
      <span class="emoji-display">{selectedEmoji || placeholder}</span>
      <span class="toggle-icon">
        {#if isOpen}
          <ChevronUp size={16} />
        {:else}
          <ChevronDown size={16} />
        {/if}
      </span>
    </button>

    {#if isOpen}
      <div class="emoji-picker-dropdown">
        <div class="emoji-search">
          <Search
            size="sm"
            placeholder={$t('page.shared.searchEmoji')}
            bind:value={searchQuery}
          />
        </div>

        <div class="emoji-grid-container">
          {#if filteredEmojis.length > 0}
            {#each filteredEmojis as category}
              <div class="emoji-category">
                <h4 class="category-name">{category.name}</h4>
                <div class="emoji-grid">
                  {#each category.emojis as emoji}
                    <button
                      type="button"
                      class="emoji-button"
                      onclick={() => selectEmoji(emoji)}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          {:else}
            <div class="no-results">
              <p>{$t('page.shared.noEmojisFound')}</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div>Loading...</div>
{/if}

<style lang="scss">
  .emoji-picker-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .emoji-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--cds-field);
    border: 1px solid var(--cds-border-strong);
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--cds-text-primary);

    &:hover {
      background: var(--cds-field-hover);
    }

    &:focus {
      outline: 2px solid var(--cds-focus);
      outline-offset: 2px;
    }
  }

  .emoji-display {
    font-size: 1.5rem;
    flex: 1;
    text-align: left;
  }

  .toggle-icon {
    display: flex;
    align-items: center;
    color: var(--cds-icon-primary);
  }

  .emoji-picker-dropdown {
    margin-top: 0.5rem;
    background: var(--cds-layer);
    border: 1px solid var(--cds-border-subtle);
    border-radius: 0.25rem;
    padding: 0.75rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .emoji-search {
    margin-bottom: 0.75rem;
  }

  .emoji-grid-container {
    max-height: 250px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0.25rem;
    overscroll-behavior: contain;
  }

  .emoji-category {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .category-name {
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    padding: 0.25rem 0.5rem;
    color: var(--cds-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 0.25rem;
  }

  .emoji-button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: var(--cds-layer-hover);
      transform: scale(1.2);
    }

    &:active {
      transform: scale(1.1);
    }
  }

  .no-results {
    padding: 2rem;
    text-align: center;
    color: var(--cds-text-secondary);
  }
</style>
