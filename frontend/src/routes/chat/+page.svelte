<script lang="ts">
  import ChatListComponent from '$lib/components/chat/ChatList.svelte';
  import ChatListOverlay from '$lib/components/chat/ChatListOverlay.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { chatStore } from '$lib/util/stores/store-chat';
  import { languageStore } from '$lib/util/stores/store-language';
  import { listOverlayOptionsStore } from '$lib/util/stores/store-other';
  import { setLocale } from '$lib/util/translations';
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
  import { onMount } from 'svelte';

  const { chat: chatRoute } = applicationRoutes;

  let currentListIndex = 0;
  let newListIndex = 0;
  let openMenu = false;

  $: locale = $languageStore;

  const showListOverlay = (type: 'new' | 'edit', index?: number) => {
    if (type === 'new') {
      newListIndex = $chatStore.length;
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

  onMount(async () => {
    await setLocale($languageStore);
  });
</script>

<svelte:head>
  <title>{chatRoute.name[locale]}</title>
  <meta name={chatRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if chatRoute.toggle}
  <section>
    <Drawer
      variant="modal"
      bind:open={openMenu}
      style="width:25%;min-width:max-content;height:max-content;overflow:auto;"
    >
      <Header>
        <Title
          style="text-align:left;margin:0;padding-left: calc(var(--default_padding)/2)"
          >Deine Chats</Title
        >
      </Header>
      <Content>
        <List>
          <!-- Fallback if no chats could be found -->
          {#if $chatStore.length === 0}
            <div
              style="display:flex;gap: var(--default_padding);padding: var(--default_padding);margin:0 0 0 0.5rem;"
            >
              <Icon class="material-icons">search_off</Icon>
              <Text>Keine Chats vorhanden</Text>
            </div>
          {:else}
            <!-- List all chats -->
            {#each $chatStore as list, i (i)}
              <Item
                href="javascript:void(0)"
                style="padding-left: calc(var(--default_padding) / 1.5);"
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
              style="margin: var(--default_padding);"
            >
              <Icon class="material-icons">playlist_add</Icon>
              <Label>Neuen Chat anlegen</Label>
            </Button>
          </div>
        </List>
      </Content>
    </Drawer>

    <Scrim />
    <AppContent class="app_content">
      <main class="main_content">
        <IconButton
          color="secondary"
          style="position: absolute;right: 0;top: 0;margin: calc(var(--default_padding)/ 10);"
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
  <ToggledApplicationInfo />
{/if}

<style lang="scss">
  section {
    position: relative;
    display: flex;
    z-index: 0;
  }

  * :global(.app_content) {
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
</style>
