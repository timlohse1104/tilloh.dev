<script lang="ts">
  import Button from '@smui/button';
  import { Icon, Label } from '@smui/common';
  import Drawer, {
    AppContent,
    Content,
    Header,
    Scrim,
    Title,
  } from '@smui/drawer';
  import IconButton from '@smui/icon-button';
  import List, { Item, Text } from '@smui/list';
  import ChatListComponent from './content/ChatList.svelte';
  import ChatListOverlay from './content/ChatListOverlay.svelte';
  import { chatStore, listOverlayOptionsStore } from './util/stores.ts';

  const FEATURE_TOGGLE = false;

  let currentListIndex = 0;
  let newListIndex = 0;
  let openMenu = false;

  function showListOverlay(type: 'new' | 'edit', index?: number) {
    if (type === 'new') {
      newListIndex = $chatStore.length;
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
  <title>Chat</title>
  <meta name="Klönschnack" content="Klönschnack" />
</svelte:head>

{#if FEATURE_TOGGLE}
  <section>
    <Drawer
      variant="modal"
      bind:open={openMenu}
      style="width:25%;min-width:max-content;height:max-content;overflow:auto;"
    >
      <Header>
        <Title
          style="text-align:left;margin:0;padding-left: calc(var(--default-padding)/2)"
          >Deine Chats</Title
        >
      </Header>
      <Content>
        <List>
          <!-- Fallback if no chats could be found -->
          {#if $chatStore.length === 0}
            <div
              style="display:flex;gap: var(--default-padding);padding: var(--default-padding);margin:0 0 0 0.5rem;"
            >
              <Icon class="material-icons">search_off</Icon>
              <Text>Keine Chats vorhanden</Text>
            </div>
          {:else}
            <!-- List all chats -->
            {#each $chatStore as list, i (i)}
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
              color={$chatStore.length === 0 ? 'primary' : 'secondary'}
              variant="outlined"
              on:click={() => showListOverlay('new')}
              style="margin: var(--default-padding);"
            >
              <Icon class="material-icons">playlist_add</Icon>
              <Label>Neuen Chat anlegen</Label>
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
        <ChatListComponent listIndex={currentListIndex} />
      </main>
    </AppContent>

    {#if $listOverlayOptionsStore.showOverlay}
      <ChatListOverlay
        listIndex={newListIndex}
        newListName={$chatStore[newListIndex]?.name}
        newListEmoji={$chatStore[newListIndex]?.emoji}
      />
    {/if}
  </section>
{:else}
  <div
    style="display:flex;justify-content:center;align-items:center;height:80vh;"
  >
    <div
      style="display:flex;flex-direction:column;justify-content:center;align-items:center;"
    >
      <Icon class="material-icons" style="font-size: 5rem;">construction</Icon>
      <h1 style="margin:0;">Diese Funktion ist bald verfügbar!</h1>
    </div>
  </div>
{/if}

<style lang="scss">
  @import '../../lib/styles/global.scss';

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
</style>
