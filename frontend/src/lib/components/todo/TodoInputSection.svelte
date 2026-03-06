<script lang="ts">
  // 1. IMPORTS
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Calendar from 'carbon-icons-svelte/lib/Calendar.svelte';
  import Tag from 'carbon-icons-svelte/lib/Tag.svelte';
  import TodoInput from './TodoInput.svelte';

  // 2. PROPS
  interface Props {
    listId: string;
    categories: string[];
    onTodoAdded?: () => void;
    onOpenHistory: () => void;
    onOpenCategories: () => void;
  }

  let {
    listId,
    categories,
    onTodoAdded,
    onOpenHistory,
    onOpenCategories,
  }: Props = $props();
</script>

{#if $initialized}
  <div class="input_section">
    <div class="modal_buttons">
      <Button
        kind="tertiary"
        size="small"
        icon={Calendar}
        iconDescription={$t('page.todos.list.history')}
        on:click={onOpenHistory}
      >
        {$t('page.todos.list.history')}
      </Button>
      <Button
        kind="tertiary"
        size="small"
        icon={Tag}
        iconDescription={$t('page.todos.list.categories')}
        on:click={onOpenCategories}
      >
        {$t('page.todos.list.categories')}
      </Button>
    </div>
    <TodoInput {listId} {categories} {onTodoAdded} />
  </div>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  .input_section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
  }

  .modal_buttons {
    display: flex;
    gap: 0.5rem;

    @media #{$phone} {
      :global(.bx--btn) {
        flex: 1;
      }
    }
  }
</style>
