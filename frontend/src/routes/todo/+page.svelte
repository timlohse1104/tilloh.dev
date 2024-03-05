<script lang="ts">
  import Button from '@smui/button';
  import { Icon, Label } from '@smui/common';
  import Drawer, {
    AppContent,
    Content,
    Header,
    Subtitle,
    Title,
  } from '@smui/drawer';
  import IconButton from '@smui/icon-button';
  import List, { Item, Text } from '@smui/list';
  import TodoListComponent from './content/TodoList.svelte';
  import TodoListOverlay from './content/TodoListOverlay.svelte';
  import { listOverlayOptionsStore, todoStore } from './util/stores.ts';

  let currentListIndex = 0;
  let openMenu = false;

  function showListOverlay(type: 'new' | 'edit', index?: number) {
    if (type === 'new') {
      currentListIndex = index || -1;
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.type = type;
    } else {
      currentListIndex = index;
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.type = type;
    }
  }

  function setActiveList(index: number) {
    currentListIndex = index;
    openMenu = false;
  }
</script>

<svelte:head>
  <title>Todo</title>
  <meta name="Todo" content="Todo" />
</svelte:head>

<section>
  <IconButton
    color="secondary"
    style="position: absolute;left: 0;top: 0;margin: var(--default-padding);z-index:1;"
    size="button"
    on:click={() => (openMenu = !openMenu)}
  >
    <Icon class="material-icons">menu</Icon>
  </IconButton>

  <Drawer
    variant="modal"
    fixed={false}
    bind:open={openMenu}
    style="width:25%;min-width:max-content;"
  >
    <Header>
      <Title
        style="text-align:left;margin:0;padding-left: calc(var(--default-padding)/2)"
        >Deine Listen</Title
      >
      <Subtitle
        style="text-align:left;margin:0 0 var(--default-padding) 0;padding-left: calc(var(--default-padding)/2)"
        >Einkaufen, Aufgaben und vieles mehr...</Subtitle
      >
    </Header>
    <Content>
      <List>
        <!-- Fallback if no todos could be found -->
        {#if $todoStore.length === 0}
          <div
            style="display:flex;gap: var(--default-padding);padding: var(--default-padding);margin:0 0 0 0.5rem;"
          >
            <Icon class="material-icons">search_off</Icon>
            <Text>Keine Listen vorhanden</Text>
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
            <Label>Neue Liste anlegen</Label>
          </Button>
        </div>
      </List>
    </Content>
  </Drawer>

  <AppContent class="app-content">
    <main class="main-content">
      <TodoListComponent listIndex={currentListIndex} />
    </main>
  </AppContent>

  {#if $listOverlayOptionsStore.showOverlay}
    <TodoListOverlay
      listIndex={currentListIndex}
      newListName={$todoStore[currentListIndex]?.name}
      newListEmoji={$todoStore[currentListIndex]?.emoji}
    />
  {/if}
</section>

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
    padding: 16px;
    height: 100%;
    box-sizing: border-box;
  }
</style>
