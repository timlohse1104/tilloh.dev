<script lang="ts">
  import {
    localPresetStore,
    presetOverlayOptionsStore,
  } from '$lib/util/memorandum/stores.js';
  import { initialized, t } from '$lib/util/translations';
  import Accordion, { Content, Header, Panel } from '@smui-extra/accordion';
  import Button, { Label } from '@smui/button';
  import Dialog, {
    Actions as DialogActions,
    Content as DialogContent,
    Title,
  } from '@smui/dialog';
  import { Icon } from '@smui/fab';
  import IconButton from '@smui/icon-button';
  import List, { Graphic, Item, Text } from '@smui/list';
  import Snackbar, { Actions } from '@smui/snackbar';
  import hljs from 'highlight.js';
  import { onMount } from 'svelte';

  let codeElement;
  let files: FileList;
  let presetUploadSnackbar: Snackbar;
  let detailOpen = false;
  let configFileInput: HTMLInputElement;

  $: if (files) {
    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result.toString();
        const json = JSON.parse(result);
        localPresetStore.set(json);
        codeElement.innerHTML = JSON.stringify(json, null, 2);
      };
      reader.readAsText(file);
      presetUploadSnackbar.open();
    }
  }

  $: folderAmount = $localPresetStore.Folders.length;
  $: linkAmount = [
    ...$localPresetStore.Folders.map((folder) => folder.links.length),
  ].reduce((a, b) => a + b, 0);

  onMount(() => {
    hljs.highlightAll();
  });

  const closeOverlay = () => {
    $presetOverlayOptionsStore.showOverlay = false;
  };

  const triggerFileSelect = () => {
    configFileInput.click();
  };

  const triggerFileDownload = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify($localPresetStore, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    const date = new Date();
    downloadAnchorNode.setAttribute(
      'download',
      `memorandum-config-${date.toLocaleDateString()}.json`,
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
</script>

<Dialog
  bind:open={$presetOverlayOptionsStore.showOverlay}
  aria-labelledby="large-scroll-title"
  aria-describedby="large-scroll-content"
  surface$style="width: 50vw; max-width: calc(100vw - 32px);"
>
  {#if $initialized}
    <Title id="large-scroll-title">
      {$t('page.memorandum.presetOverlay.title')}

      <p class="large_scroll_subtitle">
        {$t('page.memorandum.presetOverlay.description')}
      </p>
    </Title>

    <Title>
      {$t('page.memorandum.presetOverlay.currentConfigTitle')}
    </Title>

    <List dense>
      <Item style="margin-left:calc(var(--default_padding)/2);">
        <Graphic class="material-icons">folder</Graphic>
        <Text>
          {$t('page.memorandum.presetOverlay.folderAmount', {
            amount: folderAmount,
          })}
        </Text>
      </Item>
      <Item style="margin-left:calc(var(--default_padding)/2);">
        <Graphic class="material-icons">link</Graphic>
        <Text>
          {$t('page.memorandum.presetOverlay.linkAmount', {
            amount: linkAmount,
          })}
        </Text>
      </Item>
    </List>

    <DialogContent id="large-scroll-content">
      <div>
        <Accordion>
          <Panel bind:open={detailOpen}>
            <Header>
              {$t('page.memorandum.presetOverlay.technicalInfoTitle')}

              <IconButton slot="icon" toggle pressed={detailOpen}>
                <Icon class="material-icons" on>expand_less</Icon>
                <Icon class="material-icons">expand_more</Icon>
              </IconButton>
            </Header>
            <Content
              ><pre class="code_container">
            <code class="language-json" bind:this={codeElement}
                  >{JSON.stringify($localPresetStore, null, 2)}</code
                >
          </pre></Content
            >
          </Panel>
        </Accordion>
      </div>
    </DialogContent>

    <DialogActions>
      <Button
        on:click={() => {
          triggerFileSelect();
          event.stopPropagation();
        }}
        variant="outlined"
      >
        <Icon class="material-icons">file_upload</Icon>
        <Label>Import</Label>
      </Button>
      <Button
        on:click={triggerFileDownload}
        color="secondary"
        variant="outlined"
      >
        <Icon class="material-icons">file_download</Icon>
        <Label>Export</Label>
      </Button>
    </DialogActions>
  {:else}
    <Title id="large-scroll-title">Locale initializing...</Title>
  {/if}
</Dialog>

<Snackbar bind:this={presetUploadSnackbar}>
  <Label>
    {$t('page.memorandum.presetOverlay.configImportedLabel')}
  </Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<input
  bind:this={configFileInput}
  type="file"
  bind:files
  style="display: none"
/>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  .code_container {
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: var(--trans);

    code {
      line-height: 1.5;
      font-size: 12px;
      font-family: var(--font_mono);
      background-color: var(--pre_background);
      border-radius: 3px;
      padding: 0.5em;
      overflow-x: auto;
      color: var(--color_text);
    }
  }

  .large_scroll_subtitle {
    font-size: 1rem;
  }
</style>
