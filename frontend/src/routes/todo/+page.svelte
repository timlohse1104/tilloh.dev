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
  import List, { Item, Text } from '@smui/list';
  import TodoListComponent from './content/TodoList.svelte';
  import TodoListOverlay from './content/TodoListOverlay.svelte';
  import { listOverlayOptionsStore, todoStore } from './util/stores.ts';

  let currentListIndex = 0;

  function showListOverlay(type: 'new' | 'edit') {
    if (type === 'new') {
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.currentListIndex = -1;
      $listOverlayOptionsStore.type = type;
    } else {
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.currentListIndex = currentListIndex;
      $listOverlayOptionsStore.type = type;
    }
  }
</script>

<svelte:head>
  <title>Todo</title>
  <meta name="Todo" content="Todo" />
</svelte:head>

<section>
  <Drawer style="width:25%;min-width:max-content;">
    <Header>
      <Title
        style="text-align:left;margin:0;padding-left: calc(var(--default-padding)/2)"
        >Deine Listen</Title
      >
      <Subtitle
        style="text-align:left;margin:0 0 var(--default-padding) 0;padding-left: calc(var(--default-padding)/2)"
        >Einkaufen, Aufgaben und vieles mehr...</Subtitle
      >
      <hr style="margin-left:calc(var(--default-padding)/2);" />
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
              style="padding-left: var(--default-padding);"
              on:click={() => (currentListIndex = i)}
            >
              <Text>{list.emoji} | {list.name}</Text>
            </Item>
          {/each}
        {/if}
        <Button
          color={$todoStore.length === 0 ? 'primary' : 'secondary'}
          variant="outlined"
          style="margin: var(--default-padding) 0 calc(var(--default-padding) / 2) calc(var(--default-padding) + 0.5rem);"
          on:click={() => showListOverlay('new')}
        >
          <Icon class="material-icons">playlist_add</Icon>
          <Label>Neue Liste anlegen</Label>
        </Button>
      </List>
    </Content>
  </Drawer>

  <AppContent class="app-content">
    <main class="main-content">
      {#if $todoStore.length === 0}
        <p>Bisher keine Listen</p>
        <p>Anlegen</p>
      {:else}
        <TodoListComponent listIndex={currentListIndex} />
      {/if}
    </main>
  </AppContent>
  <TodoListOverlay />
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

  // .createListSection {
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   gap: var(--default-padding);
  //   min-width: 5rem;
  // }
</style>
