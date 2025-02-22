<script lang="ts">
  import CreateListButton from '$lib/components/lists/CreateListButton.svelte';
  import ListComponent from '$lib/components/lists/List.svelte';
  import ListOverlay from '$lib/components/lists/ListOverlay.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import {
    currentListIndexStore,
    listStore,
    newListIndexStore,
  } from '$lib/util/stores/store-list';
  import { listOverlayOptionsStore } from '$lib/util/stores/store-other';
  import { initialized, setLocale, t } from '$lib/util/translations';
  import { Icon } from '@smui/common';
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
  import { onMount } from 'svelte';

  const { lists: listsRoute } = applicationRoutes;

  let openMenu = false;

  $: locale = $languageStore;

  const showListOverlay = (type: 'new' | 'edit', index?: number) => {
    if (type === 'new') {
      $newListIndexStore = $listStore.length;
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.type = type;
    } else {
      $currentListIndexStore = index;
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.type = type;
    }
  };

  const setActiveList = (index: number) => {
    $currentListIndexStore = index;
    openMenu = false;
  };

  onMount(async () => {
    await setLocale($languageStore);
  });
</script>

<svelte:head>
  <title>{listsRoute.name[locale]}</title>
  <meta name={listsRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if listsRoute.toggle}
  {#if $initialized}
    <section>
      <Drawer variant="modal" bind:open={openMenu} class="lists_side_drawer">
        <Header>
          <Title
            style="text-align:left;margin:0;padding-left: calc(var(--default_padding)/2)"
            >{$t('page.lists.sideMenu.title')}</Title
          >
          <Subtitle class="lists_side_menu_description"
            >{$t('page.lists.sideMenu.description')}</Subtitle
          >
          <Subtitle class="lists_side_menu_description"
            >{$t('page.lists.sideMenu.persistenceInfo')}</Subtitle
          >
        </Header>
        <Content>
          <List>
            {#if $listStore.length === 0}
              <div
                style="display:flex;gap: var(--default_padding);padding: var(--default_padding);margin:0 0 0 0.5rem;"
              >
                <Icon class="material-icons">search_off</Icon>
                <Text>{$t('page.lists.sideMenu.emptyInfo')}</Text>
              </div>
            {:else}
              <!-- Show all lists -->
              {#each $listStore as list, i (i)}
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
            <CreateListButton />
          </List>
        </Content>
      </Drawer>

      <Scrim />
      <AppContent class="app_content">
        <main class="main_content">
          <IconButton
            color="secondary"
            class="lists_menu_button"
            size="button"
            on:click={() => (openMenu = !openMenu)}
          >
            <Icon class="material-icons">menu</Icon>
          </IconButton>
          <ListComponent listIndex={$currentListIndexStore} />
        </main>
      </AppContent>

      {#if $listOverlayOptionsStore.showOverlay}
        <ListOverlay
          listIndex={$newListIndexStore}
          newListName={$listStore[$newListIndexStore]?.name}
          newListEmoji={$listStore[$newListIndexStore]?.emoji}
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
  @use '../../lib/styles/variables.scss' as *;

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

  :global(.lists_side_menu_description) {
    text-align: left;
    margin: 0 0 var(--default_padding) 0;
    padding-left: calc(var(--default_padding) / 2);
  }

  :global(.lists_menu_button) {
    position: absolute;
    left: 0;
    top: 0;
    margin: 1rem;
  }

  :global(.lists_side_drawer) {
    width: 25%;
    max-width: max-content;
    height: max-content;
    overflow: auto;

    @media #{$tablet} {
      width: 50%;
    }

    @media #{$phone} {
      width: 75%;
    }
  }
</style>
