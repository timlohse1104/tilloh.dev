<script lang="ts">
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import TodoListComponent from '$lib/components/todo/TodoList.svelte';
  import TodoListOverlay from '$lib/components/todo/TodoListOverlay.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import { listOverlayOptionsStore } from '$lib/util/stores/store-other';
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, setLocale, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import ClickableTile from 'carbon-components-svelte/src/Tile/ClickableTile.svelte';
  import Catalog from 'carbon-icons-svelte/lib/Catalog.svelte';
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
  import TaskAdd from 'carbon-icons-svelte/lib/TaskAdd.svelte';
  import { onMount } from 'svelte';

  const { todo: todoRoute } = applicationRoutes;

  let currentListIndex = 0;
  let newListIndex = 0;
  let openMenu = false;

  $: locale = $languageStore;

  onMount(async () => {
    await setLocale($languageStore);
  });

  const showListOverlay = (type: 'new' | 'edit', index?: number) => {
    openMenu = false;
    if (type === 'new') {
      newListIndex = $todoStore.length;
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.type = type;
    } else {
      currentListIndex = index;
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.type = type;
    }
  };
  const setActiveList = (index: number) => {
    currentListIndex = index;
    openMenu = false;
  };
</script>

<svelte:head>
  <title>{todoRoute.name[locale]}</title>
  <meta name={todoRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if todoRoute.toggle}
  {#if $initialized}
    <section>
      <Modal
        passiveModal
        bind:open={openMenu}
        modalHeading={$t('page.todos.sideMenu.title')}
        class="todo_list_modal"
      >
        <p>
          {$t('page.todos.sideMenu.description')}
        </p>

        <p class="mt1">
          {$t('page.todos.sideMenu.persistenceInfo')}
        </p>

        {#if $todoStore.length === 0}
          <div class="centered mb1">
            <p class="mt1">{$t('page.todos.sideMenu.emptyInfo')}</p>
          </div>
        {:else}
          <div class="mt1">
            {#each $todoStore as list, i (i)}
              <ClickableTile on:click={() => setActiveList(i)}>
                <div class="todo_list_entry">
                  <h4>
                    {list.emoji}
                    {list.name}
                  </h4>
                  <Button
                    kind="tertiary"
                    iconDescription="TODO"
                    icon={Edit}
                    size="field"
                    on:click={() => showListOverlay('edit', i)}
                  />
                </div>
              </ClickableTile>
            {/each}
          </div>
        {/if}

        <hr style="border-color:var(--darkgrey80);width:95%" />

        <div class="centered">
          <Button
            kind="tertiary"
            iconDescription="TODO"
            icon={TaskAdd}
            on:click={() => showListOverlay('new')}
            class="mt1"
          >
            {$t('page.todos.sideMenu.createNewList')}
          </Button>
        </div>
      </Modal>

      <div class="app_content">
        <div class="main_content">
          <Button
            kind="tertiary"
            iconDescription="TODO"
            icon={Catalog}
            id="list_menu_button"
            tooltipPosition="left"
            on:click={() => (openMenu = !openMenu)}
          />
          <TodoListComponent listIndex={currentListIndex} />
        </div>
      </div>

      {#if $listOverlayOptionsStore.showOverlay}
        <TodoListOverlay
          listIndex={newListIndex}
          newListName={$todoStore[newListIndex]?.name}
          newListEmoji={$todoStore[newListIndex]?.emoji}
        />
      {/if}
    </section>
  {:else}
    <section>Locale initializing...</section>
  {/if}
{:else}
  <ToggledApplicationInfo />
{/if}

<style lang="scss">
  section {
    position: relative;
    display: flex;
    z-index: 0;
  }

  :global(.todo_list_modal .bx--modal-container .bx--modal-content) {
    margin-bottom: 2rem;
  }

  .todo_list_entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .app_content {
    flex: auto;
    overflow: auto;
    position: relative;
    flex-grow: 1;
  }

  .main_content {
    overflow: auto;
    height: 100%;
    box-sizing: border-box;
  }

  :global(#list_menu_button) {
    position: absolute;
    right: 0;
    top: 0;
    margin: calc(var(--default_padding) / 10);
  }
</style>
