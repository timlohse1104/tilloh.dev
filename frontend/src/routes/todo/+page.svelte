<script lang="ts">
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import TodoListComponent from '$lib/components/todo/TodoList.svelte';
  import TodoListOverlay from '$lib/components/todo/TodoListOverlay.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { listOverlayOptionsStore, todoStore } from '$lib/util/stores.ts';
  import { getlocale, initialized, t } from '$lib/util/translations';
  import Button from '@smui/button';
  import { Icon, Label } from '@smui/common';
  import Drawer, {
    AppContent,
    Content,
    Header,
    Scrim,
    Subtitle,
    Title,
  } from '@smui/drawer';
  import IconButton from '@smui/icon-button';
  import List, { Item, Text } from '@smui/list';

  const { todo: todoRoute } = applicationRoutes;
  const locale = getlocale();
  let currentListIndex = 0;
  let newListIndex = 0;
  let openMenu = false;

  const showListOverlay = (type: 'new' | 'edit', index?: number) => {
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
      <Drawer
        variant="modal"
        bind:open={openMenu}
        style="width:25%;max-width:max-content;height:max-content;overflow:auto;"
      >
        <Header>
          <Title
            style="text-align:left;margin:0;padding-left: calc(var(--default-padding)/2)"
            >{$t('page.todos.sideMenu.title')}</Title
          >
          <Subtitle class="todos-side-menu-description"
            >{$t('page.todos.sideMenu.description')}</Subtitle
          >
          <Subtitle class="todos-side-menu-description"
            >{$t('page.todos.sideMenu.persistenceInfo')}</Subtitle
          >
        </Header>
        <Content>
          <List>
            {#if $todoStore.length === 0}
              <div
                style="display:flex;gap: var(--default-padding);padding: var(--default-padding);margin:0 0 0 0.5rem;"
              >
                <Icon class="material-icons">search_off</Icon>
                <Text>{$t('page.todos.sideMenu.emptyInfo')}</Text>
              </div>
            {:else}
              <!-- List all todos -->
              {#each $todoStore as list, i (i)}
                <Item
                  href="javascript:void(0)"
                  style="padding-left: calc(var(--default-padding) / 1.5);"
                  on:click={() => setActiveList(i)}
                >
                  <Text>{list.emoji} {list.name}</Text>
                  <IconButton
                    color="secondary"
                    style="margin-left: auto;"
                    size="button"
                    on:click={() => showListOverlay('edit', i)}
                  >
                    <Icon class="material-icons">edit</Icon>
                  </IconButton>
                </Item>
                <hr style="border-color:var(--darkgrey80);width:95%" />
              {/each}
            {/if}
            <div style="display:flex;justify-content:center;">
              <Button
                color={$todoStore.length === 0 ? 'primary' : 'secondary'}
                variant="outlined"
                on:click={() => showListOverlay('new')}
                style="margin: var(--default-padding);"
              >
                <Icon class="material-icons">playlist_add</Icon>
                <Label>{$t('page.todos.sideMenu.createNewList')}</Label>
              </Button>
            </div>
          </List>
        </Content>
      </Drawer>

      <Scrim />
      <AppContent class="app-content">
        <main class="main-content">
          <IconButton
            color="secondary"
            style="position: absolute;right: 0;top: 0;margin: calc(var(--default-padding)/ 10);"
            size="button"
            on:click={() => (openMenu = !openMenu)}
          >
            <Icon class="material-icons">menu</Icon>
          </IconButton>
          <TodoListComponent listIndex={currentListIndex} />
        </main>
      </AppContent>

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

  * :global(.app-content) {
    flex: auto;
    overflow: auto;
    position: relative;
    flex-grow: 1;
  }

  .main-content {
    overflow: auto;
    height: 100%;
    box-sizing: border-box;
  }

  :global(.todos-side-menu-description) {
    text-align: left;
    margin: 0 0 var(--default-padding) 0;
    padding-left: calc(var(--default-padding) / 2);
  }
</style>
