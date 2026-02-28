<script lang="ts">
  // 1. IMPORTS
  import { initialized, t } from '$lib/util/translations';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

  // 2. PROPS
  let {
    categories,
    onClearCategories,
    onRemoveCategory,
  }: {
    categories: string[];
    onClearCategories: () => void;
    onRemoveCategory: (category: string) => void;
  } = $props();
</script>

{#if $initialized}
  <Accordion>
      <AccordionItem
        title={$t('page.todos.list.categories')}
        class="custom_accordion_content"
      >
        {#if categories?.length > 0}
          <div class="categories_list">
            <div class="category_entry_list">
              {#each categories as category (category)}
                <div class="category_tag_wrapper">
                  <span class="category_tag">
                    {category}
                  </span>
                  <button
                    onclick={(e) => {
                      e.stopPropagation();
                      onRemoveCategory(category);
                    }}
                    class="category_delete_btn"
                    title="Remove category"
                  >
                    ✕
                  </button>
                </div>
              {/each}
            </div>
            <Button
              kind="danger"
              size="small"
              iconDescription={$t('page.todos.deleteCategories')}
              tooltipAlignment="end"
              icon={TrashCan}
              on:click={onClearCategories}
              class="categories_delete_button"
            />
          </div>
        {:else}
          <pre class="status">{$t('page.todos.list.categoriesEmpty')}</pre>
        {/if}
      </AccordionItem>
    </Accordion>
{/if}

<style lang="scss">
  .categories_list {
    display: flex;
    align-items: start;
    justify-content: space-between;
    width: 100%;
  }

  .category_entry_list {
    display: flex;
    flex-wrap: wrap;
  }

  .category_tag_wrapper {
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

  .category_tag {
    background: transparent;
    border: none;
    color: white;
    padding: 0;
    font-size: 0.875rem;
  }

  .category_delete_btn {
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
