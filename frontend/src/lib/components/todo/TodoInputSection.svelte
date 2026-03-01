<script lang="ts">
  // 1. IMPORTS
  import { initialized, t } from '$lib/util/translations';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import Toggle from 'carbon-components-svelte/src/Toggle/Toggle.svelte';
  import TodoInput from './TodoInput.svelte';

  // 2. PROPS
  let {
    listId,
    categories,
    isCategoryView = $bindable(),
    onTodoAdded,
  }: {
    listId: string;
    categories: string[];
    isCategoryView: boolean;
    onTodoAdded?: () => void;
  } = $props();
</script>

{#if $initialized}
  <Accordion>
    <AccordionItem open class="custom_accordion_content">
      <div slot="title" class="accordion_title_wrapper">
        <span>{$t('page.todos.newTodo')}</span>
      </div>
      <div class="input_section_content">
        <div class="view-toggle-container">
          <Toggle
            bind:toggled={isCategoryView}
            labelA={$t('page.todos.view.classic')}
            labelB={$t('page.todos.view.byCategory')}
            size="sm"
          />
        </div>
        <TodoInput {listId} {categories} {onTodoAdded} />
      </div>
    </AccordionItem>
  </Accordion>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  .accordion_title_wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .input_section_content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .view-toggle-container {
    display: flex;
    justify-content: flex-end;
  }
</style>
