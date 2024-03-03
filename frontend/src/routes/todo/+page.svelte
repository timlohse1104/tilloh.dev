<script lang="ts">
  import Button, { Icon, Label } from '@smui/button';
  import Drawer, {
    AppContent,
    Content,
    Header,
    Subtitle,
    Title,
  } from '@smui/drawer';
  import List, { Graphic, Item, Text } from '@smui/list';
  import Textfield from '@smui/textfield';
  import TodoListComponent from './content/TodoList.svelte';
  import type { TodoList } from './types/list.ts';
  import { isEmoji } from './util/helpers.ts';
  import { todoStore } from './util/store.ts';

  let newListName = '';
  let newListEmojiInput: Textfield;
  let newListEmoji = '';
  let currentListIndex = 0;

  $: if (newListEmojiInput) {
    if (!isEmoji(newListEmojiInput)) {
      newListEmojiInput.$$set({ invalid: true });
    } else {
      newListEmojiInput.$$set({ invalid: false });
    }
  }

  function createList() {
    if (!newListName) {
      return;
    }

    const list: TodoList = {
      name: newListName,
      emoji: newListEmoji || '📝',
      history: [],
      todos: [],
    };
    todoStore.update((n) => {
      return [...n, list];
    });
  }
</script>

<svelte:head>
  <title>Todo</title>
  <meta name="Todo" content="Todo" />
</svelte:head>

<section>
  <Drawer style="width:25%;min-width:max-content;">
    <Header>
      <Title style="text-align:left;">Deine Listen</Title>
      <Subtitle>Einkaufen, Aufgaben und vieles mehr...</Subtitle>
    </Header>
    <Content>
      <List>
        <!-- Fallback if no todos could be found -->
        {#if $todoStore.length === 0}
          <Item disabled activated>
            <Graphic class="material-icons">search_off</Graphic>
            <Text>Keine Listen vorhanden</Text>
          </Item>
        {:else}
          <!-- List all todos -->
          {#each $todoStore as list, i (i)}
            <Item
              href="javascript:void(0)"
              on:click={() => (currentListIndex = i)}
            >
              <Text>{list.name}</Text>
            </Item>
          {/each}
        {/if}
      </List>
    </Content>
  </Drawer>

  <AppContent class="app-content">
    <main class="main-content">
      {#if $todoStore.length === 0}
        <div class="createListSection">
          <h2>Deine erste Liste</h2>
          <Textfield
            variant="outlined"
            bind:value={newListName}
            label="Name der Liste"
            required
            style="width: 25vw;"
          />
          <Textfield
            variant="outlined"
            bind:this={newListEmojiInput}
            bind:value={newListEmoji}
            label="Emoji der Liste"
            style="width: 25vw;"
          />
          <Button on:click={createList} variant="raised">
            <Icon class="material-icons">add_circle</Icon>
            <Label>Erstellen</Label>
          </Button>
        </div>
      {:else}
        <TodoListComponent listIndex={currentListIndex} />
      {/if}
    </main>
  </AppContent>
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

  .createListSection {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--default-padding);
    min-width: 5rem;
  }
</style>
